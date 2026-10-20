/*
 * The human page. Every word is in the generated markup; enhance.js only swaps
 * between the human and machine views. The machine view is pre-rendered from
 * llms.txt into an inert <template>, so it costs no request and is not
 * double-counted as page content.
 */
import {
	earlyWork,
	education,
	endpoints,
	facts,
	person,
	projects,
	site,
	stack,
	work,
	type Job,
} from "../data/profile.ts";
import { abs, escapeHtml as e, host } from "../lib/format.ts";

const svg = (body: string, size = 16): string =>
	`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const icon = {
	eye: svg('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', 15),
	braces: svg(
		'<path d="M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1"/><path d="M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1"/>',
		15,
	),
	mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>', 17),
	out: (size = 14) => svg('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>', size),
};

const ext = (url: string, label: string, cls: string, extra = ""): string =>
	`<a class="${cls}" href="${e(url)}" rel="noopener${extra}" target="_blank">${label}${icon.out(13)}</a>`;

function years(job: Pick<Job, "start" | "end">): string {
	const start = `<time datetime="${job.start}">${job.start}</time>`;
	if (job.end === job.start) return start;
	const end = job.end === null ? "present" : `<time datetime="${job.end}">${job.end}</time>`;
	return `${start} — ${end}`;
}

function sectionHead(n: number, id: string, title: string): string {
	return `<div class="sec-head">
        <span class="sec-num" aria-hidden="true">${String(n).padStart(2, "0")}</span>
        <h2 id="h-${id}">${e(title)}</h2>
        <a class="sec-anchor" href="#${id}">#${id}</a>
      </div>`;
}

function section(n: number, id: string, title: string, body: string): string {
	return `<section id="${id}" class="sec" aria-labelledby="h-${id}">
      ${sectionHead(n, id, title)}
      ${body}
    </section>`;
}

function jobRow(job: Job): string {
	const aside = [
		job.metric ? `<span class="badge">${e(job.metric)}</span>` : "",
		job.url ? ext(job.url, e(host(job.url)), "row-link") : "",
		job.store ? ext(job.store.url, e(job.store.label), "row-link") : "",
		`<a class="row-link" href="#${job.id}">#${job.id}</a>`,
	].join("");
	return `<article id="${job.id}" class="job" aria-labelledby="h-${job.id}">
        <p class="job-years">${years(job)}</p>
        <div class="job-main">
          <div class="job-title">
            <h3 id="h-${job.id}">${e(job.company)}</h3>
            <span class="job-role">${e(job.role)}</span>
          </div>
          <p class="job-about">${e(job.about)}</p>
          <p class="job-desc">${e(job.description)}</p>
        </div>
        <div class="job-aside">${aside}</div>
      </article>`;
}

function earlyRow(job: Job): string {
	return `<article id="${job.id}" class="early" aria-labelledby="h-${job.id}">
        <p class="job-years">${years(job)}</p>
        <div class="early-title">
          <h3 id="h-${job.id}">${e(job.company)}</h3>
          <span class="early-role">${e(job.role)}</span>
        </div>
        <p class="early-desc">${e(job.description)}</p>
      </article>`;
}

const projectCard = (p: (typeof projects)[number]): string => `<article id="${p.id}" class="card">
        <div class="card-top">
          <span class="card-platform">${e(p.platform)}</span>
          ${p.metric ? `<span class="card-metric">${e(p.metric)}</span>` : ""}
        </div>
        <h3><a class="card-link" href="${e(p.url)}" rel="noopener" target="_blank">${e(p.name)}</a></h3>
        <p class="card-summary">${e(p.summary)}.</p>
        <p class="card-desc">${e(p.description)}</p>
        <span class="card-host">${e(host(p.url))}${icon.out(13)}</span>
      </article>`;

/** llms.txt as terminal lines; URLs become links, nothing else is touched. */
function machineLines(llms: string): string {
	let optional = false;
	return llms
		.trimEnd()
		.split("\n")
		.map((line) => {
			if (line.startsWith("## ")) optional = line === "## Optional";
			const cls = line.startsWith("# ")
				? "ln ln-h1"
				: line.startsWith("## ")
					? "ln ln-h2"
					: line.startsWith("> ")
						? "ln ln-q"
						: optional
							? "ln ln-meta"
							: "ln";
			const html = line
				.split(/((?:https?:\/\/|mailto:)[^\s)]+)/)
				.map((part, i) => (i % 2 ? `<a href="${e(part)}">${e(part)}</a>` : e(part)))
				.join("");
			return `<div class="${cls}">${html || " "}</div>`;
		})
		.join("\n");
}

export interface PageInput {
	css: string;
	jsonld: object;
	llms: string;
	year: number;
}

