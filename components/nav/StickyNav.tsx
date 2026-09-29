import Link from "next/link";
import { NavAvatar } from "./NavAvatar";
import { SocialLinks } from "./SocialLinks";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./StickyNav.module.css";

export function StickyNav() {
  return (
    <nav className={styles.nav} aria-label="Primary" data-track-section="nav">
      <div className={styles.avatarSlot}>
        <NavAvatar />
      </div>
      <div className={styles.links}>
        <Link href="#showcase" className={styles.link} data-track-id="nav-showcase">
          Showcase
        </Link>
        <Link href="#feedback" className={styles.link} data-track-id="nav-feedback">
          Feedback
        </Link>
      </div>
      <SocialLinks />
      <div className={styles.footerLinks}>
        <ThemeToggle />
        <Link href="/components" className={styles.metricsLink} data-track-id="nav-components">
          ‹/›
        </Link>
        <Link href="/metrics" className={styles.metricsLink} data-track-id="nav-metrics">
          ·
        </Link>
      </div>
    </nav>
  );
}
