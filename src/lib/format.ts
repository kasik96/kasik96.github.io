import type { Job } from "../data/profile.ts";
import { person, site } from "../data/profile.ts";

/** Absolute URL on the canonical origin. */
export const abs = (path: string): string => site.url + path;

/** Absolute deep link to an anchor on the home page. */
export const anchor = (id: string): string => `${site.url}/#${id}`;

/** Host without `www.`, for link labels. */
export const host = (url: string): string => new URL(url).hostname.replace(/^www\./, "");

/** "2021–2025", "2026–present", "2016" — for plain-text renderings. */
export function period(job: Pick<Job, "start" | "end">): string {
	if (job.end === job.start) return String(job.start);
	return `${job.start}–${job.end ?? "present"}`;
}

export const availability = (): string =>
	`${person.availability.days}, ${person.availability.from}–${person.availability.to} ${person.timezone}`;

export const languages = (): string =>
	person.languages.map((l) => `${l.name} (${l.level})`).join(", ");

export function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}
