import { Dataset, Question, QuizCMSConfig, DEFAULT_CMS_CONFIG, Division } from "../types/cms";

const DB_NAME = "FlashcardQuizCMS_DB";
const DB_VERSION = 2;

const STORAGE_KEYS = {
  CONFIG: "flashcard_cms_config",
  DATASETS: "flashcard_cms_datasets",
  ACTIVE_ID: "flashcard_cms_active_id",
};

class CMSStorageService {
  private db: IDBDatabase | null = null;
  private isBrowser: boolean = typeof window !== "undefined";

  constructor() {
    if (this.isBrowser) {
      this.initDB();
    }
  }

  public async initDB(): Promise<IDBDatabase | null> {
    if (!this.isBrowser) return null;
    if (this.db) return this.db;

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains("datasets")) {
            db.createObjectStore("datasets", { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains("config")) {
            db.createObjectStore("config", { keyPath: "key" });
          }
        };

        request.onsuccess = async (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          await this.seedInitialDatasets();
          resolve(this.db);
        };

        request.onerror = (event) => {
          console.warn("IndexedDB failed to open, falling back to LocalStorage:", event);
          resolve(null);
        };
      } catch (err) {
        console.warn("IndexedDB initialization error:", err);
        resolve(null);
      }
    });
  }

  private async seedInitialDatasets() {
    try {
      const datasets = await this.getDatasets();
      if (datasets.length === 0) {
        let defaultData: Dataset | null = null;

        // Try GitHub sync API first
        try {
          const ghRes = await fetch("/api/github/sync");
          if (ghRes.ok) {
            const data = await ghRes.json();
            if (data.datasets && data.datasets.length > 0) {
              for (const ds of data.datasets) {
                await this.saveDataset(ds, false);
              }
              return;
            }
          }
        } catch {
          // Ignore
        }

        // Static fallback
        try {
          const res = await fetch("/assets/dataset/default_quiz_dataset.json");
          if (res.ok) {
            defaultData = await res.json();
          }
        } catch {
          // Ignore
        }

        if (defaultData) {
          await this.saveDataset(defaultData, false);
        }
      }
    } catch (e) {
      console.error("Error seeding initial datasets:", e);
    }
  }

  public async getDatasets(): Promise<Dataset[]> {
    if (!this.isBrowser) return [];

    if (this.db) {
      return new Promise((resolve) => {
        try {
          const transaction = this.db!.transaction("datasets", "readonly");
          const store = transaction.objectStore("datasets");
          const request = store.getAll();

          request.onsuccess = () => {
            const results: Dataset[] = request.result || [];
            if (results.length > 0) {
              resolve(results);
            } else {
              resolve(this.getDatasetsFromLocalStorage());
            }
          };

          request.onerror = () => {
            resolve(this.getDatasetsFromLocalStorage());
          };
        } catch {
          resolve(this.getDatasetsFromLocalStorage());
        }
      });
    }

    return this.getDatasetsFromLocalStorage();
  }

  private getDatasetsFromLocalStorage(): Dataset[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DATASETS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public async getActiveDataset(): Promise<Dataset | null> {
    const config = await this.getQuizConfig();
    const datasets = await this.getDatasets();

    if (datasets.length === 0) return null;
    const active = datasets.find((d) => d.id === config.activeDatasetId);
    return active || datasets[0];
  }

  /**
   * Save Dataset locally & commit directly to GitHub repository if credentials exist
   */
  public async saveDataset(dataset: Dataset, pushToGitHub: boolean = true): Promise<{ success: boolean; message: string }> {
    if (!this.isBrowser) return { success: false, message: "Not in browser" };

    dataset.updatedAt = new Date().toISOString();

    // 1. Save to IndexedDB
    if (this.db) {
      try {
        const transaction = this.db.transaction("datasets", "readwrite");
        const store = transaction.objectStore("datasets");
        store.put(dataset);
      } catch (err) {
        console.warn("IndexedDB put failed:", err);
      }
    }

    // 2. Backup to LocalStorage
    try {
      const datasets = this.getDatasetsFromLocalStorage();
      const idx = datasets.findIndex((d) => d.id === dataset.id);
      if (idx >= 0) {
        datasets[idx] = dataset;
      } else {
        datasets.push(dataset);
      }
      localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
    } catch (e) {
      console.warn("LocalStorage save dataset failed:", e);
    }

    // 3. Commit to GitHub API if requested
    let githubMessage = "";
    if (pushToGitHub) {
      try {
        const config = await this.getQuizConfig();
        const res = await fetch("/api/github/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataset,
            commitMessage: `cms: update dataset '${dataset.name}' in Assets/dataset/`,
            customOwner: config.githubSync?.owner,
            customRepo: config.githubSync?.repo,
            customToken: config.githubSync?.token,
            customBranch: config.githubSync?.branch,
          }),
        });

        const data = await res.json();
        if (data.success && data.source === "github_commit") {
          githubMessage = ` & pushed to GitHub repo (${data.commitSha?.slice(0, 7)})`;
        } else if (data.message) {
          githubMessage = ` (${data.message})`;
        }
      } catch (e) {
        console.warn("GitHub API commit sync failed:", e);
      }
    }

    return {
      success: true,
      message: `Dataset saved to Local DB${githubMessage}!`,
    };
  }

  public async deleteDataset(datasetId: string): Promise<boolean> {
    if (!this.isBrowser) return false;

    if (this.db) {
      try {
        const transaction = this.db.transaction("datasets", "readwrite");
        const store = transaction.objectStore("datasets");
        store.delete(datasetId);
      } catch (e) {
        console.warn("IndexedDB delete failed:", e);
      }
    }

    try {
      const datasets = this.getDatasetsFromLocalStorage().filter((d) => d.id !== datasetId);
      localStorage.setItem(STORAGE_KEYS.DATASETS, JSON.stringify(datasets));
    } catch (e) {
      console.warn("LocalStorage dataset delete failed:", e);
    }

    return true;
  }

  public async getQuizConfig(): Promise<QuizCMSConfig> {
    if (!this.isBrowser) return DEFAULT_CMS_CONFIG;

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_CMS_CONFIG,
          ...parsed,
          githubSync: {
            ...DEFAULT_CMS_CONFIG.githubSync,
            ...(parsed.githubSync || {}),
          },
        };
      }
    } catch (e) {
      console.warn("Failed to load config from LocalStorage:", e);
    }

    return DEFAULT_CMS_CONFIG;
  }

  public async saveQuizConfig(config: QuizCMSConfig): Promise<void> {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save CMS config:", e);
    }
  }

  /**
   * Get Questions prepared for Quiz session according to Selected Divisions,
   * Selected Individual Checkboxes, Question Limits, and Randomizer
   */
  public async getPreparedQuizQuestions(): Promise<{
    questions: Question[];
    divisions: Division[];
    totalDatasetQuestions: number;
    selectedQuestionsCount: number;
  }> {
    const activeDataset = await this.getActiveDataset();
    const config = await this.getQuizConfig();

    if (!activeDataset || !activeDataset.questions) {
      return {
        questions: [],
        divisions: [],
        totalDatasetQuestions: 0,
        selectedQuestionsCount: 0,
      };
    }

    let questionsPool = [...activeDataset.questions];

    // 1. Filter by Selected Divisions
    const selectedDivisions = config.selectedDivisions || ["All"];
    if (!selectedDivisions.includes("All") && selectedDivisions.length > 0) {
      questionsPool = questionsPool.filter(
        (q) => selectedDivisions.includes(q.category) || selectedDivisions.includes(q.level)
      );
    }

    // 2. Filter by Explicit Selected Question Checkboxes (if specified)
    const selectedIds = config.selectedQuestionIds || ["*"];
    if (!selectedIds.includes("*")) {
      questionsPool = questionsPool.filter((q) => selectedIds.includes(q.id));
    }

    const selectedQuestionsCount = questionsPool.length;

    // 3. Question Sequence Randomizer
    if (config.enableQuestionRandomizer) {
      questionsPool = this.shuffleArray(questionsPool);
    }

    // 4. Question Limit
    if (config.questionLimit > 0 && config.questionLimit < questionsPool.length) {
      questionsPool = questionsPool.slice(0, config.questionLimit);
    } else if (config.enableRandomSampling && config.sampleCount > 0 && config.sampleCount < questionsPool.length) {
      questionsPool = questionsPool.slice(0, config.sampleCount);
    }

    // 5. Option Choice Shuffler (A, B, C, D)
    if (config.enableOptionShuffle) {
      questionsPool = questionsPool.map((q) => this.shuffleQuestionOptions(q));
    }

    return {
      questions: questionsPool,
      divisions: activeDataset.divisions || [],
      totalDatasetQuestions: activeDataset.questions.length,
      selectedQuestionsCount,
    };
  }

  private shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private shuffleQuestionOptions(q: Question): Question {
    if (!q.options || q.options.length <= 1) return q;

    const indexedOptions = q.options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === q.correctAnswer,
    }));

    const shuffled = this.shuffleArray(indexedOptions);
    const newCorrectIndex = shuffled.findIndex((o) => o.isCorrect);

    return {
      ...q,
      options: shuffled.map((o) => o.text),
      correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : q.correctAnswer,
    };
  }
}

export const cmsStorage = new CMSStorageService();
