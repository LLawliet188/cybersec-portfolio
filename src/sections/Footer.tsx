import { memo } from "react";
import { ChevronUp, Mail } from "lucide-react";
import { GithubMark, LinkedinMark } from "../components/social/SocialIcons";
import { FOOTER_COPY, SITE } from "../content/siteContent";

const FooterComponent = () => {
  return (
    <footer className="border-t border-white/10 bg-base/70 px-5 py-8 backdrop-blur-xl sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 text-center sm:flex-row">
        <p className="font-body text-sm text-muted">{FOOTER_COPY.built}</p>

        <div className="flex items-center gap-3">
          <a
            aria-label={FOOTER_COPY.links.github}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-secondary transition hover:border-accent/60 hover:text-primary hover:shadow-cyan-sm"
            href={SITE.links.github}
            rel="noreferrer"
            target="_blank"
          >
            <GithubMark size={16} />
          </a>
          <a
            aria-label={FOOTER_COPY.links.linkedin}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-secondary transition hover:border-accent/60 hover:text-primary hover:shadow-cyan-sm"
            href={SITE.links.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            <LinkedinMark size={16} />
          </a>
          <a
            aria-label={FOOTER_COPY.links.email}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-secondary transition hover:border-accent/60 hover:text-primary hover:shadow-cyan-sm"
            href={SITE.links.email}
          >
            <Mail size={16} />
          </a>
        </div>

        <a
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-signal text-secondary transition hover:text-accent"
          href="#home"
        >
          <ChevronUp size={14} />
          {FOOTER_COPY.backToTop}
        </a>
      </div>
    </footer>
  );
};

export const Footer = memo(FooterComponent);
