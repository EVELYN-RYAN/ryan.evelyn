import { Hero } from "@/components/hero/Hero";
import { ShowcaseGrid } from "@/components/showcase/ShowcaseGrid";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <Hero />
      <ShowcaseGrid />
      <section id="feedback" className={styles.feedbackSection} data-track-section="feedback-global">
        <h2>Got thoughts?</h2>
        <p>General feedback on the site as a whole is welcome too.</p>
        <FeedbackWidget compactLabel="Leave general feedback" />
      </section>
    </>
  );
}
