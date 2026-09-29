"use client";

import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { useScroll, type MotionValue } from "framer-motion";

interface HeroScrollValue {
  heroRef: RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}

const HeroScrollContext = createContext<HeroScrollValue | null>(null);

export function HeroScrollProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  // Hero only renders on "/" — heroRef never attaches on other routes, which
  // trips framer-motion's "target ref not hydrated" invariant once those pages
  // are tall enough to scroll. Fall back to tracking the viewport there.
  const isHomeRoute = usePathname() === "/";
  const { scrollYProgress } = useScroll({
    target: isHomeRoute ? heroRef : undefined,
    offset: ["start start", "end start"],
  });

  return (
    <HeroScrollContext.Provider value={{ heroRef, scrollYProgress }}>
      {children}
    </HeroScrollContext.Provider>
  );
}

export function useHeroScroll() {
  const ctx = useContext(HeroScrollContext);
  if (!ctx) {
    throw new Error("useHeroScroll must be used within a HeroScrollProvider");
  }
  return ctx;
}
