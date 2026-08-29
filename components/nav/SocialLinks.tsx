import styles from "./SocialLinks.module.css";

export function SocialLinks() {
  return (
    <div className={styles.socials}>
      <a
        href="https://github.com/EVELYN-RYAN"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className={styles.iconLink}
        data-track-id="nav-github"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.16.69-3.83-1.34-3.83-1.34-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.61 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.36-2.65 5.32-5.18 5.6.41.35.77 1.04.77 2.11 0 1.52-.01 2.75-.01 3.12 0 .3.2.66.79.55A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5Z"
          />
        </svg>
      </a>
      <a
        href="https://www.linkedin.com/in/ryan-evelyn/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={styles.iconLink}
        data-track-id="nav-linkedin"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z"
          />
        </svg>
      </a>
      <a
        href="mailto:ryan@rrevelyn.com"
        aria-label="Email"
        className={styles.iconLink}
        data-track-id="nav-email"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M2 4.75A1.75 1.75 0 0 1 3.75 3h16.5A1.75 1.75 0 0 1 22 4.75v14.5A1.75 1.75 0 0 1 20.25 21H3.75A1.75 1.75 0 0 1 2 19.25V4.75Zm1.75-.25a.25.25 0 0 0-.25.25v.4l8.5 5.67 8.5-5.67v-.4a.25.25 0 0 0-.25-.25H3.75Zm16.75 2.31-7.98 5.32a1 1 0 0 1-1.04 0L3.5 6.81v12.44c0 .14.11.25.25.25h16.5a.25.25 0 0 0 .25-.25V6.81Z"
          />
        </svg>
      </a>
    </div>
  );
}
