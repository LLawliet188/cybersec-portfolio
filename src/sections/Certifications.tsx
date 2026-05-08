import { memo } from "react";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { CERTIFICATIONS_COPY } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem } from "../utils/animation";

const CertificationsComponent = () => {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="scroll-mt-28 px-5 py-12 sm:px-8"
      id="certifications"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="flex flex-col gap-5 rounded-lg border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
          variants={revealItem}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-white/10 bg-base/50 text-accent">
              <BadgeCheck size={19} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {CERTIFICATIONS_COPY.eyebrow}
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-primary">
                {CERTIFICATIONS_COPY.heading}
              </h2>
            </div>
          </div>
          <p className="max-w-2xl font-body text-sm leading-7 text-secondary">
            {CERTIFICATIONS_COPY.body}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export const Certifications = memo(CertificationsComponent);
