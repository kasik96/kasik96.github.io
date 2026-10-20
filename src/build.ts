/*
 * Generates dist/ from src/data/profile.ts. Run with `npm run build` (Node 24+
 * strips the TypeScript types natively; there is nothing to install).
 */
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { endpoints, site } from "./data/profile.ts";
import { abs } from "./lib/format.ts";
import { page } from "./render/html.ts";
import { profileGraph } from "./render/jsonld.ts";
import { cvMd, llmsFullTxt, llmsTxt } from "./render/markdown.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

/** Date of the last commit, so rebuilding the same commit gives the same output. */
function lastModified(): string {
	try {
		return execFileSync("git", ["log", "-1", "--format=%cI"], { cwd: root, encoding: "utf8" }).trim().slice(0, 10);
	} catch {
		return new Date().toISOString().slice(0, 10);
	}
}

/** Comments and whitespace only — enough for a stylesheet that gets inlined. */
const minifyCss = (css: string): string =>
	css
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/\s+/g, " ")
		.replace(/\s*([{}:;,>])\s*/g, "$1")
		.replace(/;}/g, "}")
		.trim();

const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"];

function robotsTxt(): string {
	return [
		"User-agent: *",
		"Allow: /",
		"",
		...AI_CRAWLERS.flatMap((agent) => [`User-agent: ${agent}`, "Allow: /", ""]),
		`Sitemap: ${abs("/sitemap.xml")}`,
		"",
	].join("\n");
}

function sitemapXml(date: string): string {
	const urls = ["/", ...endpoints.filter((ep) => ep.type === "text/markdown").map((ep) => ep.path)];
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${abs(path)}</loc><lastmod>${date}</lastmod></url>`).join("\n")}
</urlset>
`;
}

const date = lastModified();
const llms = llmsTxt();
const graph = profileGraph(date);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, "assets"), join(dist, "assets"), { recursive: true });
cpSync(join(root, "CNAME"), join(dist, "CNAME"));
cpSync(join(root, "src/enhance.js"), join(dist, "enhance.js"));

const files: Record<string, string> = {
	"index.html": page({
		css: minifyCss(readFileSync(join(root, "src/styles.css"), "utf8")),
		jsonld: graph,
		llms,
		year: Number(date.slice(0, 4)),
	}),
	"llms.txt": llms,
	"llms-full.txt": llmsFullTxt(),
	"profile.jsonld": JSON.stringify(graph, null, 2) + "\n",
	"cv.md": cvMd(),
	"robots.txt": robotsTxt(),
	"sitemap.xml": sitemapXml(date),
};

for (const [name, content] of Object.entries(files)) {
	writeFileSync(join(dist, name), content);
	console.log(`  ${name.padEnd(16)} ${Buffer.byteLength(content).toLocaleString("en").padStart(7)} B`);
}
console.log(`built ${site.domain} → dist/`);