export function page({ css, jsonld, llms, year }: PageInput): string {
	const lineCount = llms.trimEnd().split("\n").length;
	const title = `${person.name} — ${person.jobTitle}`;
	const ogImage = abs(site.image);

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(person.summary)}">
<meta name="author" content="${e(person.name)}">
<meta name="theme-color" content="#12100E">
<meta name="color-scheme" content="dark">
<link rel="canonical" href="${site.url}/">
<link rel="alternate" type="text/markdown" href="/llms.txt" title="llms.txt">
<link rel="alternate" type="application/ld+json" href="/profile.jsonld" title="schema.org JSON-LD">
<link rel="me" href="${person.github}">
<link rel="me" href="${person.linkedin}">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="${site.domain}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(person.summary)}">
<meta property="og:url" content="${site.url}/">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="560">
<meta property="og:image:height" content="560">
<meta property="og:image:alt" content="Portrait of ${e(person.name)}">
<meta property="og:locale" content="en_US">
<meta property="profile:first_name" content="${e(person.givenName)}">
<meta property="profile:last_name" content="${e(person.familyName)}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(person.summary)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/assets/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32x32.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/geist-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/geist-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
<script>if(/[?&]view=machine(&|$)/.test(location.search))document.documentElement.dataset.view="machine"</script>
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>
<script src="/enhance.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap top-inner">
    <a class="brand" href="/">${site.domain}</a>
    <span class="where" data-hours="${person.availability.from}-${person.availability.to}" data-tz="${person.timezone}"><span class="dot" data-presence aria-hidden="true"></span>${e(person.locality)} · ${e(person.timezone)}</span>
    <nav class="views" aria-label="View">
      <a class="seg" href="/" data-view="human" aria-current="page">${icon.eye}human</a>
      <a class="seg" href="/llms.txt" data-view="machine" type="text/markdown">${icon.braces}machine</a>
    </nav>
  </div>
</header>

<main id="main" class="wrap" tabindex="-1">
  <div class="hero">
    <div class="hero-id">
      <div class="hero-meta">
        <span class="avatar">
          <img src="/assets/avatar-144.jpg" width="72" height="72" alt="Portrait of ${e(person.name)}">
          <span class="dot dot-avatar" data-presence aria-hidden="true"></span>
        </span>
        <a class="chip" href="/profile.jsonld" type="application/ld+json">schema.org/Person</a>
        <a class="chip" href="/llms.txt" type="text/markdown">llms.txt</a>
      </div>
      <h1>${e(person.name)}</h1>
      <div class="subtitle" role="doc-subtitle">${e(person.tagline)}</div>
      <div class="ctas">
        <a class="cta" href="mailto:${person.email}">${icon.mail}${person.email}</a>
        <a class="cta" href="${person.github}" rel="me noopener" target="_blank">github/${e(new URL(person.github).pathname.slice(1))}${icon.out(15)}</a>
        <a class="cta" href="${person.linkedin}" rel="me noopener" target="_blank">in/${e(new URL(person.linkedin).pathname.split("/").filter(Boolean).pop() ?? "")}${icon.out(15)}</a>
      </div>
    </div>

    <section class="ask" aria-labelledby="h-who">
      <h2 id="h-who" class="ask-q"><span class="caret" aria-hidden="true">›</span>who is ${e(person.name)}?</h2>
      <div class="ask-a">
        <p id="summary">${e(person.summary)}</p>
        <ul class="chips" aria-label="Jump to">
          <li><a class="chip" href="#finviz">Finviz</a></li>
          <li><a class="chip" href="#aukro">Aukro</a></li>
          <li><a class="chip" href="#scio">SCIO</a></li>
          <li><a class="chip" href="#projects">Projects</a></li>
        </ul>
      </div>
    </section>
  </div>

  ${section(
		1,
		"facts",
		"Facts",
		`<dl class="facts">
        ${facts.map((f) => `<div><dt>${e(f.key)}</dt><dd>${e(f.value)}</dd></div>`).join("\n        ")}
      </dl>`,
	)}

  ${section(2, "work", "Work", work.map(jobRow).join("\n      "))}

  ${section(3, "projects", "Selected projects", `<div class="cards">\n      ${projects.map(projectCard).join("\n      ")}\n      </div>`)}

  ${section(
		4,
		"stack",
		"Stack",
		`<div class="stack">
        ${stack
			.map(
				(g) => `<div class="stack-group">
          <h3>${e(g.label)}</h3>
          <ul class="chips">${g.items.map((s) => `<li class="chip">${e(s)}</li>`).join("")}</ul>
        </div>`,
			)
			.join("\n        ")}
      </div>`,
	)}

  ${section(5, "early", "Freelance & early work", earlyWork.map(earlyRow).join("\n      "))}

  ${section(
		6,
		"education",
		"Education",
		education
			.map(
				(ed) => `<article id="${ed.id}" class="early" aria-labelledby="h-${ed.id}">
        <p class="job-years">${years(ed)}</p>
        <div class="early-title">
          <h3 id="h-${ed.id}">${e(ed.school)}</h3>
          <span class="early-role">${e(ed.field)}</span>
        </div>
      </article>`,
			)
			.join("\n"),
	)}
</main>

<template id="machine-view">
<main id="machine" class="wrap machine" tabindex="-1" aria-label="llms.txt">
  <div class="term">
    <div class="term-bar">
      <span class="term-get">GET</span>
      <a href="/llms.txt" type="text/markdown">/llms.txt</a>
      <span>200</span>
      <span>text/markdown; charset=utf-8</span>
      <span class="term-count">${lineCount} lines</span>
    </div>
    <div class="term-body">
${machineLines(llms)}
    </div>
  </div>
</main>
</template>

<footer class="foot">
  <div class="wrap foot-inner">
    <div class="foot-avail">
      <span class="label">available</span>
      <p>${e(person.availability.days)}, ${person.availability.from} — ${person.availability.to} · ${e(person.timezone)}</p>
      <p class="label">© ${year} ${e(person.name)}</p>
    </div>
    <nav class="endpoints" aria-label="Machine-readable endpoints">
      <ul>
        ${endpoints
			.map(
				(ep) =>
					`<li><a href="${ep.path}" type="${ep.type}"><span class="ep-path">${ep.path}</span><span class="ep-type">${ep.type} · ${e(ep.note)}</span></a></li>`,
			)
			.join("\n        ")}
      </ul>
    </nav>
  </div>
</footer>
</body>
</html>
`;
}
