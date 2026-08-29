import type { ThemeRegistrationRaw } from "shiki";

/**
 * A custom Shiki theme matching the site's retro-futurism palette, so the code
 * viewer reads as native to the page rather than a bolted-on stock theme.
 */
export const retroTheme: ThemeRegistrationRaw = {
  name: "retro-futurism",
  type: "dark",
  colors: {
    "editor.background": "#12151a",
    "editor.foreground": "#e4e7ea",
  },
  settings: [
    {
      settings: {
        foreground: "#e4e7ea",
        background: "#12151a",
      },
    },
    {
      scope: ["comment"],
      settings: { foreground: "#565c63", fontStyle: "italic" },
    },
    {
      scope: ["string", "constant.other.symbol"],
      settings: { foreground: "#f4ff3a" },
    },
    {
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: "#f4ff3a" },
    },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"],
      settings: { foreground: "#2cffb1" },
    },
    {
      scope: ["entity.name.function", "support.function"],
      settings: { foreground: "#8a9199" },
    },
    {
      scope: ["entity.name.tag", "entity.name.type", "support.class", "support.type"],
      settings: { foreground: "#2cffb1" },
    },
    {
      scope: ["variable", "variable.parameter", "variable.other"],
      settings: { foreground: "#e4e7ea" },
    },
    {
      scope: ["punctuation", "meta.brace"],
      settings: { foreground: "#8a9199" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#f4ff3a" },
    },
  ],
};
