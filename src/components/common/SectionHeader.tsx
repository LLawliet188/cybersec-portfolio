import { memo } from "react";
import { motion } from "framer-motion";
import { revealItem } from "../../utils/animation";

type SectionHeaderProps = {
  label: string;
  heading?: string;
};

const SectionHeaderComponent = ({ label, heading }: SectionHeaderProps) => {
  return (
    <motion.div className="mb-10 space-y-4" variants={revealItem}>
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">
        {label}
      </p>
      {heading ? (
        <h2 className="max-w-3xl font-display text-3xl font-semibold text-primary sm:text-4xl">
          {heading}
        </h2>
      ) : null}
    </motion.div>
  );
};

export const SectionHeader = memo(SectionHeaderComponent);
