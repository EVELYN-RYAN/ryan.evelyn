import styles from "./GameLink.module.css";

interface GameLinkProps {
  itemId: string;
  href: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
}

export function GameLink({ itemId, href, thumbnailSrc, thumbnailAlt }: GameLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
      data-track-id={`play-${itemId}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumbnailSrc} alt={thumbnailAlt} className={styles.thumbnail} />
      <span className={styles.label}>Play in new tab ↗</span>
    </a>
  );
}
