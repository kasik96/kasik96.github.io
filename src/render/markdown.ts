/*
 * The plain-text renderings: llms.txt (llmstxt.org format), llms-full.txt and cv.md.
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
import { abs, anchor, availability, host, languages, period } from "../lib/format.ts";

const contactLines = (): string[] => [
	`- [Email](mailto:${person.email}): ${person.email}`,
	`- [GitHub](${person.github}): ${host(person.github)}${new URL(person.github).pathname}`,
	`- [LinkedIn](${person.linkedin}): ${new URL(person.linkedin).pathname.replace(/^\/|\/$/g, "")}`,
	`- Availability: ${availability()}`,
];

const sentence = (text: string): string => (/[.!?]$/.test(text) ? text : `${text}.`);

/** One concise list item per role, linking to its anchor on the page. */
function jobLine(job: Job): string {
	const parts = [`${job.role}, ${period(job)}`, job.about];
	if (job.metric) parts.push(job.metric);
	if (job.url) parts.push(`site: ${job.url}`);
	if (job.store) parts.push(`${job.store.label}: ${job.store.url}`);
	return `- [${job.company}](${anchor(job.id)}): ${parts.join(" · ")}`;
}

export function llmsTxt(): string {
	const lines = [
		`# ${person.name}`,
		"",
		`> ${person.summary}`,
		"",
		...facts.map((f) => `- ${f.key}: ${f.value}`),
		"",
		"## Contact",
		"",
		...contactLines(),
		"",
		"## Work",
		"",
		...work.map(jobLine),
		"",
		"## Selected projects",
		"",
		...projects.map(
			(p) => `- [${p.name}](${p.url}): ${p.platform}${p.metric ? `, ${p.metric}` : ""}. ${sentence(p.summary)}`,
		),
		"",
		"## Stack",
		"",
		...stack.map((g) => `- ${g.label}: ${g.items.join(", ")}`),
		"",
		"## Freelance & early work",
		"",
		...earlyWork.map(jobLine),
		"",
		"## Education",
		"",
		...education.map((e) => `- [${e.school}](${anchor(e.id)}): ${e.field}, ${period(e)}.`),
		"",
		"## Optional",
		"",
		`- [Full profile](${abs("/llms-full.txt")}): every role and project with full descriptions`,
		`- [Structured data](${abs("/profile.jsonld")}): schema.org Person, ProfilePage and projects as JSON-LD`,
		`- [CV](${abs("/cv.md")}): the same profile as a markdown CV`,
	];
	return lines.join("\n") + "\n";
}

function jobSection(job: Job): string[] {
	const meta = [
		`- Period: ${period(job)}`,
		`- Company: ${job.company} — ${job.about}`,
		...(job.url ? [`- Company site: ${job.url}`] : []),
		...(job.metric ? [`- Highlight: ${job.metric}`] : []),
		...(job.store ? [`- ${job.store.label}: ${job.store.url}`] : []),
		`- Cite as: ${anchor(job.id)}`,
	];
	return [`### ${job.company} — ${job.role}`, "", ...meta, "", job.description, ""];
}

export function llmsFullTxt(): string {
	const lines = [
		`# ${person.name}`,
		"",
		`> ${person.summary}`,
		"",
		`Canonical page: ${site.url}/. Every section below has a stable anchor on that page; deep links are given as "Cite as".`,
		"",
		"## Facts",
		"",
		...facts.map((f) => `- ${f.key}: ${f.value}`),
		"",
		"## Contact",
		"",
		...contactLines(),
		"",
		"## Work",
		"",
		...work.flatMap(jobSection),
		"## Selected projects",
		"",
		...projects.flatMap((p) => [
			`### ${p.name}`,
			"",
			`- Platform: ${p.platform}`,
			...(p.metric ? [`- Highlight: ${p.metric}`] : []),
			`- URL: ${p.url}`,
			`- Cite as: ${anchor(p.id)}`,
			"",
			`${sentence(p.summary)} ${p.description}`,
			"",
		]),
		"## Stack",
		"",
		...stack.map((g) => `- ${g.label}: ${g.items.join(", ")}`),
		"",
		"## Freelance & early work",
		"",
		...earlyWork.flatMap(jobSection),
		"## Education",
		"",
		...education.flatMap((e) => [
			`### ${e.school}`,
			"",
			`- Period: ${period(e)}`,
			`- Field: ${e.field}`,
			`- Cite as: ${anchor(e.id)}`,
			"",
		]),
		"## Languages",
		"",
		...person.languages.map((l) => `- ${l.name} (${l.level})`),
		"",
		"## Machine-readable endpoints",
		"",
		...endpoints.map((e) => `- [${e.path}](${abs(e.path)}): ${e.type}, ${e.note}`),
	];
	return lines.join("\n") + "\n";
}

export function cvMd(): string {
	const experience = (job: Job): string[] => [
		`### ${job.role} — ${job.company}`,
		"",
		`*${period(job)}* · ${job.about}${job.url ? ` · [${host(job.url)}](${job.url})` : ""}`,
		"",
		job.description,
		"",
	];
	const lines = [
		`# ${person.name}`,
		"",
		`**${person.jobTitle}** · ${person.locality}, ${person.country} · ${person.timezone}`,
		"",
		`[${person.email}](mailto:${person.email}) · [GitHub](${person.github}) · [LinkedIn](${person.linkedin}) · [${site.domain}](${site.url}/)`,
		"",
		person.summary,
		"",
		"## Experience",
		"",
		...work.flatMap(experience),
		"## Freelance & early work",
		"",
		...earlyWork.flatMap(experience),
		"## Selected projects",
		"",
		...projects.map(
			(p) => `- **[${p.name}](${p.url})** (${p.platform}${p.metric ? `, ${p.metric}` : ""}) — ${sentence(p.summary)} ${p.description}`,
		),
		"",
		"## Skills",
		"",
		...stack.map((g) => `- **${g.label}:** ${g.items.join(", ")}`),
		"",
		"## Education",
		"",
		...education.map((e) => `- **${e.school}** — ${e.field}, ${period(e)}`),
		"",
		"## Languages",
		"",
		languages(),
		"",
		"## Availability",
		"",
		availability(),
	];
	return lines.join("\n") + "\n";
}
