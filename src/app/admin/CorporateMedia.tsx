"use client";

import { useState } from "react";
import styles from "./Admin.module.css";

export default function CorporateMedia({ content, setContent }: { content: any, setContent: any }) {
  const [newVideo, setNewVideo] = useState({ title: "", url: "" });
  const [newCert, setNewCert] = useState({ title: "", image: "" });

  const addVideo = () => {
    if (!newVideo.title || !newVideo.url) return;
    const newContent = { ...content };
    newContent.media.videos.push({ id: Date.now().toString(), ...newVideo });
    setContent(newContent);
    setNewVideo({ title: "", url: "" });
  };

  const removeVideo = (id: string) => {
    const newContent = { ...content };
    newContent.media.videos = newContent.media.videos.filter((v: any) => v.id !== id);
    setContent(newContent);
  };

  const addCert = () => {
    if (!newCert.title || !newCert.image) return;
    const newContent = { ...content };
    newContent.media.certificates.push({ id: Date.now().toString(), ...newCert });
    setContent(newContent);
    setNewCert({ title: "", image: "" });
  };

  const removeCert = (id: string) => {
    const newContent = { ...content };
    newContent.media.certificates = newContent.media.certificates.filter((c: any) => c.id !== id);
    setContent(newContent);
  };

  return (
    <div>
      <h3>Corporate Media Management</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
        {/* Videos Section */}
        <div>
          <h4>Corporate Videos (YouTube URLs)</h4>
          <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginTop: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input type="text" placeholder="Video Title" value={newVideo.title} onChange={e => setNewVideo({...newVideo, title: e.target.value})} style={{ padding: "0.5rem", flex: 1 }} />
              <input type="text" placeholder="YouTube URL" value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} style={{ padding: "0.5rem", flex: 2 }} />
              <button onClick={addVideo} className={styles.btnSecondary}>Add</button>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {content.media.videos.map((vid: any) => (
                <li key={vid.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
                  <div>
                    <strong>{vid.title}</strong>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{vid.url}</div>
                  </div>
                  <button onClick={() => removeVideo(vid.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Certificates Section */}
        <div>
          <h4>Compliance Badges & Certificates</h4>
          <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginTop: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              <input type="text" placeholder="Certificate Title (e.g., ISO 9001)" value={newCert.title} onChange={e => setNewCert({...newCert, title: e.target.value})} style={{ padding: "0.5rem", flex: 1 }} />
              <input type="text" placeholder="Image URL (/images/iso.png)" value={newCert.image} onChange={e => setNewCert({...newCert, image: e.target.value})} style={{ padding: "0.5rem", flex: 2 }} />
              <button onClick={addCert} className={styles.btnSecondary}>Add</button>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {content.media.certificates.map((cert: any) => (
                <li key={cert.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #ddd" }}>
                  <div>
                    <strong>{cert.title}</strong>
                    <div style={{ fontSize: "0.8rem", color: "#666" }}>{cert.image}</div>
                  </div>
                  <button onClick={() => removeCert(cert.id)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
