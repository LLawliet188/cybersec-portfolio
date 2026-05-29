import { memo } from "react";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "../components/common/SectionHeader";
import { CERTIFICATIONS_COPY, SECTION_LABELS } from "../content/siteContent";
import { useReveal } from "../hooks/useReveal";
import { revealContainer, revealItem } from "../utils/animation";

const CertificationsComponent = () => {
  const { ref, isInView } = useReveal();

  return (
    <motion.section
      animate={isInView ? "visible" : "hidden"}
      className="section-frame py-16 lg:py-20"
      id="certifications"
      initial="hidden"
      ref={ref}
      variants={revealContainer}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          heading={CERTIFICATIONS_COPY.heading}
          label={SECTION_LABELS.certifications}
        />

        <motion.div
          className="command-border glass-panel grid overflow-hidden rounded-lg lg:grid-cols-[0.42fr_0.58fr]"
          variants={revealItem}
        >
          <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-white/10 bg-base/60 text-accent">
                <BadgeCheck size={20} />
              </div>
              <div>
                <p className="micro-label">{CERTIFICATIONS_COPY.eyebrow}</p>
                <p className="mt-3 max-w-xl font-body text-sm leading-7 text-secondary">
                  {CERTIFICATIONS_COPY.body}
                </p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 p-5 sm:grid-cols-3 sm:p-6">
            {CERTIFICATIONS_COPY.milestones.map((item) => (
              <div
                className="rounded-lg border border-white/10 bg-base/55 p-5"
                key={item.label}
              >
                <p className="font-mono text-[10px] uppercase tracking-signal text-muted">
                  {item.label}
                </p>
                <p className="mt-3 font-display text-lg font-semibold text-primary">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export const Certifications = memo(CertificationsComponent);
