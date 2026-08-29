"use client";

import { Accordion } from "@/components/ui/Accordion";
import styles from "./AccordionDemo.module.css";

const ITEMS = [
  {
    id: "item-1",
    title: "What is this component library?",
    content: "A small set of hand-rolled, dependency-free UI primitives used across this site.",
  },
  {
    id: "item-2",
    title: "Is it built on a component library?",
    content: "No — everything here is plain React + CSS Modules, no Tailwind or headless-UI dependency.",
  },
  {
    id: "item-3",
    title: "Can more than one item be open at once?",
    content: "Not by default — this accordion is single-open, like an FAQ. Pass allowMultiple to change that.",
  },
];

export function AccordionDemo() {
  return (
    <div className={styles.wrapper}>
      <Accordion items={ITEMS} defaultOpenId="item-1" />
    </div>
  );
}
