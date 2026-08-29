"use client";

import { useEffect, useState } from "react";
import styles from "./KudosButton.module.css";

interface KudosButtonProps {
  itemId: string;
}

export function KudosButton({ itemId }: KudosButtonProps) {
  const [count, setCount] = useState<number | null>(null);
  const [given, setGiven] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch(`/api/kudos?itemId=${encodeURIComponent(itemId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (typeof data.count === "number") setCount(data.count);
        if (typeof data.given === "boolean") setGiven(data.given);
      })
      .catch(() => {
        /* leave state unknown on network failure */
      });
  }, [itemId]);

  async function handleClick() {
    if (given || pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/kudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
        setGiven(true);
      }
    } catch {
      /* network failure — leave state unchanged, button stays clickable */
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${given ? styles.given : ""}`}
      onClick={handleClick}
      disabled={given || pending}
      data-track-id={`kudos-${itemId}`}
      aria-pressed={given}
    >
      <span aria-hidden="true">{given ? "▲" : "△"}</span>
      <span>Kudos</span>
      <span className={styles.count}>{count ?? "–"}</span>
    </button>
  );
}
