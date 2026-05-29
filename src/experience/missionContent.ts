import { PROJECTS, SITE, SKILL_GROUPS } from "../content/siteContent";
import type { MissionNode } from "./types";

const skillSignal = SKILL_GROUPS.map(
  (group) => `${group.label}: ${group.skills.map((skill) => skill.name).join(" / ")}`,
);

export const missionNodes: MissionNode[] = [
  {
    id: "boot",
    phase: "00",
    label: "Boot Sequence",
    title: "Cyber Intelligence Operating System",
    dek: "Enter an active defense environment where portfolio data behaves like classified mission intelligence.",
    holdLabel: "PRESS, HOLD, RELEASE TO INITIALIZE",
    narration:
      "Threat mapping complete. Identity reconstruction is ready. Welcome to the intelligence archive.",
    ambient: {
      primary: "#5B21B6",
      secondary: "#38BDF8",
      alert: "#B7FF2A",
    },
    artifact: "core",
    signal: ["Neural archive waking", "Telemetry silent", "Defense layer idle"],
    intel: [
      { label: "Operator", value: SITE.name },
      { label: "Mode", value: "Classified portfolio simulation" },
      { label: "Signal", value: "Ready for scan" },
    ],
  },
  {
    id: "identity",
    phase: "01",
    label: "Identity Scan",
    title: "Reconstructing Operator Profile",
    dek: "The system scans academic identity, location, interests, and current cybersecurity trajectory.",
    holdLabel: "PRESS, HOLD, RELEASE TO SCAN",
    narration:
      "Identity reconstruction initiated. Manas Ranjan Rao is pursuing computer science in Germany, with a growing focus on security operations and secure systems.",
    ambient: {
      primary: "#7C3AED",
      secondary: "#22D3EE",
      alert: "#B7FF2A",
    },
    artifact: "scanner",
    signal: ["BSc Computer Science", "IUBH Bad Honnef", "Germany / Remote"],
    intel: [
      { label: "Degree", value: SITE.education.degree },
      { label: "Institution", value: SITE.education.institution },
      { label: "Matriculation", value: SITE.education.matriculationNumber },
    ],
  },
  {
    id: "arsenal",
    phase: "02",
    label: "Arsenal Database",
    title: "Mapping Technical Capabilities",
    dek: "Skills are organized as live operating layers: interface, data, security tooling, and delivery systems.",
    holdLabel: "PRESS, HOLD, RELEASE TO DECRYPT",
    narration:
      "The arsenal database is opening. Interface engineering, Python automation, Linux workflows, and reconnaissance tooling are now indexed.",
    ambient: {
      primary: "#0EA5E9",
      secondary: "#A855F7",
      alert: "#FB7185",
    },
    artifact: "construct",
    signal: skillSignal,
    intel: [
      { label: "Frontend", value: "React / TypeScript / Tailwind" },
      { label: "Security", value: "Wireshark / Burp Suite / Nmap / Linux" },
      { label: "Tools", value: "Git / Docker" },
    ],
  },
  {
    id: "operations",
    phase: "03",
    label: "Operations Archive",
    title: "Reviewing Active Field Work",
    dek: "Projects appear as operations: recon interfaces, vault concepts, and threat intelligence dashboards.",
    holdLabel: "PRESS, HOLD, RELEASE TO OPEN ARCHIVE",
    narration:
      "Operations archive unlocked. Reconnaissance tools, vault experiments, and threat intelligence interfaces are arranged for review.",
    ambient: {
      primary: "#BE123C",
      secondary: "#7C3AED",
      alert: "#FB7185",
    },
    artifact: "vault",
    signal: PROJECTS.map((project) => `${project.codename}: ${project.title}`),
    intel: PROJECTS.map((project) => ({
      label: `${project.status} / ${project.severity}`,
      value: project.title,
    })),
  },
  {
    id: "file",
    phase: "04",
    label: "Classified Intelligence File",
    title: "Compiling Recruiter Briefing",
    dek: "The portfolio compresses into a concise intelligence file: learning evidence, work mode, and contact readiness.",
    holdLabel: "PRESS, HOLD, RELEASE TO OPEN FILE",
    narration:
      "The intelligence file is open. Internship signal active, with availability for cybersecurity-focused roles in Germany or remote.",
    ambient: {
      primary: "#581C87",
      secondary: "#F472B6",
      alert: "#B7FF2A",
    },
    artifact: "dossier",
    signal: ["Internship readiness", "Secure web apps", "SOC workflows"],
    intel: [
      { label: "Seeking", value: "Cybersecurity internships" },
      { label: "Availability", value: "Germany / Remote" },
      { label: "Profile", value: "Secure systems + frontend craft" },
    ],
  },
  {
    id: "transmission",
    phase: "05",
    label: "Secure Transmission Channel",
    title: "Open Encrypted Contact Link",
    dek: "The final state opens a secure line for internships, collaborations, or cybersecurity-focused frontend work.",
    holdLabel: "PRESS, HOLD, RELEASE TO TRANSMIT",
    narration:
      "Secure transmission channel established. The contact endpoint is verified and ready for a concise mission brief.",
    ambient: {
      primary: "#164E63",
      secondary: "#B7FF2A",
      alert: "#38BDF8",
    },
    artifact: "beacon",
    signal: [SITE.email, "linkedin.com/in/manas-ranjan-rao", "github.com/LLawliet188"],
    intel: [
      { label: "Email", value: SITE.email },
      { label: "LinkedIn", value: "manas-ranjan-rao" },
      { label: "GitHub", value: SITE.githubHandle },
    ],
  },
];
