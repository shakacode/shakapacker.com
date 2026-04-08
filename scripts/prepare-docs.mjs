import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

function argValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] ?? null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");

const target = argValue("--target");
const sourceDocs = path.join(workspaceRoot, "content", "upstream", "docs");

async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function ensureExists(targetPath, message) {
  try {
    await fs.access(targetPath);
  } catch {
    throw new Error(message);
  }
}

function titleFromPath(relativePath) {
  const withoutExt = relativePath.replace(/\.(md|mdx)$/i, "");
  return withoutExt
    .split("/")
    .pop()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function writeDocsHome(docsRoot) {
  const preferred = [
    "configuration.md",
    "deployment.md",
    "api-reference.md",
    "troubleshooting.md",
    "common-upgrades.md",
    "v9_upgrade.md",
    "rspack_migration_guide.md",
    "typescript.md"
  ];

  const links = [];
  for (const relativePath of preferred) {
    const absolutePath = path.join(docsRoot, relativePath);
    if (!(await exists(absolutePath))) {
      continue;
    }
    links.push(`- [${titleFromPath(relativePath)}](./${relativePath})`);
  }

  const markdown = `# Shakapacker Documentation

Welcome to the official Shakapacker documentation.

Canonical source lives in [shakacode/shakapacker](https://github.com/shakacode/shakapacker/tree/main/docs).

## Key Guides

${links.join("\n")}
`;

  await fs.writeFile(path.join(docsRoot, "README.md"), markdown, "utf8");
}

async function walkFiles(dir, callback, relativePrefix = "") {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = relativePrefix ? path.join(relativePrefix, entry.name) : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(abs, callback, rel);
      continue;
    }
    if (entry.isFile()) {
      await callback(abs, rel);
    }
  }
}

const languageRemapping = {
  rsc: "text",
  procfile: "yaml",
  Procfile: "yaml",
  "Procfile.dev": "yaml",
  gitignore: "ignore",
  JSON: "json"
};

function detectCodeLanguage(content) {
  const lines = content.split("\n");
  const firstLine = lines[0] || "";

  if (firstLine.startsWith("#!/")) return "bash";
  if (/^\$ /.test(firstLine)) return "bash";
  if (/^(yarn |npm |npx |bundle exec |rails |bin\/)/.test(firstLine)) return "bash";
  if (/^[A-Z_]+=\S+$/.test(firstLine.trim()) && lines.length <= 2) return "bash";

  if (/\b(const |let |var |require\(|module\.exports|import )/.test(content)) return "js";

  return "text";
}

function normalizeCodeFencesInMarkdown(markdown) {
  const lines = markdown.split("\n");
  let inBlock = false;
  let blockOpenIdx = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inBlock && /^```\S/.test(line)) {
      const lang = line.slice(3).trim();
      if (languageRemapping[lang]) {
        lines[i] = `\`\`\`${languageRemapping[lang]}`;
      }
      inBlock = true;
      continue;
    }

    if (!inBlock && /^```\s*$/.test(line)) {
      blockOpenIdx = i;
      inBlock = true;
      continue;
    }

    if (inBlock && /^```\s*$/.test(line)) {
      if (blockOpenIdx >= 0) {
        const blockContent = lines.slice(blockOpenIdx + 1, i).join("\n");
        lines[blockOpenIdx] = `\`\`\`${detectCodeLanguage(blockContent)}`;
        blockOpenIdx = -1;
      }
      inBlock = false;
    }
  }

  return lines.join("\n");
}

async function normalizeCodeFences(docsRoot) {
  let filesUpdated = 0;

  await walkFiles(docsRoot, async (absoluteFile, relativeFile) => {
    if (!relativeFile.endsWith(".md") && !relativeFile.endsWith(".mdx")) {
      return;
    }

    const original = await fs.readFile(absoluteFile, "utf8");
    const updated = normalizeCodeFencesInMarkdown(original);
    if (updated !== original) {
      await fs.writeFile(absoluteFile, updated, "utf8");
      filesUpdated += 1;
    }
  });

  if (filesUpdated > 0) {
    console.log(`Normalized code fences in ${filesUpdated} files`);
  }
}

async function prepareDocusaurus() {
  const siteRoot = path.join(workspaceRoot, "prototypes", "docusaurus");
  const docsRoot = path.join(siteRoot, "docs");

  await ensureExists(
    sourceDocs,
    `Source docs not found at ${sourceDocs}. Run \`npm run sync:docs\` first.`
  );

  await fs.rm(docsRoot, { recursive: true, force: true });
  await fs.mkdir(docsRoot, { recursive: true });
  await fs.cp(sourceDocs, docsRoot, { recursive: true });
  await writeDocsHome(docsRoot);
  await normalizeCodeFences(docsRoot);

  console.log(`Prepared docusaurus docs from ${sourceDocs}`);
}

async function main() {
  if (target && target !== "docusaurus") {
    throw new Error("Only docusaurus is supported. Use --target docusaurus.");
  }

  await prepareDocusaurus();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
