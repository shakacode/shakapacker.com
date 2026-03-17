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
const dateStamp = new Date().toISOString().slice(0, 10);
const docsRoot = path.resolve(
  argValue("--docs-root") ?? path.join(workspaceRoot, "prototypes", "docusaurus", "docs")
);
const outputPath = path.resolve(
  argValue("--output") ?? path.join(workspaceRoot, `VALIDATION_REPORT_${dateStamp}.md`)
);

const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

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

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function safeRoute(relativePath) {
  return `/docs/${relativePath.replace(/\.(md|mdx)$/i, "")}`;
}

function isExternalLink(target) {
  return (
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:") ||
    target.startsWith("#") ||
    target.startsWith("/")
  );
}

function resolveRelativeDocPath(currentRelativePath, rawTarget) {
  const sourceDir = path.posix.dirname(toPosix(currentRelativePath));
  return path.posix.normalize(path.posix.join(sourceDir, rawTarget));
}

function findBrokenRelativeMarkdownLinks(content, currentRelativePath, knownDocs) {
  const issues = [];
  let match;

  while ((match = markdownLinkPattern.exec(content)) !== null) {
    const target = match[1].trim();
    const targetOnlyMatch = target.match(/^([^\s]+)(\s+["'][^"']*["'])?$/);
    if (!targetOnlyMatch) {
      continue;
    }

    const targetOnly = targetOnlyMatch[1];
    if (isExternalLink(targetOnly)) {
      continue;
    }

    const [targetPathAndQuery] = targetOnly.split("#");
    const [targetPath] = targetPathAndQuery.split("?");
    const resolved = resolveRelativeDocPath(currentRelativePath, targetPath);

    if (resolved.startsWith("..")) {
      continue;
    }

    const normalized = toPosix(resolved);

    if (/\.(md|mdx)$/i.test(normalized)) {
      if (!knownDocs.has(normalized)) {
        issues.push(`Missing markdown target: ${targetOnly}`);
      }
      continue;
    }

    if (!knownDocs.has(`${normalized}.md`) && !knownDocs.has(`${normalized}.mdx`)) {
      issues.push(`Unresolved relative target: ${targetOnly}`);
    }
  }

  return [...new Set(issues)];
}

function evaluatePage(relativePath, content, knownDocs) {
  const lines = content.split(/\r?\n/);
  const comments = [];

  const firstContentLine = lines.find((line) => line.trim().length > 0) ?? "";
  if (!firstContentLine.startsWith("# ")) {
    comments.push("Missing top-level `#` heading; normalize to a single H1.");
  }

  const linkIssues = findBrokenRelativeMarkdownLinks(content, relativePath, knownDocs);
  comments.push(...linkIssues);

  const placeholderLines = lines
    .map((line, index) => ({ line, number: index + 1 }))
    .filter(({ line }) => /\b(TODO|TBD|xxx|blah blah)\b/i.test(line))
    .map(({ number }) => number);

  if (placeholderLines.length > 0) {
    comments.push(`Placeholder text found on line(s) ${placeholderLines.join(", ")}.`);
  }

  if (comments.length === 0) {
    comments.push("No blocking issues detected.");
  }

  return {
    relativePath: toPosix(relativePath),
    route: safeRoute(toPosix(relativePath)),
    comments,
    hasFindings: comments[0] !== "No blocking issues detected."
  };
}

function buildReport(pages) {
  const total = pages.length;
  const flagged = pages.filter((page) => page.hasFindings).length;
  const clean = total - flagged;
  const generatedAt = new Date().toISOString();
  const relativeDocsRoot = path.relative(workspaceRoot, docsRoot).split(path.sep).join("/") || ".";

  const summary = [
    "# Docs Validation Report",
    "",
    `Generated: ${generatedAt}`,
    `Docs root: \`${relativeDocsRoot}\``,
    `Pages scanned: ${total}`,
    `Pages with findings: ${flagged}`,
    `Pages clean: ${clean}`,
    "",
    "## Page-by-page comments",
    ""
  ];

  const body = pages
    .map((page) => {
      const lines = [`### ${page.relativePath}`, `Route: \`${page.route}\``];
      for (const comment of page.comments) {
        lines.push(`- ${comment}`);
      }
      lines.push("");
      return lines.join("\n");
    })
    .join("\n");

  return `${summary.join("\n")}\n${body}`;
}

async function main() {
  const pages = [];
  const knownDocs = new Set();

  await walkFiles(docsRoot, async (absolutePath, relativePath) => {
    if (!relativePath.endsWith(".md") && !relativePath.endsWith(".mdx")) {
      return;
    }

    const normalized = toPosix(relativePath);
    knownDocs.add(normalized);
    const content = await fs.readFile(absolutePath, "utf8");
    pages.push({ normalized, content });
  });

  const evaluated = pages
    .map((page) => evaluatePage(page.normalized, page.content, knownDocs))
    .sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  const report = buildReport(evaluated);
  await fs.writeFile(outputPath, report, "utf8");
  console.log(`Wrote docs report: ${outputPath}`);
  console.log(`Pages scanned: ${evaluated.length}`);
  console.log(`Pages with findings: ${evaluated.filter((page) => page.hasFindings).length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
