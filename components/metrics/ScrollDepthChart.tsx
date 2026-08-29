import styles from "./metrics.module.css";

interface ScrollDepthChartProps {
  buckets: number[];
}

export function ScrollDepthChart({ buckets }: ScrollDepthChartProps) {
  const max = Math.max(1, ...buckets);
  const total = buckets.reduce((a, b) => a + b, 0);

  return (
    <div className={styles.panel}>
      <h3>Scroll depth (sessions by max depth reached)</h3>
      {total === 0 ? (
        <p className={styles.empty}>No scroll events yet.</p>
      ) : (
        <>
          <div className={styles.histogram}>
            {buckets.map((count, i) => (
              <div
                key={i}
                className={styles.histogramBar}
                style={{ height: `${(count / max) * 100}%` }}
                title={`${count} sessions`}
              />
            ))}
          </div>
          <div className={styles.histogramLabels}>
            {buckets.map((_, i) => (
              <span key={i}>{i * 10}%</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
