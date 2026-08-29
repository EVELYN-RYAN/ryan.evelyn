export interface ShowcaseItemMeta {
  /** Stable slug — used as the kudos/feedback/analytics item id. */
  id: string;
  title: string;
  description: string;
  tags: string[];
  /** Path to the demo's source file, relative to the repo root, read at build time for the code viewer. */
  sourceFilePath: string;
  /**
   * For demos that live outside this app (e.g. a standalone game): where the
   * "play" thumbnail links out to, and the screenshot shown in its place.
   */
  externalDemo?: {
    href: string;
    thumbnailSrc: string;
    thumbnailAlt: string;
  };
}

export const projects: ShowcaseItemMeta[] = [
  {
    id: "hashed-out-button",
    title: "The Hashed-Out Button",
    description:
      "A deliberately over-engineered button: layered idle/hover/active/loading/success states, ripple feedback, and full keyboard support.",
    tags: ["React", "Framer Motion", "Accessibility"],
    sourceFilePath: "components/showcase/demos/HashedOutButton.tsx",
  },
  {
    id: "ai-tagline",
    title: "AI Tagline Rewriter",
    description:
      "Calls a free-tier LLM through OpenRouter to regenerate a project's tagline live, with graceful fallback if the free model is busy.",
    tags: ["Next.js API Routes", "OpenRouter", "LLM"],
    sourceFilePath: "components/ai/AiDescribeWidget.tsx",
  },
  {
    id: "live-analytics",
    title: "Vanilla-JS Attention Tracker",
    description:
      "A framework-agnostic tracker that watches clicks, scroll depth, and mouse-stillness dwell events, batching them to the server with sendBeacon.",
    tags: ["Vanilla JS", "Postgres", "Analytics"],
    sourceFilePath: "lib/tracker.ts",
  },
  {
    id: "grizzly-vs-silverback",
    title: "Grizzly Bear v Silver Back",
    description:
      "An old vanilla-JS fight sim from way back — speed vs. evasion rolls decide each hit, with HP bars and sound effects. Opens in a new tab.",
    tags: ["Vanilla JS", "HTML", "Game"],
    sourceFilePath: "public/games/grizzly-vs-silverback/index.html",
    externalDemo: {
      href: "/games/grizzly-vs-silverback/index.html",
      thumbnailSrc: "/assets/img/grizzly-vs-silverback.png",
      thumbnailAlt: "Grizzly Bear v Silver Back game home screen",
    },
  },
];
