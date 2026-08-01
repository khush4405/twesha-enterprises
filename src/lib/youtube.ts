/**
 * YouTube URL helpers.
 *
 * Handles every common URL shape:
 *   https://www.youtube.com/watch?v=ID
 *   https://youtu.be/ID
 *   https://www.youtube.com/embed/ID
 *   https://www.youtube.com/shorts/ID
 *   https://www.youtube.com/live/ID
 *   a bare 11-character video ID
 */

export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const raw = url.trim();

  // A bare video ID
  if (/^[\w-]{11}$/.test(raw)) return raw;

  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/live\/([\w-]{11})/,
    /\/v\/([\w-]{11})/,
  ];

  for (const re of patterns) {
    const m = raw.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Thumbnail URL for a video.
 * "max" (1280x720) is not generated for every upload, so "hq" (480x360)
 * is the safe default - it always exists.
 */
export function getYouTubeThumbnail(url: string, quality: "max" | "hq" | "mq" = "hq"): string {
  const id = getYouTubeId(url);
  if (!id) return "";
  const file = quality === "max" ? "maxresdefault" : quality === "mq" ? "mqdefault" : "hqdefault";
  return `https://img.youtube.com/vi/${id}/${file}.jpg`;
}

export function getYouTubeEmbedUrl(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

export function getYouTubeWatchUrl(url: string): string {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : url;
}
