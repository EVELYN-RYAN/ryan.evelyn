"use client";

import { createContext, useContext, useRef, type ReactNode, type RefObject } from "react";
import { useScroll, type MotionValue } from "framer-motion";

interface HeroScrollValue {
  heroRef: RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}

const HeroScrollContext = createContext<HeroScrollValue | null>(null);

export function HeroScrollProvider({ children }: { children: ReactNode }) {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
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
