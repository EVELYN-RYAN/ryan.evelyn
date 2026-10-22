import { projects } from "@/lib/content/projects";
import { CodeViewer } from "./CodeViewer";
import { ShowcaseRow } from "./ShowcaseRow";
import { Button } from "bndl";
import { GameLink } from "./demos/GameLink";
import { AiDescribeWidget } from "@/components/ai/AiDescribeWidget";
import type { ShowcaseItemMeta } from "@/lib/content/projects";
import styles from "./ShowcaseGrid.module.css";

const ROW_SIZE = 2;

function demoFor(meta: ShowcaseItemMeta) {
  if (meta.externalDemo) {
    return <GameLink itemId={meta.id} {...meta.externalDemo} />;
  }
  switch (meta.id) {
    case "hashed-out-button":
      return <Button status="done" label={'Finished'} />;
    case "ai-tagline":
      return <AiDescribeWidget itemId={meta.id} />;
    default:
      return undefined;
  }
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export function ShowcaseGrid() {
  const rows = chunk(projects, ROW_SIZE);

  return (
    <section id="showcase" className={styles.section} data-track-section="showcase">
      <h2 className={styles.heading}>Showcase</h2>
      <div className={styles.grid}>
        {rows.map((row, index) => (
          <ShowcaseRow
            key={index}
            items={row.map((meta) => ({
              meta,
              demo: demoFor(meta),
              codeViewer: <CodeViewer sourceFilePath={meta.sourceFilePath} />,
            }))}
          />
        ))}
      </div>
    </section>
  );
}
