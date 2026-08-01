"use client";

import { useState } from "react";
import { Play, X, Video as VideoIcon } from "lucide-react";
import { getYouTubeId, getYouTubeThumbnail, getYouTubeEmbedUrl } from "@/lib/youtube";
import styles from "./Media.module.css";

type Item = { id: string; title?: string; url?: string; thumbnail?: string; description?: string };

export default function VideoGrid({ videos = [] }: { videos?: Item[] }) {
  const [active, setActive] = useState<Item | null>(null);

  const playable = videos.filter((v) => getYouTubeId(v.url || ""));

  if (playable.length === 0) {
    return (
      <div className={styles.empty}>
        <VideoIcon size={48} />
        <h3>No videos published yet</h3>
        <p>Product demonstrations and facility tours will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {playable.map((v) => {
          const thumb = v.thumbnail || getYouTubeThumbnail(v.url || "", "max");
          return (
            <button key={v.id} className={styles.card} onClick={() => setActive(v)}>
              <div className={styles.thumbWrap}>
                <img
                  src={thumb}
                  alt={v.title || "Video"}
                  className={styles.thumb}
                  loading="lazy"
                  onError={(e) => {
                    // maxresdefault does not exist for every upload - fall back
                    const img = e.currentTarget;
                    const hq = getYouTubeThumbnail(v.url || "", "hq");
                    if (img.src !== hq) img.src = hq;
                  }}
                />
                <span className={styles.playBadge}>
                  <Play size={22} fill="currentColor" />
                </span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{v.title || "Untitled video"}</h3>
                {v.description && <p className={styles.cardDesc}>{v.description}</p>}
              </div>
            </button>
          );
        })}
      </div>

      {active && (
        <div className={styles.lightbox} onClick={() => setActive(null)}>
          <button className={styles.close} aria-label="Close video">
            <X size={28} />
          </button>
          <div className={styles.player} onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`${getYouTubeEmbedUrl(active.url || "")}?autoplay=1&rel=0`}
              title={active.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
