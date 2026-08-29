"use client";

import { useState, type ReactNode } from "react";
import type { ShowcaseItemMeta } from "@/lib/content/projects";
import { ShowcaseItem } from "./ShowcaseItem";
import styles from "./ShowcaseRow.module.css";

interface RowEntry {
  meta: ShowcaseItemMeta;
  demo?: ReactNode;
  codeViewer: ReactNode;
}

interface ShowcaseRowProps {
  items: RowEntry[];
}

export function ShowcaseRow({ items }: ShowcaseRowProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((current) => (current === id ? null : id));

  const openIndex = items.findIndex((item) => item.meta.id === openId);
  const openItem = openIndex >= 0 ? items[openIndex] : undefined;

  return (
    <div className={styles.row}>
      <div className={styles.cards} data-cols={items.length}>
        {items.map((item) => (
          <ShowcaseItem
            key={item.meta.id}
            meta={item.meta}
            demo={item.demo}
            isCodeOpen={item.meta.id === openId}
            onToggleCode={() => toggle(item.meta.id)}
          />
        ))}
      </div>

      {openItem && (
        <div className={styles.codePanel} data-align={openIndex === 0 ? "left" : "right"}>
          <span className={styles.connector} aria-hidden="true" />
          {openItem.codeViewer}
        </div>
      )}
    </div>
  );
}
