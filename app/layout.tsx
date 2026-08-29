import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { HeroScrollProvider } from "@/lib/scroll/HeroScrollContext";
import { TrackerProvider } from "@/lib/TrackerProvider";
import { StickyNav } from "@/components/nav/StickyNav";
import "./globals.css";
import styles from "./layout.module.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ryan Evelyn — Portfolio",
  description: "A showcase of projects, components, and experiments by Ryan Evelyn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="scanlines">
        <TrackerProvider>
          <HeroScrollProvider>
            <div className={styles.shell}>
              <StickyNav />
              <main className={styles.main}>{children}</main>
            </div>
          </HeroScrollProvider>
        </TrackerProvider>
      </body>
    </html>
  );
}
