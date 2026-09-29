"use client";

import { Popover } from "@/components/ui/Popover";
import styles from "./PopoverDemo.module.css";

export function PopoverDemo() {
  return (
    <div className={styles.row}>
      <Popover trigger={<button type="button" className={styles.buttonTrigger}>Button trigger</button>}>
        <p className={styles.content}>Anchored to a button.</p>
      </Popover>

      <Popover trigger={<a href="#" className={styles.linkTrigger} onClick={(e) => e.preventDefault()}>Link trigger</a>}>
        <p className={styles.content}>Anchored to a link.</p>
      </Popover>

      {/*
        Popover clones its trigger and attaches a ref directly to the DOM node,
        so the trigger must be a native element. components/common/Avatar.tsx
        doesn't forward a ref, so a raw <img> is used here instead.
      */}
      <Popover
        trigger={
          // eslint-disable-next-line @next/next/no-img-element -- must be a raw <img> so Popover's ref attaches to the DOM node directly
          <img src="assets/img/RyanWebsiteImage.png" alt="Image trigger" width={44} height={44} className={styles.imageTrigger} />
        }
      >
        <p className={styles.content}>Anchored to an image.</p>
      </Popover>
    </div>
  );
}
