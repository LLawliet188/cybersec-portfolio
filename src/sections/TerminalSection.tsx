import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/common/SectionHeader";
import {
  PROJECTS,
  SECTION_LABELS,
  SKILL_GROUPS,
  TERMINAL_COPY,
} from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem } from "../utils/animation";

type TerminalLine = {
  id: string;
  type: "input" | "output";
  text: string;
};

const TerminalSectionComponent = () => {
  const { ref, isInView } = useReveal();
  const [command, setCommand] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const timeoutIds = useRef<number[]>([]);

  const dynamicResponses = useMemo(
    () => ({
      skills: SKILL_GROUPS.map(
        (group) =>
          `${group.label}: ${group.skills.map((skill) => skill.name).join(", ")}`,
      ),
      projects: PROJECTS.map((project) => `${project.title}: ${project.description}`),
    }),
    [],
  );

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [lines, command]);

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingInField =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (event.key === "/" && !isTypingInField && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        setIsMobileOpen(true);
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, []);

  const pushLine = useCallback((line: TerminalLine) => {
    setLines((current) => [...current, line]);
  }, []);

  const typeResponse = useCallback((responseLines: string[]) => {
    setIsTyping(true);

    const typeLine = (lineIndex: number) => {
      if (lineIndex >= responseLines.length) {
        setIsTyping(false);
        return;
      }

      const id = `output-${Date.now()}-${lineIndex}`;
      const fullText = responseLines[lineIndex];
      let cursor = 0;
      pushLine({ id, type: "output", text: "" });

      const tick = () => {
        cursor += 1;
        setLines((current) =>
          current.map((line) =>
            line.id === id ? { ...line, text: fullText.slice(0, cursor) } : line,
          ),
        );

        if (cursor < fullText.length) {
          const delay = 12 + Math.random() * 28;
          const timeoutId = window.setTimeout(tick, delay);
          timeoutIds.current.push(timeoutId);
          return;
        }

        const timeoutId = window.setTimeout(() => typeLine(lineIndex + 1), 110);
        timeoutIds.current.push(timeoutId);
      };

      tick();
    };

    typeLine(0);
  }, [pushLine]);

  const getCommandResponse = useCallback(
    (value: string) => {
      switch (value.toLowerCase()) {
        case "help":
          return TERMINAL_COPY.commands.help;
        case "whoami":
          return TERMINAL_COPY.commands.whoami;
        case "skills":
          return dynamicResponses.skills;
        case "projects":
          return dynamicResponses.projects;
        case "contact":
          return TERMINAL_COPY.commands.contact;
        default:
          return [TERMINAL_COPY.unknownCommand];
      }
    },
    [dynamicResponses.projects, dynamicResponses.skills],
  );

  const runCommand = useCallback(() => {
    if (isTyping) return;

    const normalizedCommand = command.trim();
    if (!normalizedCommand) return;

    pushLine({
      id: `input-${Date.now()}`,
      type: "input",
      text: `${TERMINAL_COPY.prompt} ${normalizedCommand}`,
    });
    setCommand("");

    if (normalizedCommand.toLowerCase() === "clear") {
      setLines([]);
      return;
    }

    typeResponse(getCommandResponse(normalizedCommand));
  }, [command, getCommandResponse, isTyping, pushLine, typeResponse]);

  const submitCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand();
  };

  const handleCommandKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    runCommand();
  };

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="relative scroll-mt-28 px-5 py-24 sm:px-8"
      id="terminal"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeader heading={TERMINAL_COPY.heading} label={SECTION_LABELS.terminal} />

        <motion.button
          className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-primary md:hidden"
          onClick={() => setIsMobileOpen((value) => !value)}
          type="button"
          variants={revealItem}
        >
          {isMobileOpen ? TERMINAL_COPY.mobileClose : TERMINAL_COPY.mobileToggle}
          {isMobileOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </motion.button>

        <motion.div
          className={`${isMobileOpen ? "block" : "hidden"} md:block`}
          variants={revealItem}
        >
          <div
            className="overflow-hidden rounded-lg border border-white/10 bg-[#070B0F]/90 shadow-2xl backdrop-blur-xl"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-3">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <p className="mx-auto pr-14 font-mono text-xs text-secondary">
                {TERMINAL_COPY.path}
              </p>
            </div>

            <div
              className="terminal-scroll h-48 overflow-y-auto px-5 py-5 font-mono text-sm leading-7 text-secondary"
              ref={outputRef}
            >
              {lines.map((line) => (
                <p
                  className={line.type === "input" ? "text-primary" : "text-secondary"}
                  key={line.id}
                >
                  {line.text}
                </p>
              ))}
              <form className="flex items-center gap-2" onSubmit={submitCommand}>
                <span className="text-accent">{TERMINAL_COPY.prompt}</span>
                <span className="min-h-7 flex-1 text-primary">
                  {command}
                  <span className="terminal-cursor ml-1 inline-block h-4 w-2 translate-y-0.5 bg-accent" />
                </span>
                <input
                  aria-label={TERMINAL_COPY.placeholder}
                  autoComplete="off"
                  className="sr-only"
                  disabled={isTyping}
                  onChange={(event) => setCommand(event.target.value)}
                  onKeyDown={handleCommandKeyDown}
                  ref={inputRef}
                  value={command}
                />
              </form>
            </div>
          </div>

          <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
            {TERMINAL_COPY.hint}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export const TerminalSection = memo(TerminalSectionComponent);
