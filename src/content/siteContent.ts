export type SkillLevel = "learning" | "comfortable";

export type Skill = {
  name: string;
  icon: string;
  level: SkillLevel;
};

export type SkillGroup = {
  label: string;
  skills: Skill[];
};

export type Project = {
  title: string;
  status: "ACTIVE" | "DEMO" | "ARCHIVED";
  severity: "HIGH" | "MED" | "LOW";
  description: string;
  stack: string[];
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
  },
};

export const NAV_LINKS = [
  { label: "Home", href: "#home", id: "home" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Certifications", href: "#certifications", id: "certifications" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const NAV_COPY = {
  status: "[AVAILABLE FOR INTERNSHIP]",
  openMenu: "Open navigation",
  closeMenu: "Close navigation",
};

export const HERO = {
  credential: "// BSc Computer Science - IUBH Bad Honnef, Germany",
  headingLines: ["Cybersecurity &", "Software Engineering Student"],
  subheading:
    "I build secure web experiences, study real-world attack surfaces, and turn cybersecurity learning into practical tools.",
  ctas: {
    primary: "View Projects",
    secondary: "GitHub Profile",
  },
  stats: ["12 Projects", "8 Tools", "500+ Hours"],
  panel: {
    label: "SOC SIGNAL",
    score: "98.7",
    caption: "defense posture",
    rows: [
      { label: "Recon", value: "mapped" },
      { label: "Web surface", value: "hardened" },
      { label: "Threat feed", value: "live" },
    ],
  },
};

export const SECTION_LABELS = {
  about: "01 / ABOUT",
  skills: "02 / SKILLS",
  projects: "03 / PROJECTS",
  terminal: "04 / TERMINAL",
  contact: "05 / CONTACT",
};

export const ABOUT = {
  heading: "Learning security by building, breaking, and documenting carefully.",
  body:
    "I am pursuing a BSc Computer Science degree from IUBH Bad Honnef while building a practical foundation in cybersecurity and modern web development. I am especially interested in network security, penetration testing, SOC workflows, secure web apps, and the discipline of writing clear remediation notes after every lab or project.",
  education: {
    title: "Education",
    degree: "BSc Computer Science",
    institution: "IUBH Bad Honnef",
    location: "Germany",
    matriculationLabel: "Matriculation No.",
    matriculationNumber: "92017693",
  },
  focusTitle: "Areas of Focus",
  focusAreas: [
    {
      title: "Network Security",
      description: "Traffic analysis, scanning workflows, and defensive visibility.",
      icon: "network",
    },
    {
      title: "Penetration Testing",
      description: "Recon, exploit validation, and clear remediation reporting.",
      icon: "scan",
    },
    {
      title: "SOC Operations",
      description: "Threat triage, event context, and severity classification.",
      icon: "shield",
    },
    {
      title: "Secure Web Apps",
      description: "Frontend systems designed with privacy and abuse cases in mind.",
      icon: "lock",
    },
  ],
  timeline: [
    { date: "2023", label: "CS Student" },
    { date: "2024", label: "Web Dev" },
    { date: "Now", label: "Cybersecurity Track" },
  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Frontend",
    skills: [
      { name: "React", icon: "react", level: "comfortable" },
      { name: "TypeScript", icon: "typescript", level: "comfortable" },
      { name: "TailwindCSS", icon: "tailwind", level: "comfortable" },
    ],
  },
  {
    label: "Backend",
    skills: [
      { name: "Python", icon: "python", level: "comfortable" },
      { name: "SQL", icon: "sql", level: "learning" },
      { name: "Node.js", icon: "node", level: "learning" },
    ],
  },
  {
    label: "Security",
    skills: [
      { name: "Wireshark", icon: "wireshark", level: "comfortable" },
      { name: "Burp Suite", icon: "burp", level: "learning" },
      { name: "Nmap", icon: "nmap", level: "comfortable" },
      { name: "Linux", icon: "linux", level: "comfortable" },
    ],
  },
  {
    label: "Tools",
    skills: [
      { name: "Git", icon: "git", level: "comfortable" },
      { name: "Docker", icon: "docker", level: "learning" },
    ],
  },
];

export const SKILLS_COPY = {
  heading: "Focused tooling for secure product work.",
  levelLabels: {
    learning: "learning",
    comfortable: "comfortable",
  },
};

export const PROJECTS: Project[] = [
  {
    title: "Network Vulnerability Scanner",
    status: "ACTIVE",
    severity: "HIGH",
    description:
      "A standalone React cybersecurity interface for AI-powered network reconnaissance, animated scan logs, threat metrics, and risk report storytelling.",
    stack: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
    githubUrl: "https://github.com/LLawliet188/network-vulnerability-scanner-web",
    liveUrl: "https://github.com/LLawliet188/network-vulnerability-scanner-web",
  },
  {
    title: "Secure Password Vault",
    status: "DEMO",
    severity: "MED",
    description:
      "An encrypted local password manager with AES-256 storage, master password hashing via Argon2, and a clean React frontend.",
    stack: ["React", "TypeScript", "Python", "SQLite"],
    githubUrl: "https://github.com/LLawliet188/secure-password-vault",
    liveUrl: "#contact",
  },
  {
    title: "Threat Intelligence Dashboard",
    status: "ACTIVE",
    severity: "HIGH",
    description:
      "A real-time dashboard aggregating threat feeds, CVE alerts, and IOC data into a SOC-style interface with filtering and severity classification.",
    stack: ["React", "TypeScript", "Python", "REST APIs"],
    githubUrl: "https://github.com/LLawliet188/threat-intelligence-dashboard",
    liveUrl: "#contact",
  },
];

export const PROJECTS_COPY = {
  heading: "Security projects with practical outcomes.",
  githubLabel: "View source",
  externalLabel: "Open project",
  severityPrefix: "SEVERITY:",
};

export const TERMINAL_COPY = {
  heading: "Interactive profile shell.",
  path: "~/manas/portfolio",
  prompt: "manas@portfolio:~$",
  hint: "Press / to focus terminal",
  placeholder: "Type a command",
  mobileToggle: "Open terminal",
  mobileClose: "Collapse terminal",
  unknownCommand: "Command not found. Type help to see available commands.",
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
  cta: "Get in Touch",
};

export const CONTACT_COPY = {
  heading: "Let's build something secure.",
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
};

export const FOOTER_COPY = {
  built: "(c) 2026 Manas Ranjan Rao - Built with React & TypeScript",
  backToTop: "Back to top",
  links: {
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
  },
};

export const CERTIFICATIONS_COPY = {
  heading: "Certifications",
  eyebrow: "In progress",
  body:
    "Documenting current cybersecurity learning milestones, labs, and certification preparation as the portfolio evolves.",
};
