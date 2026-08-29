"use client";

import { useState, type FormEvent } from "react";
import styles from "./FeedbackWidget.module.css";

interface FeedbackWidgetProps {
  projectId?: string;
  compactLabel?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function FeedbackWidget({ projectId, compactLabel = "Leave feedback" }: FeedbackWidgetProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("company") ?? "").length > 0) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          message: data.get("message"),
          projectId,
        }),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        data-track-id={`feedback-open-${projectId ?? "global"}`}
      >
        {compactLabel} →
      </button>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} data-track-section="feedback">
      <div className={styles.field}>
        <label htmlFor={`email-${projectId ?? "global"}`}>Email</label>
        <input id={`email-${projectId ?? "global"}`} name="email" type="email" required />
      </div>
      <div className={styles.field}>
        <label htmlFor={`message-${projectId ?? "global"}`}>Message</label>
        <textarea id={`message-${projectId ?? "global"}`} name="message" rows={3} required minLength={5} />
      </div>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`company-${projectId ?? "global"}`}>Company</label>
        <input id={`company-${projectId ?? "global"}`} name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          disabled={status === "submitting"}
          data-track-id={`feedback-submit-${projectId ?? "global"}`}
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
        {status === "success" && <span className={`${styles.status} ${styles.success}`}>Thanks — got it.</span>}
        {status === "error" && <span className={`${styles.status} ${styles.error}`}>Something went wrong.</span>}
      </div>
    </form>
  );
}
