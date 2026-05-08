import { useEffect, useState } from "react";

export const useActiveSection = (ids: string[]) => {
  const [activeSection, setActiveSection] = useState(ids[0] ?? "");

  useEffect(() => {
    let frameId = 0;

    const updateActiveSection = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const anchorOffset = window.scrollY + 150;
        const currentId =
          ids.reduce((current, id) => {
            const element = document.getElementById(id);
            if (!element) return current;
            return element.offsetTop <= anchorOffset ? id : current;
          }, ids[0] ?? "") || ids[0];

        setActiveSection(currentId);
        frameId = 0;
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [ids]);

  return activeSection;
};
