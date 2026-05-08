import { useRef } from "react";
import { useInView } from "framer-motion";

export const useReveal = () => {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-80px 0px -80px 0px",
  });

  return { ref, isInView };
};
