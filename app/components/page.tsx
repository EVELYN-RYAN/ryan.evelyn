import Link from "next/link";
import { CodeViewer } from "@/components/showcase/CodeViewer";
import { GallerySection } from "@/components/gallery/GallerySection";
import { SearchBarDemo } from "@/components/gallery/SearchBarDemo";
import { PopoverDemo } from "@/components/gallery/PopoverDemo";
import { ConfirmDialogDemo } from "@/components/gallery/ConfirmDialogDemo";
import { AccordionDemo } from "@/components/gallery/AccordionDemo";
import styles from "./page.module.css";

export default function ComponentsPage() {
  return (
    <div className={styles.page}>
      <Link href="/#showcase" className={styles.backLink}>
        ← Back to showcase
      </Link>
      <h1>Component Gallery</h1>
      <p>A small set of hand-rolled, dependency-free UI primitives used across this site.</p>

      <div className={styles.sections}>
        <GallerySection
          title="Search Bar"
          description="A styled search input with a clear button, filtering a live list as you type."
          sourceViewer={<CodeViewer sourceFilePath="components/ui/SearchBar.tsx" />}
        >
          <SearchBarDemo />
        </GallerySection>

        <GallerySection
          title="Popover"
          description="Anchors to whatever triggers it — a button, a link, an image, or any native element."
          sourceViewer={<CodeViewer sourceFilePath="components/ui/Popover.tsx" />}
        >
          <PopoverDemo />
        </GallerySection>

        <GallerySection
          title="Confirm Dialog"
          description="An alert-style modal that blurs the page and resolves a promise on accept or cancel."
          sourceViewer={<CodeViewer sourceFilePath="components/ui/ConfirmDialog.tsx" />}
        >
          <ConfirmDialogDemo />
        </GallerySection>

        <GallerySection
          title="Accordion"
          description="Single-open, FAQ-style expand/collapse with a CSS-only height animation."
          sourceViewer={<CodeViewer sourceFilePath="components/ui/Accordion.tsx" />}
        >
          <AccordionDemo />
        </GallerySection>
      </div>
    </div>
  );
}
