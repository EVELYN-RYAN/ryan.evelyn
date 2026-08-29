import styles from "./metrics.module.css";

interface DwellHeatmapProps {
  points: { x: number | null; y: number | null; section: string | null }[];
}

// Coordinates are raw viewport pixels captured at whatever size the visitor's
// browser happened to be — normalize against a nominal reference frame so
// points from different screens land in roughly the right place.
const REFERENCE_WIDTH = 1440;
const REFERENCE_HEIGHT = 900;

export function DwellHeatmap({ points }: DwellHeatmapProps) {
  const valid = points.filter((p): p is { x: number; y: number; section: string | null } => p.x != null && p.y != null);

  return (
    <div className={styles.panel}>
      <h3>Mouse dwell hotspots (2s+ stillness)</h3>
      {valid.length === 0 ? (
        <p className={styles.empty}>No dwell events yet.</p>
      ) : (
        <div className={styles.scatter}>
          {valid.map((p, i) => (
            <span
              key={i}
              className={styles.dot}
              title={p.section ?? "unknown section"}
              style={{
                left: `${Math.min(100, (p.x / REFERENCE_WIDTH) * 100)}%`,
                top: `${Math.min(100, (p.y / REFERENCE_HEIGHT) * 100)}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
