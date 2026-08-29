"use client";

import { useState } from "react";
import styles from "./AiDescribeWidget.module.css";

interface AiDescribeWidgetProps {
  itemId: string;
}

type Status = "idle" | "loading" | "done" | "error";

export function AiDescribeWidget({ itemId }: AiDescribeWidgetProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [tagline, setTagline] = useState<string | null>(null);

  async function handleClick() {
    setStatus("loading");
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      const data = await res.json();
      setTagline(data.tagline);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={styles.stage}>
      {status === "done" && tagline && <p className={styles.result}>&ldquo;{tagline}&rdquo;</p>}
      {status === "error" && (
        <p className={styles.error}>The free AI tier is busy right now — try again in a bit.</p>
      )}
      <button
        type="button"
        className={styles.trigger}
        onClick={handleClick}
        disabled={status === "loading"}
        data-track-id={`ai-describe-${itemId}`}
      >
        {status === "loading" ? "Generating…" : "✨ Reimagine this description"}
      </button>
    </div>
  );
}
