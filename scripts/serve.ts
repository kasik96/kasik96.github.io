/*
 * Local preview of dist/ with the same content types production nginx sends
 * (see README → Hosting). `npm run preview`, then http://localhost:3000.
 */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const dist = join(import.meta.dirname, "..", "dist");
const port = Number(process.env.PORT ?? 3000);

const types: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".md": "text/markdown; charset=utf-8",
	".jsonld": "application/ld+json; charset=utf-8",
	".xml": "application/xml; charset=utf-8",
	".txt": "text/plain; charset=utf-8",
	".woff2": "font/woff2",
	".jpeg": "image/jpeg",
	".jpg": "image/jpeg",
	".png": "image/png",
	".ico": "image/x-icon",
};

// llms*.txt are markdown; robots.txt stays text/plain.
const contentType = (path: string): string =>
	/\/llms(-full)?\.txt$/.test(path) ? types[".md"] : (types[extname(path)] ?? "application/octet-stream");

createServer((req, res) => {
	const { pathname } = new URL(req.url ?? "/", "http://localhost");
	let file = normalize(join(dist, decodeURIComponent(pathname)));
	if (!file.startsWith(dist)) return void res.writeHead(403).end();
	try {
		if (statSync(file).isDirectory()) file = join(file, "index.html");
		statSync(file);
	} catch {
		return void res.writeHead(404, { "content-type": "text/plain" }).end("not found\n");
	}
	res.writeHead(200, { "content-type": contentType(file) });
	createReadStream(file).pipe(res);
}).listen(port, () => console.log(`dist/ on http://localhost:${port}`));
