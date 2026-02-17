import { Experience, Project, SkillCategory } from './types';
import { 
  Code2, 
  Smartphone, 
  Globe, 
  Database, 
  Cpu, 
  Layers,
  Terminal,
  Home
} from 'lucide-react';

export const CONTACT_INFO = {
  name: "Martin Kaše",
  role: "Senior Mobile & Front-End Software Engineer",
  tagline: "Remote Specialist | Building from 0 to 1 since 2013",
  phone: "+420 776 819 817",
  email: "mail@kasemartin.cz",
  location: "Velké Březno, Czechia",
  linkedin: "linkedin.com/in/kasemartin96",
  linkedinUrl: "https://www.linkedin.com/in/kasemartin96",
  languages: "Czech (Native), English (Fluent)",
  avatarUrl: "/avatar.jpeg" 
};

export const SUMMARY = `Software Engineer with development experience since 2013. I’m a remote worker mostly focused on Mobile Apps and Front-End Web Technologies. I love creating applications as a whole from the ground up, or helping companies make their existing apps better.

My current tool of choice is React (and React Native), but I’ve been around the block with Angular, CapacitorJS, Ember, C#, XNA and the early days of PhoneGap and Ionic.

MOBILE APPS
I worked on the Aukro.cz app, helping transition it from a web wrapper to a full CapacitorJS build with custom UI, native plugins, Push Notifications, and a package update system. We successfully moved the app from 2.2 stars in the AppStore to 4.4 ⭐.

I also created the Official SCIO app from the ground up which has been active for more than 5 years helping students. Previously, I worked on commercial apps like City Taxi and Bubble Mania Czech. I’ve also gave talks on PhoneGap/Cordova and helped companies like Seznamte.se and Česká Spořitelna adopt mobile tech into their systems.

WEB DEVELOPMENT
On the web side, I’ve worked on Aukro.cz (Angular), the Pricefx system (React JS / Ember), and the Adler eshop (React / Angular). I also built the "Dotační portál pro sportovní kluby" for the City of Teplice using React.

OPEN SOURCE & PERSONAL PROJECTS
I’m a builder at heart. I created the first Swift language support plugin for VS Code, and my Nette Latte + Neon plugin for VS Code now has over 50k downloads. I also contributed a Home Assistant integration for Phyn Water assistant and created a Chrome Extension for Kalorické Tabulky.

In the past, I built personal projects like Databáze Knih for iOS, Official Timetables for JRm, an Unofficial Client for Bazoš.cz (Windows Phone), and games like Meduza Game and Bubble Bub (C# and XNA).

Lately, I am really passionate about AI and Agentic tools for development. I love utilizing them for code reviews and finding ways to help developers be faster and more productive.`;

export const TECH_STACK: SkillCategory[] = [
  {
    title: "Primary Stack",
    skills: ["React", "React Native", "TypeScript", "JavaScript"]
  },
  {
    title: "Mobile",
    skills: ["CapacitorJS", "Ionic", "PhoneGap/Cordova", "Swift", "XNA (C#)"]
  },
  {
    title: "Web & Legacy",
    skills: ["Angular", "Ember", "PHP (Nette)", "MySQL", "HTML5/CSS3"]
  },
  {
    title: "Interests",
    skills: ["Agentic AI Tools", "Open Source", "Home Automation", "IoT"]
  }
];

export const EXPERIENCE: Experience[] = [
  {
    company: "Aukro.cz",
    role: "Senior Software Engineer (External)",
    period: "January 2023 – Present",
    details: [
      "Led the transition from a legacy web wrapper to a high-performance CapacitorJS build.",
      "Implemented custom UI components, native plugins, and a robust push notification system.",
      "Result: App Store rating increased from 2.2 to 4.4 stars ⭐."
    ]
  },
  {
    company: "SCIO",
    role: "Mobile App Developer",
    period: "May 2021 – February 2025",
    details: [
      "Architected and developed the Official SCIO app from scratch using React Native.",
      "Managed the lifecycle of an app serving over 50,000 active users.",
      "App has been active for more than 5 years helping students."
    ]
  },
  {
    company: "Pricefx",
    role: "Senior Software Engineer",
    period: "September 2018 – December 2022",
    details: [
      "Senior Role (2021–2022): Focused on complex enterprise systems using React JS and Ember.",
      "Software Engineer (2018–2021): Developed scalable front-end solutions for price management."
    ]
  },
  {
    company: "ADLER Czech, a.s.",
    role: "Front-End Developer",
    period: "October 2016 – August 2018",
    details: [
      "Developed the Adler e-commerce platform using React and Angular."
    ]
  },
  {
    company: "Early Career Highlights",
    role: "Developer / Evangelist",
    period: "2012 – 2016",
    details: [
      "Microsoft Partner (2012–2016): Evangelized Microsoft technologies and mobile development.",
      "City Taxi Brno & BubbleMania: Developed cross-platform mobile apps using PhoneGap/Cordova.",
      "Freelance/Pixbuf: Full-stack development using PHP (Nette) and JavaScript."
    ]
  }
];

export const PROJECTS: Project[] = [
  {
    name: "Aukro App",
    description: "Official iOS and Android App. Web Wrapper -> CapacitorJS. 2.2 -> 4.4 ⭐. Custom UI, Push, Updates.",
    tags: ["CapacitorJS", "Mobile", "React"]
  },
  {
    name: "Official SCIO App",
    description: "Complete app created from ground up for Android and iOS using React Native.",
    tags: ["React Native", "Mobile"]
  },
  {
    name: "City Taxi Brno",
    description: "iOS and Android Application.",
    tags: ["PhoneGap", "Mobile"]
  },
  {
    name: "Databáze Knih",
    description: "Unofficial iOS app created from ground up.",
    tags: ["PhoneGap", "Ionic"]
  },
  {
    name: "Adler ESHOP",
    description: "E-commerce platform frontend written in Angular.",
    tags: ["Angular", "Web"]
  },
  {
    name: "Bubble Mania Czech",
    description: "iOS and Android Application.",
    tags: ["Mobile", "Cordova"]
  },
  {
    name: "Meduza Game",
    description: "iOS game written in XNA and C#.",
    tags: ["Game Dev", "C#", "XNA"]
  },
  {
    name: "Bubble Bub",
    description: "Game developed for iOS.",
    tags: ["Game Dev", "iOS"]
  },
  {
    name: "Free SMS Sender",
    description: "Application for Windows Phone.",
    tags: ["Windows Phone", "C#"]
  },
  {
    name: "Bazoš.cz Client",
    description: "Unofficial Client for Bazoš.cz.",
    tags: ["Windows Phone", "C#"]
  },
  {
    name: "Timetables (JRm)",
    description: "Official application. Created as single developer from ground up.",
    tags: ["Windows Phone", "C#"]
  },
  {
    name: "Lido Taxi",
    description: "Web Application.",
    tags: ["Web"]
  },
  {
    name: "Les Kanců",
    description: "Web for Design Studio.",
    tags: ["Web"]
  },
  {
    name: "VS Code Plugins",
    description: "First Swift language support & Nette Latte + Neon plugin (50k+ downloads).",
    tags: ["Open Source", "TypeScript"]
  },
  {
    name: "Home Assistant",
    description: "Contributed integration for Phyn Water assistant.",
    tags: ["Open Source", "IoT"]
  }
];

export const EDUCATION = {
  school: "Střední průmyslová škola Ústí nad Labem",
  degree: "Information Technology",
  period: "2012 – 2016"
};
