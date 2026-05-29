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

export const HERO = {
  introTitle: "Welcome to the Cybersecurity Portfolio",
  introSubtitle:
    "A cinematic digital field report for secure systems, ethical hacking, and product-minded engineering.",
  introAction: "Click to enter",
  introHint: "Headphones recommended",
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
    liveUrl: SITE.links.email,
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
    liveUrl: SITE.links.email,
  },
];
