"use client";

import { motion, useTransform } from "framer-motion";
import { useHeroScroll } from "@/lib/scroll/HeroScrollContext";
import { Avatar } from "@/components/common/Avatar";
import styles from "./Hero.module.css";

export function Hero() {
  const { heroRef, scrollYProgress } = useHeroScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={heroRef} className={`${styles.hero} gridTexture`} data-track-section="hero">
      <motion.div style={{ opacity, scale, y }} className={styles.avatarWrap}>
        <img src="/assets/img/codeTags.svg" alt="" aria-hidden="true" className={styles.codeTagsBg} />
        <Avatar size={320} className={styles.avatarGlow} />
      </motion.div>
      <p className={styles.eyebrow}>Ryan Evelyn — Software Engineer</p>
      <h1>Building interfaces that feel like the future.</h1>
      <p className={styles.tagline}>
        A portfolio of hand-built components, experiments, and tools — inspect the code, give
        kudos, and tell me what you think.
      </p>
      <span className={styles.scrollHint}>Scroll to explore</span>
    </section>
  );
}
