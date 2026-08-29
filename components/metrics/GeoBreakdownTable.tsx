import styles from "./metrics.module.css";

interface GeoBreakdownTableProps {
  data: { country: string | null; visitors: number }[];
}

export function GeoBreakdownTable({ data }: GeoBreakdownTableProps) {
  return (
    <div className={styles.panel}>
      <h3>Visitors by country</h3>
      {data.length === 0 ? (
        <p className={styles.empty}>No geo data yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Country</th>
              <th>Visitors</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.country}>
                <td>{row.country}</td>
                <td>{row.visitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
