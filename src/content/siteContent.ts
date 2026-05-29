export type SkillLevel = "learning" | "comfortable";

export type Skill = {
  name: string;
  icon: string;
  level: SkillLevel;
  description: string;
};

export type SkillGroup = {
  label: string;
  summary: string;
  signal: string;
  skills: Skill[];
};

export type Project = {
  title: string;
  codename: string;
  status: "ACTIVE" | "DEMO" | "ARCHIVED";
  severity: "HIGH" | "MED" | "LOW";
  description: string;
  outcome: string;
  stack: string[];
  metrics: Array<{
    label: string;
    value: string;
  }>;
  telemetry: string[];
  githubUrl: string;
  liveUrl: string;
};

export const SITE = {
  name: "Manas Ranjan Rao",
  brand: "MANAS // CYBERSEC",
  title: "Cybersecurity & Software Engineering Student",
  email: "manasranjanrao188@gmail.com",
  location: "Germany",
  githubHandle: "LLawliet188",
  education: {
    degree: "BSc Computer Science",
    institution: "IUBH Bad Honnef",
    matriculationNumber: "92017693",
  },
  links: {
    github: "https://github.com/LLawliet188",
    linkedin: "https://www.linkedin.com/in/manas-ranjan-rao",
    email: "mailto:manasranjanrao188@gmail.com",
    resume: "mailto:manasranjanrao188@gmail.com?subject=Resume%20Request",
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const NAV_COPY = {
  status: "[INTERNSHIP SIGNAL OPEN]",
  openMenu: "Open navigation",
  closeMenu: "Close navigation",
  soundOn: "Sound on",
  soundOff: "Sound off",
};

export const ATMOSPHERE = {
  fragments: ["PHASE 01", "SECURE SYSTEMS", "SOC SIGNAL", "ETHICAL HACKING", "REMOTE / GERMANY"],
};

export const HERO = {
  introTitle: "Welcome to the Cybersecurity Portfolio",
  introSubtitle: "A cinematic digital field report for secure systems, ethical hacking, and product-minded engineering.",
  introAction: "Click to enter",
  introHint: "Headphones recommended",
  eyebrow: "Phase 01",
  nameKicker: "Portfolio / 2026",
  phaseTitle: "Building secure digital systems",
  identity: "Cybersecurity & Software Engineering Student",
  positioning:
    "A dark, cinematic portfolio world for cybersecurity learning, secure web apps, and practical security tooling.",
  ctas: [
    { label: "Find Out More", href: "#about", variant: "primary" },
    { label: "GitHub", href: SITE.links.github, variant: "secondary" },
    { label: "LinkedIn", href: SITE.links.linkedin, variant: "secondary" },
    { label: "Resume", href: SITE.links.resume, variant: "ghost" },
  ],
  stats: [
    { label: "Signal", value: "Security Tooling" },
    { label: "Location", value: "Germany" },
    { label: "Track", value: "BSc Computer Science" },
  ],
  commandPanel: {
    label: "Orbital Signal",
    status: "Listening",
    title: "Security Field",
    pulse: "42 signal nodes",
    scoreLabel: "Readiness",
    score: "94%",
    rows: [
      { label: "Recon", value: "mapped" },
      { label: "Web app", value: "hardened" },
      { label: "Reporting", value: "clear" },
    ],
  },
};

export const SECTION_LABELS = {
  about: "01 / ORIGIN",
  projects: "02 / FIELD WORK",
  skills: "03 / ARSENAL",
  certifications: "04 / LEARNING",
  terminal: "05 / CONSOLE",
  contact: "06 / CONTACT",
};

export const ABOUT = {
  heading: "A security-focused builder learning through systems, labs, and product craft.",
  body:
    "I am pursuing a BSc Computer Science degree from IUBH Bad Honnef while building a practical foundation in cybersecurity and modern web development. My work connects network security, penetration testing, SOC workflows, secure web apps, and careful remediation notes into one learning loop.",
  education: {
    title: "Academic Node",
    degree: "BSc Computer Science",
    institution: "IUBH Bad Honnef",
    location: "Germany",
    matriculationLabel: "Matriculation No.",
    matriculationNumber: "92017693",
  },
  highlights: [
    { label: "Primary Path", value: "Cybersecurity internships" },
    { label: "Work Mode", value: "Germany / Remote" },
    { label: "Approach", value: "Build, test, document" },
  ],
  focusTitle: "Operating Zones",
  focusAreas: [
    {
      title: "Network Visibility",
      description: "Packet inspection, scan strategy, and defensive signal analysis.",
      icon: "network",
    },
    {
      title: "Ethical Hacking",
      description: "Recon workflows, exploit validation, and responsible reporting.",
      icon: "scan",
    },
    {
      title: "SOC Thinking",
      description: "Triage, severity labels, alert context, and incident notes.",
      icon: "shield",
    },
    {
      title: "Secure Interfaces",
      description: "Web experiences built with privacy, misuse cases, and clarity in mind.",
      icon: "lock",
    },
  ],
  timeline: [
    { date: "2023", label: "Computer Science", detail: "Core systems and programming" },
    { date: "2024", label: "Web Engineering", detail: "React, TypeScript, UI systems" },
    { date: "Now", label: "Cybersecurity Track", detail: "Labs, tools, secure products" },
  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Frontend",
    summary: "Interface systems with strong type safety, responsive layout, and motion polish.",
    signal: "UI-LAYER",
    skills: [
      {
        name: "React",
        icon: "react",
        level: "comfortable",
        description: "Component architecture and interactive product interfaces.",
      },
      {
        name: "TypeScript",
        icon: "typescript",
        level: "comfortable",
        description: "Typed state, safer data contracts, and maintainable UI logic.",
      },
      {
        name: "TailwindCSS",
        icon: "tailwind",
        level: "comfortable",
        description: "Responsive systems, custom tokens, and fast visual iteration.",
      },
    ],
  },
  {
    label: "Backend",
    summary: "Application logic, persistence basics, and APIs that support security tooling.",
    signal: "DATA-LAYER",
    skills: [
      {
        name: "Python",
        icon: "python",
        level: "comfortable",
        description: "Automation scripts, scanning workflows, and data processing.",
      },
      {
        name: "SQL",
        icon: "sql",
        level: "learning",
        description: "Schema thinking, querying, and storage for small tools.",
      },
      {
        name: "Node.js",
        icon: "node",
        level: "learning",
        description: "API experiments and JavaScript tooling foundations.",
      },
    ],
  },
  {
    label: "Security",
    summary: "Hands-on tooling for recon, traffic analysis, and vulnerability context.",
    signal: "SEC-LAYER",
    skills: [
      {
        name: "Wireshark",
        icon: "wireshark",
        level: "comfortable",
        description: "Traffic inspection, packet patterns, and protocol-level clues.",
      },
      {
        name: "Burp Suite",
        icon: "burp",
        level: "learning",
        description: "Web testing workflows, proxy analysis, and request tampering labs.",
      },
      {
        name: "Nmap",
        icon: "nmap",
        level: "comfortable",
        description: "Recon scans, service discovery, and structured network reports.",
      },
      {
        name: "Linux",
        icon: "linux",
        level: "comfortable",
        description: "Terminal workflows, permissions, networking, and lab environments.",
      },
    ],
  },
  {
    label: "Tools",
    summary: "Reliable delivery habits for versioning, containers, and project hygiene.",
    signal: "OPS-LAYER",
    skills: [
      {
        name: "Git",
        icon: "git",
        level: "comfortable",
        description: "Branching, review-ready commits, and disciplined project history.",
      },
      {
        name: "Docker",
        icon: "docker",
        level: "learning",
        description: "Portable lab environments and deployment-friendly packaging.",
      },
    ],
  },
];

export const SKILLS_COPY = {
  heading: "A focused technical arsenal organized like a security operations stack.",
  levelLabels: {
    learning: "learning",
    comfortable: "comfortable",
  },
  activePrefix: "Active cluster",
};

export const PROJECTS: Project[] = [
  {
    title: "Network Vulnerability Scanner",
    codename: "RECON-01",
    status: "ACTIVE",
    severity: "HIGH",
    description:
      "A cybersecurity interface for AI-assisted network reconnaissance, animated scan logs, threat metrics, and risk report storytelling.",
    outcome:
      "Designed to turn raw scan activity into a readable security narrative with prioritized findings and clear next steps.",
    stack: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
    metrics: [
      { label: "Mode", value: "Recon" },
      { label: "Reports", value: "Risk scored" },
      { label: "Surface", value: "Network" },
    ],
    telemetry: ["Port sweep", "Service probe", "Risk score", "Report export"],
    githubUrl: "https://github.com/LLawliet188/network-vulnerability-scanner-web",
    liveUrl: "https://github.com/LLawliet188/network-vulnerability-scanner-web",
  },
  {
    title: "Secure Password Vault",
    codename: "VAULT-02",
    status: "DEMO",
    severity: "MED",
    description:
      "An encrypted local password manager concept with AES-256 storage, master password hashing via Argon2, and a clean React frontend.",
    outcome:
      "A practical exploration of local-first security UX, sensitive state handling, and authentication ergonomics.",
    stack: ["React", "TypeScript", "Python", "SQLite"],
    metrics: [
      { label: "Crypto", value: "AES-256" },
      { label: "Hashing", value: "Argon2" },
      { label: "Storage", value: "Local" },
    ],
    telemetry: ["Key derivation", "Encrypted record", "Local store", "Vault unlock"],
    githubUrl: "https://github.com/LLawliet188/secure-password-vault",
    liveUrl: "#contact",
  },
  {
    title: "Threat Intelligence Dashboard",
    codename: "INTEL-03",
    status: "ACTIVE",
    severity: "HIGH",
    description:
      "A SOC-style dashboard concept aggregating threat feeds, CVE alerts, and IOC data with filtering and severity classification.",
    outcome:
      "Built to practice security data storytelling: fast scanning, strong hierarchy, and clear incident prioritization.",
    stack: ["React", "TypeScript", "Python", "REST APIs"],
    metrics: [
      { label: "Feeds", value: "CVE / IOC" },
      { label: "Mode", value: "Live triage" },
      { label: "Output", value: "Severity" },
    ],
    telemetry: ["Feed ingest", "IOC match", "CVE watch", "Alert queue"],
    githubUrl: "https://github.com/LLawliet188/threat-intelligence-dashboard",
    liveUrl: "#contact",
  },
];

export const PROJECTS_COPY = {
  heading: "Field projects staged as cinematic security product stories.",
  githubLabel: "View source",
  externalLabel: "Open project",
  severityPrefix: "SEVERITY",
  stackLabel: "Stack",
};

export const TERMINAL_COPY = {
  heading: "A live profile shell for quick recruiter-level context.",
  path: "~/manas/command-center",
  prompt: "manas@portfolio:~$",
  hint: "Press / to focus terminal",
  placeholder: "Type a command",
  mobileToggle: "Open console",
  mobileClose: "Collapse console",
  unknownCommand: "Command not found. Type help to see available commands.",
  sidePanel: {
    label: "Console Protocol",
    status: "Interactive",
    lines: ["help", "whoami", "skills", "projects", "contact", "clear"],
  },
  commands: {
    help: [
      "Available commands:",
      "help, whoami, skills, projects, contact, clear",
    ],
    whoami: [
      "Manas Ranjan Rao",
      "BSc Computer Science student at IUBH Bad Honnef",
      "Matriculation No.: 92017693",
      "Focus: cybersecurity, secure web apps, and SOC-style tooling",
    ],
    contact: [
      "Email: manasranjanrao188@gmail.com",
      "LinkedIn: linkedin.com/in/manas-ranjan-rao",
      "Availability: cybersecurity internships in Germany or remote",
    ],
  },
};

export const OPPORTUNITY = {
  text: "Currently seeking cybersecurity internships - Germany / Remote",
  cta: "Start a conversation",
};

export const CONTACT_COPY = {
  heading: "Open a secure channel.",
  intro:
    "For internships, collaborations, or security-focused frontend work, send the signal here.",
  response: "Usually responds within 24 hours",
  labels: {
    name: "Name",
    email: "Email",
    message: "Message",
  },
  placeholders: {
    name: "Your name",
    email: "you@example.com",
    message: "Tell me about the role, project, or security challenge.",
  },
  errors: {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    message: "Please add a message with at least 12 characters.",
  },
  submit: {
    idle: "Send Message",
    loading: "Sending",
    success: "Message Sent",
  },
  direct: "or email directly:",
  channelCards: [
    { label: "Email", value: "manasranjanrao188@gmail.com" },
    { label: "LinkedIn", value: "linkedin.com/in/manas-ranjan-rao" },
    { label: "Availability", value: "Internships / Germany / Remote" },
  ],
};

export const FOOTER_COPY = {
  built: "(c) 2026 Manas Ranjan Rao - Built with React, TypeScript & WebGL",
  backToTop: "Back to top",
  links: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
  },
};

export const CERTIFICATIONS_COPY = {
  heading: "Learning pipeline",
  eyebrow: "In progress",
  body:
    "Documenting cybersecurity labs, certification preparation, and practical notes as the portfolio evolves.",
  milestones: [
    { label: "Labs", value: "Network + web security" },
    { label: "Notes", value: "Remediation-first writing" },
    { label: "Next", value: "Internship-ready evidence" },
  ],
};
