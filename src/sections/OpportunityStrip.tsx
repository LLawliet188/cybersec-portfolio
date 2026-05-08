import { memo } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { OPPORTUNITY } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem } from "../utils/animation";

const OpportunityStripComponent = () => {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="px-5 py-8 sm:px-8"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <motion.div
        className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 rounded-lg border border-accent/20 bg-gradient-to-r from-accent/10 via-interactive/10 to-accent/5 px-5 py-5 text-center backdrop-blur-xl sm:flex-row"
        variants={revealItem}
      >
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary">
          {OPPORTUNITY.text}
        </p>
        <a
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent transition hover:text-primary"
          href="#contact"
        >
          {OPPORTUNITY.cta}
          <ArrowRight size={14} />
        </a>
      </motion.div>
    </motion.section>
  );
};

export const OpportunityStrip = memo(OpportunityStripComponent);
