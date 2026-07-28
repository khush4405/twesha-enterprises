"use client";

import { useEffect, useState } from "react";
import { UploadCloud, AlertCircle, CheckCircle2, FileText, Image as ImageIcon } from "lucide-react";

export default function PublishCenter() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/git/status");
      if (res.ok) setStatus(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
        Loading publish status...
      </div>
    );
  }

  const allChanges = status ? [...status.staged, ...status.unstaged, ...status.untracked] : [];
  const hasChanges = allChanges.length > 0;

  return (
    <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.25rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UploadCloud color="#D4AF37" /> Publish Center
          </h2>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Review local changes before pushing to live.</p>
        </div>
        <button onClick={fetchStatus} style={{ background: "none", border: "none", color: "#60A5FA", cursor: "pointer", fontSize: "0.875rem" }}>Refresh</button>
      </div>

      {hasChanges ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: "8px", display: "flex", gap: "0.75rem" }}>
            <AlertCircle color="#eab308" />
            <div>
              <h4 style={{ margin: "0 0 0.25rem 0", color: "#eab308", fontSize: "0.875rem" }}>You have unpublished changes</h4>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(234, 179, 8, 0.8)" }}>Run git commit to publish these to the live site.</p>
            </div>
          </div>
          
          <div>
            <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem" }}>{allChanges.length}</span>
              Modified Files
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
              {allChanges.map((f, i) => (
                <li key={i} style={{ padding: "0.5rem 0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "6px", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {f.endsWith(".json") ? <FileText size={14} color="#60A5FA" /> : <ImageIcon size={14} color="#c084fc" />}
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ padding: "1rem", background: "rgba(0,0,0,0.4)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <code style={{ color: "#4ade80", fontSize: "0.875rem", fontFamily: "monospace" }}>git add . && git commit -m "CMS Update" && git push</code>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem 0" }}>
          <CheckCircle2 size={48} color="#4ade80" style={{ marginBottom: "1rem" }} />
          <h3 style={{ margin: "0 0 0.5rem 0" }}>All Changes Published</h3>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>Your site is fully in sync.</p>
        </div>
      )}
    </div>
  );
}
