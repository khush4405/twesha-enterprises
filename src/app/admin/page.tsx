"use client";

import { useState, useEffect } from "react";
import styles from "./Admin.module.css";
import CatalogManager from "./CatalogManager";
import EnquiriesInbox from "./EnquiriesInbox";
import CorporateMedia from "./CorporateMedia";
import GlobalQuotesInbox from "./GlobalQuotesInbox";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("catalog");
  const [content, setContent] = useState<any>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/save-content").then(res => res.json()).then(data => setContent(data));
    fetch("/api/enquiries").then(res => res.json()).then(data => setEnquiries(data));
    fetch("/api/quotes").then(res => res.json()).then(data => setQuotes(data));
  }, []);

  const handlePublish = async () => {
    setSaving(true);
    await fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content)
    });
    setSaving(false);
    alert("Live site synchronized successfully!");
  };

  const handleDownloadBackup = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `masterContent_backup_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content) return <div style={{ padding: "2rem" }}>Loading Dashboard...</div>;

  return (
    <div className={styles.adminLayout}>
      <header className={styles.actionCenter}>
        <h2>TWESHA - Control Panel</h2>
        <div className={styles.actions}>
          <button onClick={handleDownloadBackup} className={styles.btnSecondary}>
            Download JSON Backup
          </button>
          <button onClick={handlePublish} className={styles.btnPrimary} disabled={saving}>
            {saving ? "Publishing..." : "Publish Changes & Sync Live Site"}
          </button>
        </div>
      </header>

      <div className={styles.tabsContainer}>
        <div className={styles.tabList}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'catalog' ? styles.active : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            Tab A: Catalog Manager
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'enquiries' ? styles.active : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            Tab B: Enquiries Inbox
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'media' ? styles.active : ''}`}
            onClick={() => setActiveTab('media')}
          >
            Tab C: Corporate Media
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'quotes' ? styles.active : ''}`}
            onClick={() => setActiveTab('quotes')}
          >
            Tab D: Quote Requests
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'catalog' && (
            <CatalogManager content={content} setContent={setContent} />
          )}
          {activeTab === 'enquiries' && (
            <EnquiriesInbox enquiries={enquiries} />
          )}
          {activeTab === 'media' && (
            <CorporateMedia content={content} setContent={setContent} />
          )}
          {activeTab === 'quotes' && (
            <GlobalQuotesInbox quotes={quotes} />
          )}
        </div>
      </div>
    </div>
  );
}
