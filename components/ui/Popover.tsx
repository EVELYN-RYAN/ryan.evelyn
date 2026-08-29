"use client";

import {
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Popover.module.css";

const NATIVELY_INTERACTIVE = new Set(["button", "a", "input", "select", "textarea"]);
const GAP = 8;

type Placement = "bottom-start" | "bottom-end" | "top-start" | "top-end";

interface Coords {
  top: number;
  left: number;
}

interface PopoverProps {
  /** Must render a native DOM element (button, a, img, div, span, …) — a custom
   * component that doesn't forward its ref won't position correctly. */
  trigger: ReactElement<Record<string, unknown>>;
  children: ReactNode | ((ctx: { close: () => void }) => ReactNode);
  placement?: Placement;
  panelClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

function placeAround(rect: DOMRect, placement: Placement): Coords {
  const top = placement.startsWith("bottom") ? rect.bottom + GAP : rect.top - GAP;
  const left = placement.endsWith("start") ? rect.left : rect.right;
  return { top, left };
}

export function Popover({ trigger, children, placement = "bottom-start", panelClassName, onOpenChange }: PopoverProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);

  const close = () => setOpen(false);

  const reposition = () => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;
    const rect = triggerEl.getBoundingClientRect();
    let next = placeAround(rect, placement);

    const panelEl = panelRef.current;
    if (panelEl) {
      const panelRect = panelEl.getBoundingClientRect();
      const maxLeft = window.innerWidth - panelRect.width - GAP;
      const maxTop = window.innerHeight - panelRect.height - GAP;
      next = {
        top: Math.min(Math.max(next.top, GAP), Math.max(maxTop, GAP)),
        left: Math.min(Math.max(next.left, GAP), Math.max(maxLeft, GAP)),
      };
    }
    setCoords(next);
  };

  useLayoutEffect(() => {
    if (open) reposition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    let frame: number | null = null;
    const scheduleReposition = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        reposition();
      });
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      close();
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("resize", scheduleReposition, { passive: true });
    window.addEventListener("scroll", scheduleReposition, { capture: true, passive: true });
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("resize", scheduleReposition);
      window.removeEventListener("scroll", scheduleReposition, { capture: true });
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!isValidElement(trigger)) return trigger;

  const triggerProps = trigger.props as Record<string, unknown>;
  const isNative = typeof trigger.type === "string" && NATIVELY_INTERACTIVE.has(trigger.type);

  // `ref` isn't part of cloneElement's generic Attributes type, but is valid for
  // the native DOM elements this component requires as a trigger — cast around it.
  const clonedTrigger = cloneElement(trigger, {
    ref: triggerRef,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    onClick: (event: MouseEvent) => {
      (triggerProps.onClick as ((e: MouseEvent) => void) | undefined)?.(event);
      setOpen((o) => !o);
    },
    ...(isNative
      ? {}
      : {
          tabIndex: 0,
          role: "button",
          onKeyDown: (event: KeyboardEvent) => {
            (triggerProps.onKeyDown as ((e: KeyboardEvent) => void) | undefined)?.(event);
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen((o) => !o);
            }
          },
        }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  return (
    <>
      {clonedTrigger}
      {open && coords
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              className={`${styles.panel} ${panelClassName ?? ""}`}
              style={{ top: coords.top, left: coords.left }}
            >
              {typeof children === "function" ? children({ close }) : children}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
