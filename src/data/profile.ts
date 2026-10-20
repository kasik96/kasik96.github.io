/*
 * The single source of truth for kasemartin.cz. Every rendering — the HTML page,
 * llms.txt, llms-full.txt, profile.jsonld, cv.md and sitemap.xml — is generated
 * from this file by src/build.ts, so nothing can drift between them.
 */

export interface Link {
	label: string;
	url: string;
}

export interface Fact {
	key: string;
	value: string;
}

export interface Job {
	/** Stable anchor id on the page, e.g. `#finviz`. */
	id: string;
	company: string;
	role: string;
	start: number;
	/** `null` while the role is ongoing. */
	end: number | null;
	/** One line on what the company does. */
	about: string;
	description: string;
	metric?: string;
	url?: string;
	store?: Link;
}

export interface Project {
	id: string;
	name: string;
	platform: string;
	metric?: string;
	/** Short one-liner, used where space is tight (llms.txt, JSON-LD). */
	summary: string;
	description: string;
	url: string;
	/** Which schema.org type the project is published as in JSON-LD. */
	schemaType: "SoftwareSourceCode" | "SoftwareApplication";
	/** Raw numbers behind `metric`, emitted as schema.org InteractionCounters. */
	stars?: number;
	installs?: number;
}

export interface StackGroup {
	label: string;
	items: string[];
}

export interface Education {
	id: string;
	school: string;
	field: string;
	start: number;
	end: number;
}

export interface Endpoint {
	path: string;
	type: string;
	note: string;
}

export const site = {
	url: "https://kasemartin.cz",
	domain: "kasemartin.cz",
	image: "/assets/avatar.jpeg",
};

export const person = {
	name: "Martin Kaše",
	givenName: "Martin",
	familyName: "Kaše",
	jobTitle: "Senior mobile & front-end engineer",
	tagline: "Senior mobile & front-end engineer.",
	/**
	 * The canonical answer to "who is Martin Kaše?". Reused verbatim as the first
	 * paragraph of the page, the meta and OG descriptions, the JSON-LD
	 * `description` and the llms.txt blockquote.
	 */
	summary:
		"Martin Kaše is a senior mobile and front-end engineer based in Ústí nad Labem, Czechia, building mobile and web products end to end — from the first commit to the store listing — since 2013. Currently senior mobile engineer at Finviz and senior software engineer at Aukro. Remote by default, usually zero to one, and lately with a lot of help from agentic tooling.",
	email: "mail@kasemartin.cz",
	github: "https://github.com/kasik96",
	linkedin: "https://www.linkedin.com/in/kasemartin96",
	locality: "Ústí nad Labem",
	country: "Czechia",
	countryCode: "CZ",
	timezone: "Europe/Prague",
	languages: [
		{ name: "Czech", code: "cs", level: "native" },
		{ name: "English", code: "en", level: "fluent" },
	],
	availability: { days: "Every day", from: "08:00", to: "16:00" },
};

export const facts: Fact[] = [
	{ key: "role", value: "Senior mobile & front-end engineer" },
	{ key: "shipping_since", value: "2013" },
	{ key: "scope", value: "End to end, usually zero to one" },
	{ key: "work_mode", value: "Remote by default" },
	{ key: "based_in", value: "Ústí nad Labem, Czechia" },
	{ key: "timezone", value: "Europe/Prague" },
	{ key: "languages", value: "Czech (native) · English (fluent)" },
	{ key: "available", value: "Daily 08:00 — 16:00" },
];

export const work: Job[] = [
	{
		id: "finviz",
		company: "Finviz",
		role: "Senior mobile engineer",
		start: 2026,
		end: null,
		about: "Financial market visualisation, screening and research",
		description:
			"Building the Finviz mobile app from the ground up in React Native — architecture, navigation, real-time market data and the release pipeline for both stores.",
		metric: "Live on the App Store",
		url: "https://finviz.com",
		store: { label: "App Store", url: "https://apps.apple.com/app/finviz/id6761907341" },
	},
	{
		id: "aukro",
		company: "Aukro",
		role: "Senior software engineer",
		start: 2023,
		end: null,
		about: "The largest online marketplace in Czechia",
		description:
			"Led the move off a legacy web wrapper onto a full CapacitorJS build with custom UI, native plugins, push notifications and an over-the-air package update system. App Store rating went from 2.2 to 4.4 stars.",
		metric: "App Store 2.2 → 4.4 ★",
		url: "https://www.aukro.cz",
	},
	{
		id: "scio",
		company: "SCIO",
		role: "Software engineer, app developer",
		start: 2021,
		end: 2025,
		about: "National education and student testing company",
		description:
			"Built the official SCIO app from scratch in React Native for both platforms, then owned it end to end. Grew to more than 50,000 users.",
		metric: "50,000+ users",
		url: "https://www.scio.cz",
	},
	{
		id: "pricefx",
		company: "Pricefx",
		role: "Senior software engineer",
		start: 2018,
		end: 2022,
		about: "Enterprise price optimisation and management platform",
		description:
			"Built front ends for complex enterprise pricing systems in React and Ember, working across a distributed team. Joined as a software engineer in 2018 and moved up to senior in 2021.",
		url: "https://www.pricefx.com",
	},
	{
		id: "adler",
		company: "ADLER Czech",
		role: "Front-end developer",
		start: 2016,
		end: 2018,
		about: "Promotional textile e-commerce",
		description:
			"Developed the Adler e-shop front end in React and Angular, from catalogue and search through to checkout.",
		url: "https://www.adler.cz",
	},
	{
		id: "microsoft",
		company: "Microsoft CZ",
		role: "Microsoft Partner",
		start: 2012,
		end: 2016,
		about: "Windows Phone evangelism and app development",
		description:
			"Evangelised Windows Phone and spoke on XNA and mobile development. Built Windows Phone apps of my own along the way — Databáze Knih, Bazoš (Neoficiální) and JRm — Dopravní podnik.",
	},
];

