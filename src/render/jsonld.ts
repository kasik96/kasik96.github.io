/*
 * schema.org graph: a ProfilePage whose mainEntity is the Person, the current
 * employers as Organizations, and each project as SoftwareSourceCode or
 * SoftwareApplication. Served at /profile.jsonld and inlined in <head>.
 */
import { education, person, projects, site, stack, work } from "../data/profile.ts";
import { abs, anchor } from "../lib/format.ts";

const id = (fragment: string): string => `${site.url}/#${fragment}`;
const PERSON = id("person");

export function profileGraph(lastModified: string): object {
	const employers = work.filter((job) => job.end === null);

	const organizations = employers.map((job) => ({
		"@type": "Organization",
		"@id": id(`org-${job.id}`),
		name: job.company,
		description: job.about,
		...(job.url ? { url: job.url } : {}),
	}));

	const schools = education.map((e) => ({
		"@type": "EducationalOrganization",
		"@id": id(`org-${e.id}`),
		name: e.school,
	}));

	const software = projects.map((p) => {
		const counters = [
			...(p.stars ? [{ "@type": "InteractionCounter", interactionType: "https://schema.org/LikeAction", userInteractionCount: p.stars }] : []),
			...(p.installs ? [{ "@type": "InteractionCounter", interactionType: "https://schema.org/DownloadAction", userInteractionCount: p.installs }] : []),
		];
		return {
			"@type": p.schemaType,
			"@id": id(p.id),
			name: p.name,
			description: `${p.summary}. ${p.description}`,
			url: p.url,
			...(p.schemaType === "SoftwareSourceCode"
				? { codeRepository: p.url, runtimePlatform: p.platform }
				: { applicationCategory: "DeveloperApplication", applicationSubCategory: p.platform }),
			author: { "@id": PERSON },
			...(counters.length ? { interactionStatistic: counters } : {}),
			mainEntityOfPage: anchor(p.id),
		};
	});

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "ProfilePage",
				"@id": id("profilepage"),
				url: `${site.url}/`,
				name: `${person.name} — ${person.jobTitle}`,
				description: person.summary,
				inLanguage: "en",
				dateModified: lastModified,
				mainEntity: { "@id": PERSON },
				about: { "@id": PERSON },
			},
			{
				"@type": "Person",
				"@id": PERSON,
				name: person.name,
				givenName: person.givenName,
				familyName: person.familyName,
				jobTitle: person.jobTitle,
				description: person.summary,
				url: `${site.url}/`,
				image: abs(site.image),
				email: `mailto:${person.email}`,
				sameAs: [person.github, person.linkedin],
				address: {
					"@type": "PostalAddress",
					addressLocality: person.locality,
					addressCountry: person.countryCode,
				},
				knowsAbout: stack.flatMap((g) => g.items),
				knowsLanguage: person.languages.map((l) => ({
					"@type": "Language",
					name: l.name,
					alternateName: l.code,
				})),
				// Inlined rather than referenced by @id, so scrapers that don't resolve
				// the graph still see the organisation names and URLs.
				alumniOf: schools,
				worksFor: organizations,
			},
			...software,
		],
	};
}
