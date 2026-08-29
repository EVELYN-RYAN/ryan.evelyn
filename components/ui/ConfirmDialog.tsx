"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import styles from "./ConfirmDialog.module.css";

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
}

interface PendingRequest {
  options: ConfirmOptions;
  resolve: (value: boolean) => void;
}

let registerRequest: ((request: PendingRequest | null) => void) | null = null;

export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (!registerRequest) {
      console.warn("ConfirmDialogHost is not mounted — resolving false.");
      resolve(false);
      return;
    }
    registerRequest({ options, resolve });
  });
}

export function ConfirmDialogHost() {
  const [request, setRequest] = useState<PendingRequest | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    registerRequest = setRequest;
    return () => {
      registerRequest = null;
    };
  }, []);

  useEffect(() => {
    if (!request) return;
    cancelRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [request]);

  if (!request) return null;

  function settle(result: boolean) {
    request?.resolve(result);
    setRequest(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      settle(false);
      return;
    }
    if (event.key === "Tab") {
      const focusables = [cancelRef.current, confirmRef.current].filter(Boolean) as HTMLButtonElement[];
      if (focusables.length < 2) return;
      const [first, last] = event.shiftKey ? [focusables[1], focusables[0]] : [focusables[0], focusables[1]];
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  const { options } = request;
  const tone = options.tone ?? "default";

  return createPortal(
    <div className={styles.backdrop} onClick={() => settle(false)}>
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={options.message ? "confirm-dialog-message" : undefined}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h3 id="confirm-dialog-title">{options.title}</h3>
        {options.message && <p id="confirm-dialog-message">{options.message}</p>}
        <div className={styles.actions}>
          <button ref={cancelRef} type="button" className={styles.cancel} onClick={() => settle(false)}>
            {options.cancelLabel ?? "Cancel"}
          </button>
          <button
            ref={confirmRef}
            type="button"
            className={tone === "danger" ? styles.danger : styles.confirm}
            onClick={() => settle(true)}
          >
            {options.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
