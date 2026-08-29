"use client";

import { useState, type FormEvent } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  placeholder?: string;
  onChange: (query: string) => void;
  onSubmit?: (query: string) => void;
  autoFocus?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function SearchBar({
  placeholder = "Search…",
  onChange,
  onSubmit,
  autoFocus,
  className,
  "aria-label": ariaLabel = "Search",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  function update(next: string) {
    setValue(next);
    onChange(next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(value);
  }

  return (
    <form className={`${styles.wrapper} ${className ?? ""}`} onSubmit={handleSubmit} role="search">
      <input
        type="search"
        value={value}
        onChange={(event) => update(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        className={styles.input}
      />
      {value.length > 0 && (
        <button type="button" className={styles.clear} aria-label="Clear search" onClick={() => update("")}>
          ×
        </button>
      )}
    </form>
  );
}
