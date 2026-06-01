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
    artifactName: "Encrypted Origin Seed",
    artifactMeaning:
      "A sealed AI consciousness seed that introduces the portfolio as a classified intelligence system.",
    worldName: "Indigo intelligence chamber",
    interactionHint: "Hold the origin seed, or use find out more, to initialize the archive.",
    narration:
      "Threat mapping complete. Identity reconstruction is ready. Welcome to the intelligence archive.",
    narrationSrc: `${import.meta.env.BASE_URL}audio/narration/boot.mp3`,
    ambient: {
      primary: "#101A3A",
      secondary: "#38BDF8",
      alert: "#CBD5E1",
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
    artifactName: "Cyber DNA Core",
    artifactMeaning:
      "A biometric lattice that represents academic identity, location, and the early cybersecurity path.",
    worldName: "Cold blue identity reactor",
    interactionHint: "Hold the identity core, or use find out more, to reconstruct the operator profile.",
    narration:
      "Identity reconstruction initiated. Manas Ranjan Rao is pursuing computer science in Germany, with a growing focus on security operations and secure systems.",
    narrationSrc: `${import.meta.env.BASE_URL}audio/narration/identity.mp3`,
    ambient: {
      primary: "#111C3D",
      secondary: "#00C8FF",
      alert: "#E2E8F0",
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
    artifactName: "Toolchain Reactor",
    artifactMeaning:
      "A modular tactical matrix where frontend, automation, Linux, and security tools lock into one capability engine.",
    worldName: "Violet tactical matrix",
    interactionHint: "Hold the toolchain reactor, or use find out more, to decrypt the arsenal database.",
    narration:
      "The arsenal database is opening. Interface engineering, Python automation, Linux workflows, and reconnaissance tooling are now indexed.",
    narrationSrc: `${import.meta.env.BASE_URL}audio/narration/arsenal.mp3`,
    ambient: {
      primary: "#261047",
      secondary: "#8B5CF6",
      alert: "#22D3EE",
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
    artifactName: "Mission Archive Vault",
    artifactMeaning:
      "A sealed operations prism built to represent project work as classified field intelligence.",
    worldName: "Crimson operations vault",
    interactionHint: "Hold the archive vault, or use find out more, to open active operations.",
    narration:
      "Operations archive unlocked. Reconnaissance tools, vault experiments, and threat intelligence interfaces are arranged for review.",
    narrationSrc: `${import.meta.env.BASE_URL}audio/narration/operations.mp3`,
    ambient: {
      primary: "#18070A",
      secondary: "#EF4444",
      alert: "#F97316",
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
    artifactName: "Recruiter Data Monolith",
    artifactMeaning:
      "A compact intelligence file that condenses internship readiness, evidence, and operator signal.",
    worldName: "Holographic briefing sanctuary",
    interactionHint: "Hold the data monolith, or use find out more, to compile the intelligence file.",
    narration:
      "The intelligence file is open. Internship signal active, with availability for cybersecurity-focused roles in Germany or remote.",
    narrationSrc: `${import.meta.env.BASE_URL}audio/narration/file.mp3`,
    ambient: {
      primary: "#182033",
      secondary: "#A78BFA",
      alert: "#F8FAFC",
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
    artifactName: "Quantum Relay Beacon",
    artifactMeaning:
      "A secure signal tower that turns the environment into a verified communication gateway.",
    worldName: "Cyan transmission horizon",
    interactionHint: "Hold the relay beacon, or use find out more, to open the secure transmission channel.",
    narration:
      "Secure transmission channel established. The contact endpoint is verified and ready for a concise mission brief.",
    narrationSrc: `${import.meta.env.BASE_URL}audio/narration/transmission.mp3`,
    ambient: {
      primary: "#061B24",
      secondary: "#22D3EE",
      alert: "#E0F2FE",
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
