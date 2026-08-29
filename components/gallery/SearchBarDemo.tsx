"use client";

import { useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import styles from "./SearchBarDemo.module.css";

const ITEMS = [
  "Hashed-Out Button",
  "AI Tagline Rewriter",
  "Vanilla-JS Attention Tracker",
  "Grizzly Bear v Silver Back",
  "Popover",
  "Confirm Dialog",
  "Accordion",
  "Search Bar",
];

export function SearchBarDemo() {
  const [query, setQuery] = useState("");
  const filtered = ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={styles.wrapper}>
      <SearchBar placeholder="Search components…" onChange={setQuery} />
      <ul className={styles.results}>
        {filtered.length > 0 ? (
          filtered.map((item) => <li key={item}>{item}</li>)
        ) : (
          <li className={styles.empty}>No matches.</li>
        )}
      </ul>
    </div>
  );
}
