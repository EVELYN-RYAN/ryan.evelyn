"use client";

import { useEffect, type ReactNode } from "react";
import { initTracker } from "./tracker";

const SESSION_KEY = "session_id";

export function TrackerProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let sessionId = window.sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      window.sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return initTracker({ sessionId });
  }, []);

  return children;
}
