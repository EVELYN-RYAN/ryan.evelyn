"use client";

import { useState, type ReactNode } from "react";
import styles from "./GallerySection.module.css";

interface GallerySectionProps {
  title: string;
  description: string;
  sourceViewer?: ReactNode;
  children: ReactNode;
}

export function GallerySection({ title, description, sourceViewer, children }: GallerySectionProps) {
  const [showSource, setShowSource] = useState(false);

  return (
    <section className={styles.section} data-track-section={`gallery-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className={styles.header}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className={styles.demo}>{children}</div>

      {sourceViewer && (
        <>
          <button
            type="button"
            className={styles.sourceToggle}
            onClick={() => setShowSource((v) => !v)}
          >
            {showSource ? "Hide source ▲" : "View source ▼"}
          </button>
          {showSource && sourceViewer}
        </>
      )}
    </section>
  );
}
