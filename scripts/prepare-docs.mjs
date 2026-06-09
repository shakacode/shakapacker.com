import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

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
const upstreamRoot = path.join(workspaceRoot, "content", "upstream");
const sourceDocs = path.join(upstreamRoot, "docs");
const sourceChangelog = path.join(upstreamRoot, "CHANGELOG.md");
const upstreamRepoBlobBase = "https://github.com/shakacode/shakapacker/blob/main";

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

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

export function rewriteChangelogLinkTarget(target) {
  if (!target) {
    return target;
  }
  if (/^(https?:|mailto:|tel:|ftp:|#|\/)/i.test(target)) {
    return target;
  }

  const stripped = target.replace(/^\.\//, "");

  if (stripped.startsWith("docs/")) {
    const docsPath = stripped.slice("docs/".length).replace(/\.(md|mdx)(?=([?#]|$))/i, "");
    return `/docs/${docsPath}`;
  }

  return `${upstreamRepoBlobBase}/${stripped}`;
}

function replaceMarkdownLinkTargets(markdown, mapTarget) {
  const linkPattern = /(!?\[[^\]]*\])\(([^)]+)\)/g;
  return markdown.replace(linkPattern, (match, label, rawTarget) => {
    const titleMatch = rawTarget.match(/^(\S+)(\s+(?:"[^"]*"|'[^']*'))?\s*$/);
    if (!titleMatch) {
      return match;
    }
    const url = titleMatch[1];
    const title = titleMatch[2] ?? "";
    return `${label}(${mapTarget(url)}${title})`;
  });
}

export function rewriteChangelogLinks(markdown) {
  return replaceMarkdownLinkTargets(markdown, rewriteChangelogLinkTarget);
}

// Resolves a relative link found inside a synced doc against that doc's location in the
// upstream `docs/` tree. Links that stay within `docs/` are valid Docusaurus routes and are
// left untouched; links that escape the tree (e.g. `../README.md`, `../lib/...`) point at repo
// files that aren't published on the site, so they are rewritten to absolute GitHub URLs.
export function rewriteDocLinkTarget(rawTarget, docRelativePath) {
  if (!rawTarget) {
    return rawTarget;
  }
  // External, root-absolute, protocol, or pure-anchor targets are already resolvable.
  if (/^(https?:|mailto:|tel:|ftp:|#|\/)/i.test(rawTarget)) {
    return rawTarget;
  }

  // Resolve only the path, preserving any trailing `?query` / `#fragment`.
  const suffixIndex = rawTarget.search(/[?#]/);
  const pathPart = suffixIndex === -1 ? rawTarget : rawTarget.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? "" : rawTarget.slice(suffixIndex);
  if (pathPart === "") {
    return rawTarget;
  }

  const docDir = path.posix.dirname(path.posix.join("docs", toPosix(docRelativePath)));
  const resolved = path.posix.normalize(path.posix.join(docDir, pathPart));

  // Stays inside the published docs tree: leave the relative link for Docusaurus to resolve.
  if (resolved === "docs" || resolved.startsWith("docs/")) {
    return rawTarget;
  }

  // Escaped above the repo root: nothing sensible to point at, so leave it unchanged.
  if (resolved.startsWith("..")) {
    return rawTarget;
  }

  return `${upstreamRepoBlobBase}/${resolved}${suffix}`;
}

export function rewriteDocLinks(markdown, docRelativePath) {
  return replaceMarkdownLinkTargets(markdown, (target) =>
    rewriteDocLinkTarget(target, docRelativePath)
  );
}

// Upstream docs occasionally link to anchors whose headings have since been renamed. Docusaurus
// flags these as broken anchors. Until each is fixed upstream, repoint the known-stale anchors to
// the current heading during the prepare step. Keyed by the doc's path within `docs/`.
const KNOWN_ANCHOR_CORRECTIONS = {
  "rspack_migration_guide.md": [
    [
      "./troubleshooting.md#exporting-webpack--rspack-configuration",
      "./troubleshooting.md#debugging-your-webpack-config"
    ]
  ]
};

export function correctKnownBrokenAnchors(markdown, docRelativePath) {
  const corrections = KNOWN_ANCHOR_CORRECTIONS[toPosix(docRelativePath)];
  if (!corrections) {
    return markdown;
  }
  let result = markdown;
  for (const [from, to] of corrections) {
    result = result.replaceAll(from, to);
  }
  return result;
}

export function buildChangelogMarkdown(upstreamMarkdown) {
  const linkFixed = rewriteChangelogLinks(upstreamMarkdown);
  const downgraded = linkFixed.replace(/^# Versions\b/m, "## Versions");

  const frontmatter = [
    "---",
    "title: Changelog",
    'description: Release history for Shakapacker, synced from the upstream repository.',
    "sidebar_position: 99",
    "mdx:",
    "  format: md",
    "---",
    ""
  ].join("\n");

  const intro = [
    "# Changelog",
    "",
    "Release notes for [Shakapacker](https://github.com/shakacode/shakapacker), synced from the upstream `CHANGELOG.md`.",
    ""
  ].join("\n");

  return `${frontmatter}\n${intro}\n${downgraded.trimEnd()}\n`;
}

async function writeChangelog(docsRoot) {
  if (!(await exists(sourceChangelog))) {
    console.warn(`No upstream CHANGELOG.md at ${sourceChangelog}; skipping changelog page.`);
    return;
  }

  const raw = await fs.readFile(sourceChangelog, "utf8");
  const rendered = buildChangelogMarkdown(raw);
  const outputPath = path.join(docsRoot, "changelog.md");
  await fs.writeFile(outputPath, rendered, "utf8");
  console.log(`Generated changelog at ${outputPath}`);
}

async function rewriteRelativeDocLinks(docsRoot) {
  let filesUpdated = 0;

  await walkFiles(docsRoot, async (absoluteFile, relativeFile) => {
    if (!relativeFile.endsWith(".md") && !relativeFile.endsWith(".mdx")) {
      return;
    }

    const original = await fs.readFile(absoluteFile, "utf8");
    const linkRewritten = rewriteDocLinks(original, relativeFile);
    const updated = correctKnownBrokenAnchors(linkRewritten, relativeFile);
    if (updated !== original) {
      await fs.writeFile(absoluteFile, updated, "utf8");
      filesUpdated += 1;
    }
  });

  if (filesUpdated > 0) {
    console.log(`Rewrote out-of-tree doc links in ${filesUpdated} files`);
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
  await rewriteRelativeDocLinks(docsRoot);
  await normalizeCodeFences(docsRoot);
  await writeChangelog(docsRoot);

  console.log(`Prepared docusaurus docs from ${sourceDocs}`);
}

async function main() {
  if (target && target !== "docusaurus") {
    throw new Error("Only docusaurus is supported. Use --target docusaurus.");
  }

  await prepareDocusaurus();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
