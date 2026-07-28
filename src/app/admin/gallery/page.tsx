"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function GalleryPage() {
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
    if (!newContent.gallery) newContent.gallery = [];
    newContent.gallery.push({ id: Date.now().toString(), title: "New Image", image: "" });
    saveToBackend(newContent);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure?")) return;
    const newContent = { ...content };
    newContent.gallery = newContent.gallery.filter((x: any) => x.id !== id);
    saveToBackend(newContent);
  };

  const handleChange = (id: string, field: string, value: string) => {
    const newContent = { ...content };
    const item = newContent.gallery.find((x: any) => x.id === id);
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
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)" }}>Image Gallery</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Manage images for the public gallery.</p>
        </div>
        <button 
          onClick={handleAdd} 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1565FF", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.5rem" }}>
        {(!content.gallery || content.gallery.length === 0) ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <ImageIcon size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
            <p>No images in gallery.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {content.gallery.map((item: any) => (
              <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                {item.image ? (
                  <img src={item.image} alt="preview" style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "4px" }} />
                ) : (
                  <div style={{ width: "100%", height: "150px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ImageIcon size={24} color="rgba(255,255,255,0.2)" />
                  </div>
                )}
                <input type="text" value={item.title} onChange={e => handleChange(item.id, "title", e.target.value)} onBlur={handleBlur} placeholder="Image Title" style={{ padding: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "white" }} />
                <input type="text" value={item.image} onChange={e => handleChange(item.id, "image", e.target.value)} onBlur={handleBlur} placeholder="Image URL" style={{ padding: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "white" }} />
                <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "0.5rem", borderRadius: "4px", cursor: "pointer", marginTop: "0.5rem" }}>Delete Image</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
