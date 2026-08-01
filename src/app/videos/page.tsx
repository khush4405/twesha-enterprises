import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { PlayCircle } from "lucide-react";
import VideoGrid from "./VideoGrid";
import CtaBanner from "@/components/CtaBanner";
import styles from "./Media.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Video Showcase | Twesha Enterprises",
  description:
    "Product demonstrations, installation guides and facility tours from Twesha Enterprises.",
};

function loadContent(): any {
  try {
    const p = path.join(process.cwd(), "src", "data", "masterContent.json");
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    console.error("Failed to read masterContent.json", e);
    return {};
  }
}

export default function VideosPage() {
  const content = loadContent();
  const videos = content.videos || [];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>
            <PlayCircle size={14} /> Media Library
          </span>
          <h1 className={styles.title}>Video Showcase</h1>
          <p className={styles.subtitle}>
            Product demonstrations, installation guides and facility tours.
          </p>
        </div>
      </section>

      <div className={styles.container}>
        <VideoGrid videos={videos} />
      </div>

      <CtaBanner />
    </div>
  );
}
