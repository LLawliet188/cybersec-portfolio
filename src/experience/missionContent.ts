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
    holdLabel: "CLICK & HOLD TO INITIALIZE",
    narration:
      "Cyber intelligence operating system online. Environment stabilized. Awaiting mission authorization.",
    ambient: {
      primary: "#5B21B6",
      secondary: "#38BDF8",
      alert: "#B7FF2A",
    },
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
    holdLabel: "HOLD TO ACCESS IDENTITY SCAN",
    narration:
      "Identity scan initialized. Operator Manas Ranjan Rao. Computer science student in Germany. Cybersecurity trajectory confirmed.",
    ambient: {
      primary: "#7C3AED",
      secondary: "#22D3EE",
      alert: "#B7FF2A",
    },
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
    holdLabel: "CLICK & HOLD TO DECRYPT ARSENAL",
    narration:
      "Arsenal database decrypted. React, TypeScript, Python, Linux, Wireshark, Nmap, and security tooling indexed.",
    ambient: {
      primary: "#0EA5E9",
      secondary: "#A855F7",
      alert: "#FB7185",
    },
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
    holdLabel: "HOLD TO ACCESS OPERATIONS ARCHIVE",
    narration:
      "Operations archive active. Network vulnerability scanner. Secure password vault. Threat intelligence dashboard. Severity classification complete.",
    ambient: {
      primary: "#BE123C",
      secondary: "#7C3AED",
      alert: "#FB7185",
    },
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
    holdLabel: "CLICK & HOLD TO OPEN FILE",
    narration:
      "Classified intelligence file opened. Internship signal active. Operator available for cybersecurity roles in Germany or remote.",
    ambient: {
      primary: "#581C87",
      secondary: "#F472B6",
      alert: "#B7FF2A",
    },
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
    holdLabel: "HOLD TO OPEN SECURE CHANNEL",
    narration:
      "Secure transmission channel open. Contact endpoint verified. Awaiting message from authorized recruiter or collaborator.",
    ambient: {
      primary: "#164E63",
      secondary: "#B7FF2A",
      alert: "#38BDF8",
    },
    signal: [SITE.email, "linkedin.com/in/manas-ranjan-rao", "github.com/LLawliet188"],
    intel: [
      { label: "Email", value: SITE.email },
      { label: "LinkedIn", value: "manas-ranjan-rao" },
      { label: "GitHub", value: SITE.githubHandle },
    ],
  },
];
