"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Video } from "lucide-react";

export default function VideosPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/save-content")
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const saveToBackend = async (newContent: any) => {
    await fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent)
    });
    setContent(newContent);
  };

  const handleAdd = () => {
    const newContent = { ...content };
    if (!newContent.videos) newContent.videos = [];
    newContent.videos.push({ id: Date.now().toString(), title: "New Video", url: "" });
    saveToBackend(newContent);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure?")) return;
    const newContent = { ...content };
    newContent.videos = newContent.videos.filter((x: any) => x.id !== id);
    saveToBackend(newContent);
  };

  const handleChange = (id: string, field: string, value: string) => {
    const newContent = { ...content };
    const item = newContent.videos.find((x: any) => x.id === id);
    if (item) {
      item[field] = value;
      setContent(newContent);
    }
  };

  const handleBlur = () => saveToBackend(content);

  if (loading || !content) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)" }}>Video Library</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Manage corporate and product videos.</p>
        </div>
        <button 
          onClick={handleAdd} 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1565FF", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
        >
          <Plus size={16} /> Add Video
        </button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.5rem" }}>
        {(!content.videos || content.videos.length === 0) ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <Video size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
            <p>No videos added yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {content.videos.map((item: any) => (
              <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input 
                  type="text" 
                  value={item.title} 
                  onChange={e => handleChange(item.id, "title", e.target.value)} 
                  onBlur={handleBlur}
                  placeholder="Video Title"
                  style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", flex: 1 }} 
                />
                <input 
                  type="text" 
                  value={item.url} 
                  onChange={e => handleChange(item.id, "url", e.target.value)} 
                  onBlur={handleBlur}
                  placeholder="YouTube URL"
                  style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", flex: 2 }} 
                />
                <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "0.75rem", borderRadius: "6px", cursor: "pointer" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
