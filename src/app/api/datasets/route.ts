import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATASET_DIR = path.join(process.cwd(), "Assets", "dataset");
const PUBLIC_DATASET_DIR = path.join(process.cwd(), "public", "assets", "dataset");

export async function GET() {
  try {
    if (!fs.existsSync(DATASET_DIR)) {
      return NextResponse.json({ success: true, datasets: [] });
    }

    const files = fs.readdirSync(DATASET_DIR).filter((f) => f.endsWith(".json"));
    const datasets = [];

    for (const file of files) {
      try {
        const filePath = path.join(DATASET_DIR, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(fileContent);
        datasets.push({
          filename: file,
          ...parsed,
        });
      } catch (err) {
        console.error(`Failed to parse dataset file ${file}:`, err);
      }
    }

    return NextResponse.json({ success: true, datasets });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load datasets from Assets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { dataset } = body;

    if (!dataset || !dataset.id) {
      return NextResponse.json({ success: false, error: "Invalid dataset object" }, { status: 400 });
    }

    // Ensure directory exists
    if (!fs.existsSync(DATASET_DIR)) {
      fs.mkdirSync(DATASET_DIR, { recursive: true });
    }
    if (!fs.existsSync(PUBLIC_DATASET_DIR)) {
      fs.mkdirSync(PUBLIC_DATASET_DIR, { recursive: true });
    }

    const filename = `${dataset.id.toLowerCase().replace(/[^a-z0-9_-]/g, "_")}.json`;
    const targetPath = path.join(DATASET_DIR, filename);
    const publicTargetPath = path.join(PUBLIC_DATASET_DIR, filename);

    const contentToWrite = JSON.stringify(dataset, null, 2);

    fs.writeFileSync(targetPath, contentToWrite, "utf-8");
    try {
      fs.writeFileSync(publicTargetPath, contentToWrite, "utf-8");
    } catch {
      // Ignore public folder write errors if any
    }

    return NextResponse.json({
      success: true,
      message: `Dataset saved to Assets/dataset/${filename}`,
      filename,
    });
  } catch (error: any) {
    // Return friendly status for Vercel/serverless where filesystem write might be read-only
    return NextResponse.json(
      {
        success: false,
        error: error.message || "FileSystem write failed. (If on Vercel, changes are saved in Local DB)",
        isServerlessReadOnly: true,
      },
      { status: 200 }
    );
  }
}
