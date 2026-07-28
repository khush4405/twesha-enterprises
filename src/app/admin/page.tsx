"use client";

import PublishCenter from "./PublishCenter";
import { FolderTree, MessageSquare, Package, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, enquiries: 0, quotes: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/save-content").then(r => r.json()),
      fetch("/api/enquiries").then(r => r.json()),
      fetch("/api/quotes").then(r => r.json())
    ]).then(([content, enq, quo]) => {
      setStats({
        categories: content.categories?.length || 0,
        enquiries: enq?.length || 0,
        quotes: quo?.length || 0,
      });
    }).catch(console.error);
  }, []);

  const handleBackup = async () => {
    try {
      const res = await fetch("/api/save-content");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `twesha_backup_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Backup failed");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)" }}>Dashboard Overview</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>Manage your catalog, view inquiries, and publish changes.</p>
        </div>
        <button 
          onClick={handleBackup}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", background: "rgba(21, 101, 255, 0.1)", border: "1px solid rgba(21, 101, 255, 0.5)", color: "#60A5FA", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
        >
          <Download size={18} /> Backup JSON
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
        <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Top Level Categories</span>
            <FolderTree size={20} color="#D4AF37" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.categories}</div>
        </div>
        <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>New Enquiries</span>
            <MessageSquare size={20} color="#60A5FA" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.enquiries}</div>
        </div>
        <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>Quote Requests</span>
            <Package size={20} color="#4ade80" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.quotes}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
        <PublishCenter />
      </div>
    </div>
  );
}
