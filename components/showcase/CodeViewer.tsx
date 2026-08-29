import { readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { codeToHtml } from "shiki";
import { retroTheme } from "@/lib/shikiTheme";
import styles from "./CodeViewer.module.css";

const LANG_BY_EXT: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "tsx",
  ".js": "javascript",
  ".jsx": "jsx",
  ".css": "css",
  ".html": "html",
};

interface CodeViewerProps {
  sourceFilePath: string;
}

export async function CodeViewer({ sourceFilePath }: CodeViewerProps) {
  const absolutePath = join(/* turbopackIgnore: true */ process.cwd(), sourceFilePath);
  const code = readFileSync(absolutePath, "utf-8");
  const lang = LANG_BY_EXT[extname(sourceFilePath)] ?? "text";

  const html = await codeToHtml(code, {
    lang,
    theme: retroTheme,
  });

  return (
    <div className={styles.wrapper}>
      <p className={styles.filePath}>{sourceFilePath}</p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
