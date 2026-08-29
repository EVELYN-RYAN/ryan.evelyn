"use client";

import { useState } from "react";
import { motion, useMotionValueEvent } from "framer-motion";
import { useHeroScroll } from "@/lib/scroll/HeroScrollContext";
import { Avatar } from "@/components/common/Avatar";
import styles from "./NavAvatar.module.css";

export function NavAvatar() {
  const { scrollYProgress } = useHeroScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => setVisible(v > 0.55));

  return (
    <motion.div
      className={styles.navAvatar}
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.4 }}
      transition={{ duration: 0.3 }}
    >
      <Avatar size={44} />
    </motion.div>
  );
}
