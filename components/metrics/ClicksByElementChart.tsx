import styles from "./metrics.module.css";

interface ClicksByElementChartProps {
  data: { elementId: string | null; count: number }[];
}

export function ClicksByElementChart({ data }: ClicksByElementChartProps) {
  if (data.length === 0) {
    return (
      <div className={styles.panel}>
        <h3>Clicks by element</h3>
        <p className={styles.empty}>No click events yet.</p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count));

  return (
    <div className={styles.panel}>
      <h3>Clicks by element</h3>
      {data.map((row) => (
        <div className={styles.barRow} key={row.elementId}>
          <span className={styles.barLabel}>{row.elementId}</span>
          <div className={styles.barTrack}>
            <div className={styles.barFill} style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          <span className={styles.barValue}>{row.count}</span>
        </div>
      ))}
    </div>
  );
}
