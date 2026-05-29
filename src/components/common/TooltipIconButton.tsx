import { memo, type ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type TooltipIconButtonProps = {
  href: string;
  label: string;
  icon: ComponentType<LucideProps>;
};

const TooltipIconButtonComponent = ({
  href,
  label,
  icon: Icon,
}: TooltipIconButtonProps) => {
  return (
    <a
      aria-label={label}
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-secondary transition hover:border-accent/70 hover:text-primary hover:shadow-cyan-sm"
      href={href}
      rel="noreferrer"
      target={href.startsWith("http") ? "_blank" : undefined}
    >
      <Icon size={16} />
      <span className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#0B1117] px-2 py-1 font-mono text-[10px] uppercase tracking-signal text-primary opacity-0 shadow-cyan-sm transition group-hover:opacity-100">
        {label}
      </span>
    </a>
  );
};

export const TooltipIconButton = memo(TooltipIconButtonComponent);