export const earlyWork: Job[] = [
	{
		id: "pixbuf",
		company: "PIXBUF",
		role: "Web software developer",
		start: 2016,
		end: 2016,
		about: "Web applications in PHP and JavaScript",
		description:
			"Built web applications on Nette and MySQL with HTML5 and CSS3 front ends, plus Android automation work.",
	},
	{
		id: "city-taxi-brno",
		company: "City Taxi Brno",
		role: "Mobile software developer",
		start: 2015,
		end: 2016,
		about: "Taxi booking apps for iOS and Android",
		description: "Built the iOS and Android apps in PhoneGap on a JavaScript and MySQL stack.",
	},
	{
		id: "bubblemania",
		company: "BubbleMania Czech",
		role: "Mobile software developer",
		start: 2014,
		end: 2015,
		about: "Mobile apps for iOS and Android",
		description:
			"Built both the front end and the back end of the iOS and Android apps in PhoneGap, backed by Azure SQL.",
	},
];

export const projects: Project[] = [
	{
		id: "swift-vscode",
		name: "Swift for VS Code",
		platform: "VS Code extension",
		metric: "105 ★",
		stars: 105,
		summary: "The first Swift language support extension for VS Code",
		description:
			"Written before Apple or the VS Code team shipped anything official. Syntax highlighting, snippets and build tasks for Swift, and still the reference implementation people fork from.",
		url: "https://github.com/kasik96/Swift-VS-Code",
		schemaType: "SoftwareSourceCode",
	},
	{
		id: "nette-latte",
		name: "Nette Latte + Neon",
		platform: "VS Code extension",
		metric: "57k installs",
		installs: 57000,
		summary: "Language support for the Latte templating engine and Neon config",
		description:
			"Highlighting, snippets and formatting for Nette's Latte and Neon file formats. Passed 57,000 installs on the Marketplace.",
		url: "https://marketplace.visualstudio.com/items?itemName=Kasik96.latte",
		schemaType: "SoftwareApplication",
	},
	{
		id: "opengcontrol",
		name: "opengcontrol",
		platform: "macOS CLI",
		summary: "Open-source CLI alternative to Logitech G software on macOS",
		description:
			"Control Logitech G device lighting and settings from the terminal, without running the vendor's heavyweight desktop app.",
		url: "https://github.com/kasik96/opengcontrol",
		schemaType: "SoftwareSourceCode",
	},
];

export const stack: StackGroup[] = [
	{ label: "mobile", items: ["React Native", "CapacitorJS", "Ionic", "Cordova", "Swift", "iOS", "Android"] },
	{ label: "web", items: ["React", "TypeScript", "JavaScript", "Angular", "Ember", "Vite", "HTML", "CSS"] },
	{ label: "server", items: ["Node.js", "PHP (Nette)", "MySQL", "C#", "XNA"] },
	{ label: "ai & hardware", items: ["Agentic AI", "Home Assistant", "ESP8266", "IoT"] },
];

export const education: Education[] = [
	{
		id: "spsul",
		school: "Střední průmyslová škola Ústí nad Labem",
		field: "Information technology",
		start: 2012,
		end: 2016,
	},
];

export const endpoints: Endpoint[] = [
	{ path: "/llms.txt", type: "text/markdown", note: "summary" },
	{ path: "/llms-full.txt", type: "text/markdown", note: "everything" },
	{ path: "/profile.jsonld", type: "application/ld+json", note: "Person" },
	{ path: "/cv.md", type: "text/markdown", note: "CV" },
	{ path: "/sitemap.xml", type: "application/xml", note: "sitemap" },
	{ path: "/robots.txt", type: "text/plain", note: "crawlers" },
];
