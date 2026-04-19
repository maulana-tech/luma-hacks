import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const targetPath = path.join(rootDir, ".env.local");

// Priority: use local template first, fallback to generic template.
const candidates = [
  path.join(rootDir, ".env.example"),
  path.join(rootDir, ".env.example.fuji"),
];

if (fs.existsSync(targetPath)) {
  console.log(".env.local already exists. No changes made.");
  process.exit(0);
}

const sourcePath = candidates.find((file) => fs.existsSync(file));

if (!sourcePath) {
  console.error("No env template found. Expected .env.example or .env.example.fuji");
  process.exit(1);
}

fs.copyFileSync(sourcePath, targetPath);
console.log(`Created .env.local from ${path.basename(sourcePath)}`);
