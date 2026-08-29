import { clicksByElement, scrollDepthBuckets, dwellPoints, geoBreakdown } from "@/lib/db/metricsQueries";
import { ClicksByElementChart } from "@/components/metrics/ClicksByElementChart";
import { ScrollDepthChart } from "@/components/metrics/ScrollDepthChart";
import { DwellHeatmap } from "@/components/metrics/DwellHeatmap";
import { GeoBreakdownTable } from "@/components/metrics/GeoBreakdownTable";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const [clicks, scrollBuckets, dwell, geo] = await Promise.all([
    clicksByElement(),
    scrollDepthBuckets(),
    dwellPoints(),
    geoBreakdown(),
  ]);

  return (
    <div className={styles.page}>
      <h1>Metrics</h1>
      <div className={styles.grid}>
        <ClicksByElementChart data={clicks} />
        <ScrollDepthChart buckets={scrollBuckets} />
        <DwellHeatmap points={dwell} />
        <GeoBreakdownTable data={geo} />
      </div>
    </div>
  );
}
