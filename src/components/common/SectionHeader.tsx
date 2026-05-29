import { memo } from "react";
import { motion } from "framer-motion";
import { revealItem } from "../../utils/animation";

type SectionHeaderProps = {
  label: string;
  heading?: string;
  align?: "left" | "center";
};

const SectionHeaderComponent = ({
  label,
  heading,
  align = "left",
}: SectionHeaderProps) => {
  return (
    <motion.div
      className={`mb-12 space-y-4 ${align === "center" ? "mx-auto text-center" : ""}`}
      variants={revealItem}
    >
      <p className="micro-label">
        {label}
      </p>
      {heading ? (
        <h2
          className={`font-display text-3xl font-semibold leading-tight text-primary sm:text-4xl lg:text-5xl ${
            align === "center" ? "mx-auto max-w-4xl" : "max-w-4xl"
          }`}
        >
          {heading}
        </h2>
      ) : null}
    </motion.div>
  );
};

export const SectionHeader = memo(SectionHeaderComponent);
