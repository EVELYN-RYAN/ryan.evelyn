type TrackEvent =
  | { type: "click"; page: string; section?: string; elementId: string }
  | { type: "scroll"; page: string; scrollDepth: number }
  | { type: "dwell"; page: string; section?: string; x: number; y: number };

interface InitTrackerConfig {
  sessionId: string;
  flushIntervalMs?: number;
  endpoint?: string;
}

const STILL_RADIUS_PX = 12;
const STILL_MS = 2000;
const MAX_BATCH_SIZE = 20;

export function initTracker(config: InitTrackerConfig): () => void {
  const endpoint = config.endpoint ?? "/api/track";
  const flushIntervalMs = config.flushIntervalMs ?? 10_000;

  let queue: TrackEvent[] = [];
  const maxScrollDepthByPage = new Map<string, number>();
  let dwellTimer: number | undefined;
  let anchor: { x: number; y: number } | null = null;
  let rafPending = false;

  const currentPage = () => window.location.pathname;

  function flush() {
    if (queue.length === 0) return;
    const payload = JSON.stringify({ sessionId: config.sessionId, events: queue });
    queue = [];

    const sent = navigator.sendBeacon?.(endpoint, new Blob([payload], { type: "application/json" }));
    if (!sent) {
      fetch(endpoint, {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {
        /* best-effort — dropped events are acceptable for analytics */
      });
    }
  }

  function push(event: TrackEvent) {
    queue.push(event);
    if (queue.length >= MAX_BATCH_SIZE) flush();
  }

  function nearestSection(el: Element | null): string | undefined {
    return el?.closest("[data-track-section]")?.getAttribute("data-track-section") ?? undefined;
  }

  function handleClick(event: MouseEvent) {
    const target = event.target as Element | null;
    const trackEl = target?.closest("[data-track-id]");
    if (!trackEl) return;
    push({
      type: "click",
      page: currentPage(),
      elementId: trackEl.getAttribute("data-track-id") ?? "unknown",
      section: nearestSection(trackEl),
    });
  }

  function handleScroll() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const depth = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 1;
      const page = currentPage();
      const prevMax = maxScrollDepthByPage.get(page) ?? 0;
      if (depth <= prevMax) return;

      maxScrollDepthByPage.set(page, depth);
      if (Math.floor(depth * 10) > Math.floor(prevMax * 10)) {
        push({ type: "scroll", page, scrollDepth: depth });
      }
    });
  }

  function resetDwellTimer(x: number, y: number) {
    if (dwellTimer !== undefined) window.clearTimeout(dwellTimer);
    dwellTimer = window.setTimeout(() => {
      const el = document.elementFromPoint(x, y);
      push({ type: "dwell", page: currentPage(), x, y, section: nearestSection(el) });
    }, STILL_MS);
  }

  function handleMouseMove(event: MouseEvent) {
    const { clientX: x, clientY: y } = event;
    if (!anchor) {
      anchor = { x, y };
      resetDwellTimer(x, y);
      return;
    }
    if (Math.hypot(x - anchor.x, y - anchor.y) > STILL_RADIUS_PX) {
      anchor = { x, y };
      resetDwellTimer(x, y);
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === "hidden") flush();
  }

  document.addEventListener("click", handleClick, { capture: true });
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", flush);
  const intervalId = window.setInterval(flush, flushIntervalMs);

  return function cleanup() {
    document.removeEventListener("click", handleClick, { capture: true });
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", flush);
    window.clearInterval(intervalId);
    if (dwellTimer !== undefined) window.clearTimeout(dwellTimer);
    flush();
  };
}
