"use client";

import type { ReactNode } from "react";
import type { ShowcaseItemMeta } from "@/lib/content/projects";
import { KudosButton } from "@/components/kudos/KudosButton";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import styles from "./ShowcaseItem.module.css";

interface ShowcaseItemProps {
  meta: ShowcaseItemMeta;
  demo?: ReactNode;
  isCodeOpen: boolean;
  onToggleCode: () => void;
}

export function ShowcaseItem({ meta, demo, isCodeOpen, onToggleCode }: ShowcaseItemProps) {
  return (
    <article className={styles.card} data-track-section={meta.id}>
      <div className={styles.header}>
        <h3>{meta.title}</h3>
        <p>{meta.description}</p>
        <div className={styles.tags}>
          {meta.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {demo ? (
        <div className={styles.demo}>{demo}</div>
      ) : (
        <p className={styles.noDemo}>Vanilla-JS module — no live UI, see the source below.</p>
      )}

      <button
        type="button"
        className={styles.codeToggle}
        onClick={onToggleCode}
        aria-expanded={isCodeOpen}
        data-track-id={`view-code-${meta.id}`}
      >
        {isCodeOpen ? "Hide code ▲" : "View code ▼"}
      </button>

      <div className={styles.footer}>
        <KudosButton itemId={meta.id} />
        <FeedbackWidget projectId={meta.id} compactLabel="Feedback on this" />
      </div>
    </article>
  );
}
