"use client";

import { useRef, useState } from "react";
import styles from "./HashedOutButton.module.css";

type ButtonState = "idle" | "loading" | "success";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function HashedOutButton() {
  const [state, setState] = useState<ButtonState>("idle");
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (state !== "idle") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const id = rippleId.current++;
    setRipples((prev) => [
      ...prev,
      { id, x: event.clientX - rect.left - size / 2, y: event.clientY - rect.top - size / 2, size },
    ]);
    window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);

    setState("loading");
    window.setTimeout(() => {
      setState("success");
      window.setTimeout(() => setState("idle"), 1400);
    }, 900);
  }

  return (
    <div className={styles.stage}>
      <button
        type="button"
        className={`${styles.button} ${state === "success" ? styles.success : ""}`}
        onClick={handleClick}
        disabled={state !== "idle"}
        data-track-id="hashed-out-button"
        aria-live="polite"
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className={styles.ripple}
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
        {state === "loading" && <span className={styles.spinner} aria-hidden="true" />}
        <span>{state === "idle" && "Deploy"}{state === "loading" && "Deploying…"}{state === "success" && "Shipped ✓"}</span>
      </button>
    </div>
  );
}
