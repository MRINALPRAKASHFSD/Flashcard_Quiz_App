import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || process.env.NEXT_PUBLIC_GITHUB_OWNER || "";
const GITHUB_REPO = process.env.GITHUB_REPO || process.env.NEXT_PUBLIC_GITHUB_REPO || "";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";

const LOCAL_DATASET_DIR = path.join(process.cwd(), "Assets", "dataset");

export async function GET() {
  try {
    // If GitHub token and repo details are configured, fetch directly from GitHub Repo API
    if (GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO) {
      const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/Assets/dataset?ref=${GITHUB_BRANCH}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "Flashcard-Quiz-App-CMS",
        },
        cache: "no-store",
      });

      if (res.ok) {
        const files = await res.json();
        const jsonFiles = Array.isArray(files) ? files.filter((f: any) => f.name.endsWith(".json")) : [];
        const datasets = [];

        for (const file of jsonFiles) {
          if (file.download_url) {
            const contentRes = await fetch(file.download_url, { cache: "no-store" });
            if (contentRes.ok) {
              const datasetJson = await contentRes.json();
              datasets.push({
                filename: file.name,
                sha: file.sha,
                ...datasetJson,
              });
            }
          }
        }

        return NextResponse.json({
          success: true,
          source: "github_repo",
          repo: `${GITHUB_OWNER}/${GITHUB_REPO}`,
          branch: GITHUB_BRANCH,
          datasets,
        });
      }
    }

    // Fallback to local disk Assets/dataset/ if running locally or GitHub token not set
    if (fs.existsSync(LOCAL_DATASET_DIR)) {
      const files = fs.readdirSync(LOCAL_DATASET_DIR).filter((f) => f.endsWith(".json"));
      const datasets = [];

      for (const file of files) {
        try {
          const filePath = path.join(LOCAL_DATASET_DIR, file);
          const fileContent = fs.readFileSync(filePath, "utf-8");
          datasets.push({
            filename: file,
            ...JSON.parse(fileContent),
          });
        } catch {
          // Ignore bad json
        }
      }

      return NextResponse.json({
        success: true,
        source: "local_disk",
        datasets,
      });
    }

    return NextResponse.json({ success: true, source: "empty", datasets: [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "GitHub API fetch error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dataset, commitMessage, customOwner, customRepo, customToken, customBranch } = body;

    const token = customToken || GITHUB_TOKEN;
    const owner = customOwner || GITHUB_OWNER;
    const repo = customRepo || GITHUB_REPO;
    const branch = customBranch || GITHUB_BRANCH;

    if (!dataset || !dataset.id) {
      return NextResponse.json({ success: false, error: "Invalid dataset object" }, { status: 400 });
    }

    const filename = `${dataset.id.toLowerCase().replace(/[^a-z0-9_-]/g, "_")}.json`;
    const filePathInRepo = `Assets/dataset/${filename}`;
    const fileContentStr = JSON.stringify(dataset, null, 2);
    const base64Content = Buffer.from(fileContentStr).toString("base64");

    // 1. Also update local disk if fs write is possible
    try {
      if (!fs.existsSync(LOCAL_DATASET_DIR)) {
        fs.mkdirSync(LOCAL_DATASET_DIR, { recursive: true });
      }
      fs.writeFileSync(path.join(LOCAL_DATASET_DIR, filename), fileContentStr, "utf-8");
    } catch {
      // Ignored on read-only serverless
    }

    // 2. Commit directly to GitHub Repository if credentials provided
    if (token && owner && repo) {
      const getFileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePathInRepo}?ref=${branch}`;
      let existingSha: string | undefined;

      try {
        const getRes = await fetch(getFileUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "Flashcard-Quiz-App-CMS",
          },
          cache: "no-store",
        });
        if (getRes.ok) {
          const fileData = await getRes.json();
          existingSha = fileData.sha;
        }
      } catch {
        // New file, no sha
      }

      const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePathInRepo}`;
      const putRes = await fetch(putUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
          "User-Agent": "Flashcard-Quiz-App-CMS",
        },
        body: JSON.stringify({
          message: commitMessage || `cms: update ${filename} dataset in Assets/dataset/`,
          content: base64Content,
          sha: existingSha,
          branch,
        }),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json();
        return NextResponse.json(
          {
            success: false,
            error: errJson.message || "GitHub API commit failed",
            details: errJson,
          },
          { status: putRes.status }
        );
      }

      const gitData = await putRes.json();
      return NextResponse.json({
        success: true,
        source: "github_commit",
        commitSha: gitData.commit?.sha,
        commitUrl: gitData.commit?.html_url,
        message: `Committed & pushed ${filePathInRepo} directly to ${owner}/${repo} on branch '${branch}'!`,
      });
    }

    return NextResponse.json({
      success: true,
      source: "local_only",
      message: `Saved dataset locally. (To sync automatically with GitHub on Vercel, configure GITHUB_TOKEN & GITHUB_REPO in settings).`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "GitHub commit error" },
      { status: 500 }
    );
  }
}
