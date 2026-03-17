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
