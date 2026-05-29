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
      className="px-5 py-10 sm:px-8"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <motion.div
        className="command-border glass-panel mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 overflow-hidden rounded-lg px-5 py-6 text-center sm:flex-row"
        variants={revealItem}
      >
        <p className="font-mono text-xs uppercase tracking-signal text-primary">
          {OPPORTUNITY.text}
        </p>
        <a
          className="inline-flex items-center gap-2 rounded-md border border-accent/25 bg-accent/10 px-4 py-2 font-mono text-xs uppercase tracking-signal text-accent transition hover:border-accent/60 hover:text-primary"
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
