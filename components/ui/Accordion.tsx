"use client";

import { useState, type ReactNode } from "react";
import styles from "./Accordion.module.css";

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, defaultOpenId, allowMultiple = false, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenId ? [defaultOpenId] : []));

  function toggle(id: string) {
    setOpenIds((current) => {
      const isOpen = current.has(id);
      if (allowMultiple) {
        const next = new Set(current);
        if (isOpen) next.delete(id);
        else next.add(id);
        return next;
      }
      return isOpen ? new Set() : new Set([id]);
    });
  }

  return (
    <div className={`${styles.accordion} ${className ?? ""}`}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className={styles.item}>
            <button
              type="button"
              id={headerId}
              className={styles.header}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
            >
              <span>{item.title}</span>
              <span className={styles.chevron} data-open={isOpen} aria-hidden="true">
                ▾
              </span>
            </button>
            <div className={styles.panelWrapper} data-open={isOpen}>
              <div id={panelId} role="region" aria-labelledby={headerId} className={styles.panel}>
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
