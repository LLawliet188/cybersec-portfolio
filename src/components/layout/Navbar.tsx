import { memo, useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { NAV_COPY, NAV_LINKS, SITE } from "../../content/siteContent";
import { useActiveSection } from "../../hooks/useActiveSection";
import { premiumEase } from "../../utils/animation";

const NavbarComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sectionIds = useMemo(() => NAV_LINKS.map((link) => link.id), []);
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 16);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const renderLinks = (className = "") => (
    <div className={className}>
      {NAV_LINKS.map((link) => (
        <a
          className="group relative px-1 py-3 font-body text-sm text-secondary transition hover:text-primary"
          href={link.href}
          key={link.href}
          onClick={() => setIsOpen(false)}
        >
          {link.label}
          <span
            className={`absolute bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
              activeSection === link.id ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </a>
      ))}
    </div>
  );

  return (
    <motion.header
      animate={{ y: 0, opacity: 1 }}
      className={`fixed left-0 top-0 z-50 w-full bg-base/50 backdrop-blur-md transition ${
        isScrolled ? "border-b border-white/5" : "border-b border-transparent"
      }`}
      initial={{ y: -24, opacity: 0 }}
      transition={{ duration: 0.7, ease: premiumEase }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <a className="flex items-center gap-3" href="#home">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-accent shadow-cyan-sm">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M8 7L3 12L8 17M16 7L21 12L16 17M14 4L10 20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.16em] text-primary">
            {SITE.brand}
          </span>
        </a>

        {renderLinks("hidden items-center gap-7 lg:flex")}

        <div className="hidden items-center gap-3 lg:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)] motion-safe:animate-pulse" />
          <span className="rounded border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
            {NAV_COPY.status}
          </span>
        </div>

        <button
          aria-label={isOpen ? NAV_COPY.closeMenu : NAV_COPY.openMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-primary lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      <div
        className={`overflow-hidden border-t border-white/5 bg-base/90 backdrop-blur-md transition-all lg:hidden ${
          isOpen ? "max-h-96" : "max-h-0 border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
          {renderLinks("flex flex-col gap-1")}
          <div className="mt-3 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)] motion-safe:animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-secondary">
              {NAV_COPY.status}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export const Navbar = memo(NavbarComponent);
