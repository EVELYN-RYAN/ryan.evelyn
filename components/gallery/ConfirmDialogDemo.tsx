"use client";

import { useState } from "react";
import { confirmAction } from "@/components/ui/ConfirmDialog";
import styles from "./ConfirmDialogDemo.module.css";

export function ConfirmDialogDemo() {
  const [result, setResult] = useState<string | null>(null);

  async function handleClick() {
    const confirmed = await confirmAction({
      title: "Delete item?",
      message: "This can't be undone.",
      confirmLabel: "Delete",
      tone: "danger",
    });
    setResult(confirmed ? "Confirmed" : "Cancelled");
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" className={styles.trigger} onClick={handleClick}>
        Delete demo item
      </button>
      {result && <p className={styles.result}>{result}</p>}
    </div>
  );
}
