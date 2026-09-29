"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import styles from "./StarryBackground.module.css";

const PARALLAX_RATE = 1 / 4;

export function StarryBackground() {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const y = useTransform(scrollY, (v) => -v * PARALLAX_RATE);
  // The layer has to be tall enough that its bottom reaches the viewport
  // bottom at max scroll: viewport + (max scroll × rate).
  const [extraHeight, setExtraHeight] = useState(0);

  useEffect(() => {
    const measure = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setExtraHeight(Math.max(0, maxScroll) * PARALLAX_RATE);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className={styles.layer}
      style={reduceMotion ? undefined : { y, height: `calc(100vh + ${extraHeight}px)` }}
    />
  );
}
