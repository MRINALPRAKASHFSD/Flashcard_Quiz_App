export interface Division {
  id: string;
  title: string;
  subtitle?: string;
  scoreRule?: string;
  questionCount?: number;
}

export interface Question {
  id: number | string;
  level: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  clues?: string[];
  points: number;
  isOpinion?: boolean;
  datasetId?: string;
  selected?: boolean;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  version: string;
  updatedAt: string;
  divisions: Division[];
  questions: Question[];
}

export interface GitHubSyncSettings {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface QuizCMSConfig {
  activeDatasetId: string;
  selectedDivisions: string[]; // ["All"] or array of division IDs
  selectedQuestionIds: (number | string)[]; // Explicitly selected question IDs. ["*"] means all.
  questionLimit: number; // 0 = unlimited / all selected
  enableQuestionRandomizer: boolean;
  enableOptionShuffle: boolean;
  enableRandomSampling: boolean;
  sampleCount: number;
  githubSync: GitHubSyncSettings;
}

export const DEFAULT_CMS_CONFIG: QuizCMSConfig = {
  activeDatasetId: "default_quiz_dataset",
  selectedDivisions: ["All"],
  selectedQuestionIds: ["*"],
  questionLimit: 0,
  enableQuestionRandomizer: true,
  enableOptionShuffle: true,
  enableRandomSampling: false,
  sampleCount: 10,
  githubSync: {
    token: "",
    owner: "",
    repo: "Flashcard_Quiz_App",
    branch: "main",
  },
};
