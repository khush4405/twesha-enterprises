"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Video, Wand2, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import { getYouTubeId, getYouTubeThumbnail, getYouTubeWatchUrl } from "@/lib/youtube";

type Item = {
  id: string;
  title?: string;
  url?: string;
  thumbnail?: string;
  description?: string;
};

export default function VideosPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newUrl, setNewUrl] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/save-content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setLoading(false);
      });
  };

  useEffect(load, []);

  const saveToBackend = async (newContent: any) => {
    setSaving(true);
    await fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent),
    });
    setContent(newContent);
    setSaving(false);
  };

  // Add by pasting a YouTube URL - thumbnail is derived automatically.
  const handleAddFromUrl = () => {
    const id = getYouTubeId(newUrl);
    if (!id) {
      alert(
        "That doesn't look like a YouTube link.\n\nAccepted formats:\n  youtube.com/watch?v=...\n  youtu.be/...\n  youtube.com/shorts/...\n  or a bare 11-character video ID"
      );
      return;
    }
    const newContent = { ...content };
    if (!newContent.videos) newContent.videos = [];
    newContent.videos.push({
      id: Date.now().toString(),
      title: "",
      url: getYouTubeWatchUrl(newUrl),
      thumbnail: getYouTubeThumbnail(newUrl, "max"),
      description: "",
    });
    setNewUrl("");
    saveToBackend(newContent);
  };

  const handleAddBlank = () => {
    const newContent = { ...content };
    if (!newContent.videos) newContent.videos = [];
    newContent.videos.push({ id: Date.now().toString(), title: "", url: "", thumbnail: "", description: "" });
    saveToBackend(newContent);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this video?")) return;
    const newContent = { ...content };
    newContent.videos = newContent.videos.filter((x: Item) => x.id !== id);
    saveToBackend(newContent);
  };

  const handleChange = (id: string, field: string, value: string) => {
    const newContent = { ...content };
    const item = newContent.videos.find((x: Item) => x.id === id);
    if (!item) return;
    item[field] = value;
    // Re-derive the thumbnail when the URL changes, unless one was set by hand.
    if (field === "url") {
      const auto = getYouTubeThumbnail(value, "max");
      if (auto && (!item.thumbnail || item.thumbnail.includes("img.youtube.com"))) {
        item.thumbnail = auto;
      }
    }
    setContent(newContent);
  };

  const regenerateThumb = (id: string) => {
    const newContent = { ...content };
    const item = newContent.videos.find((x: Item) => x.id === id);
    if (!item) return;
    const auto = getYouTubeThumbnail(item.url || "", "max");
    if (!auto) {
      alert("Add a valid YouTube URL first.");
      return;
    }
    item.thumbnail = auto;
    saveToBackend(newContent);
  };

  const handleBlur = () => saveToBackend(content);

  if (loading || !content) return <div style={{ padding: "2rem" }}>Loading...</div>;

  const videos: Item[] = content.videos || [];
  const inputStyle: React.CSSProperties = {
    padding: "0.65rem 0.75rem",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "6px",
    color: "white",
    width: "100%",
    fontSize: "0.875rem",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)" }}>Video Library</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", margin: 0 }}>
            Paste a YouTube link and the thumbnail is pulled in automatically. Shown on <strong>/videos</strong>.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {saving && <span style={{ fontSize: "0.8rem", color: "#60A5FA" }}>Saving…</span>}
          <button
            onClick={load}
            title="Reload from server"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.85rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "white", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem" }}
          >
            <RefreshCw size={14} /> Reload
          </button>
        </div>
      </div>

      {/* Quick add */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", padding: "1.25rem", background: "rgba(21,101,255,0.06)", border: "1px solid rgba(21,101,255,0.25)", borderRadius: "12px" }}>
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddFromUrl();
          }}
          placeholder="Paste a YouTube link, e.g. https://www.youtube.com/watch?v=..."
          style={{ ...inputStyle, flex: 1, padding: "0.75rem" }}
        />
        <button
          onClick={handleAddFromUrl}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "#1565FF", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
        >
          <Wand2 size={16} /> Add &amp; Fetch Thumbnail
        </button>
        <button
          onClick={handleAddBlank}
          title="Add an empty row to fill in manually"
          style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.75rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "white", borderRadius: "8px", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          <Plus size={16} /> Blank
        </button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.5rem" }}>
        {videos.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <Video size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
            <p>No videos added yet. Paste a YouTube link above to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {videos.map((item) => {
              const valid = !!getYouTubeId(item.url || "");
              const preview = item.thumbnail || getYouTubeThumbnail(item.url || "", "hq");
              return (
                <div
                  key={item.id}
                  style={{ display: "grid", gridTemplateColumns: "200px 1fr auto", gap: "1.25rem", padding: "1.25rem", background: "rgba(0,0,0,0.25)", borderRadius: "10px", border: `1px solid ${valid ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.35)"}` }}
                >
                  {/* Thumbnail preview */}
                  <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "8px", overflow: "hidden", background: "#060f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {preview ? (
                      <img
                        src={preview}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          const img = e.currentTarget;
                          const hq = getYouTubeThumbnail(item.url || "", "hq");
                          if (hq && img.src !== hq) img.src = hq;
                        }}
                      />
                    ) : (
                      <Video size={28} color="rgba(255,255,255,0.2)" />
                    )}
                  </div>

                  {/* Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", minWidth: 0 }}>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => handleChange(item.id, "title", e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Video title"
                      style={{ ...inputStyle, fontWeight: 600 }}
                    />
                    <input
                      type="text"
                      value={item.url || ""}
                      onChange={(e) => handleChange(item.id, "url", e.target.value)}
                      onBlur={handleBlur}
                      placeholder="YouTube URL"
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      value={item.description || ""}
                      onChange={(e) => handleChange(item.id, "description", e.target.value)}
                      onBlur={handleBlur}
                      placeholder="Short description (optional)"
                      style={inputStyle}
                    />
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="text"
                        value={item.thumbnail || ""}
                        onChange={(e) => handleChange(item.id, "thumbnail", e.target.value)}
                        onBlur={handleBlur}
                        placeholder="Thumbnail URL (auto-filled from YouTube)"
                        style={{ ...inputStyle, fontSize: "0.78rem", color: "rgba(255,255,255,0.65)" }}
                      />
                      <button
                        onClick={() => regenerateThumb(item.id)}
                        title="Re-fetch thumbnail from the YouTube URL"
                        style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.55rem 0.8rem", background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.35)", color: "#D4AF37", borderRadius: "6px", cursor: "pointer", fontSize: "0.78rem", whiteSpace: "nowrap" }}
                      >
                        <Wand2 size={13} /> Fetch
                      </button>
                    </div>
                    {!valid && (
                      <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#f87171", fontSize: "0.78rem" }}>
                        <AlertCircle size={13} /> Not a recognised YouTube URL — this video will be hidden on the public page.
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {valid && (
                      <a
                        href={getYouTubeWatchUrl(item.url || "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open on YouTube"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#60A5FA", padding: "0.7rem", borderRadius: "6px" }}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", padding: "0.7rem", borderRadius: "6px", cursor: "pointer" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
