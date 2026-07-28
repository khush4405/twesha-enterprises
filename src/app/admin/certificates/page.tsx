"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, FileCheck } from "lucide-react";

export default function CertificatesPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/save-content")
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const saveToBackend = async (newContent: any) => {
    setSaving(true);
    await fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent)
    });
    setContent(newContent);
    setSaving(false);
  };

  const handleAdd = () => {
    const newContent = { ...content };
    if (!newContent.certificates) newContent.certificates = [];
    newContent.certificates.push({ id: Date.now().toString(), title: "New Certificate", image: "" });
    saveToBackend(newContent);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure?")) return;
    const newContent = { ...content };
    newContent.certificates = newContent.certificates.filter((x: any) => x.id !== id);
    saveToBackend(newContent);
  };

  const handleChange = (id: string, field: string, value: string) => {
    const newContent = { ...content };
    const cert = newContent.certificates.find((x: any) => x.id === id);
    if (cert) {
      cert[field] = value;
      setContent(newContent); // just update local state
    }
  };

  const handleBlur = () => {
    saveToBackend(content); // save to backend on blur
  };

  if (loading || !content) return <div style={{ padding: "2rem" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)" }}>Certificates Manager</h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Manage the certifications displayed on the homepage.</p>
        </div>
        <button 
          onClick={handleAdd} 
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1565FF", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
        >
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.5rem" }}>
        {(!content.certificates || content.certificates.length === 0) ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <FileCheck size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
            <p>No certificates added yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {content.certificates.map((cert: any) => (
              <div key={cert.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <input 
                  type="text" 
                  value={cert.title} 
                  onChange={e => handleChange(cert.id, "title", e.target.value)} 
                  onBlur={handleBlur}
                  placeholder="Certificate Title (e.g. ISO 9001:2015)"
                  style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", flex: 1 }} 
                />
                <input 
                  type="text" 
                  value={cert.image} 
                  onChange={e => handleChange(cert.id, "image", e.target.value)} 
                  onBlur={handleBlur}
                  placeholder="Image URL"
                  style={{ padding: "0.75rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", flex: 2 }} 
                />
                <button onClick={() => handleDelete(cert.id)} style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "0.75rem", borderRadius: "6px", cursor: "pointer" }}>
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
