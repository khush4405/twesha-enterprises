"use client";

import { Bell, User, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./AdminLayout.module.css";

export default function Topbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button className={styles.menuBtn}>
          <Menu size={20} />
        </button>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
          CMS / Dashboard
        </span>
      </div>
      
      <div className={styles.topbarRight}>
        <button 
          id="topbar-sync-btn"
          className={styles.publishBadge}
          style={{ cursor: "pointer", border: "1px solid rgba(212, 175, 55, 0.4)", background: "rgba(212, 175, 55, 0.1)" }}
          onClick={async () => {
            const btn = document.getElementById("topbar-sync-btn");
            if (btn) btn.innerHTML = "Syncing...";
            try {
              const res = await fetch("/api/git/sync", { method: "POST" });
              if (res.ok) {
                if (btn) btn.innerHTML = '<div class="' + styles.dot + '" style="background:#10B981;box-shadow:0 0 8px #10B981;"></div>Synced!';
                setTimeout(() => { if (btn) btn.innerHTML = '<div class="' + styles.dot + '"></div>Unsaved Changes'; }, 2000);
              } else {
                if (btn) btn.innerHTML = "Sync Failed";
                setTimeout(() => { if (btn) btn.innerHTML = '<div class="' + styles.dot + '"></div>Unsaved Changes'; }, 2000);
              }
            } catch (e) {
              if (btn) btn.innerHTML = "Sync Failed";
              setTimeout(() => { if (btn) btn.innerHTML = '<div class="' + styles.dot + '"></div>Unsaved Changes'; }, 2000);
            }
          }}
        >
          <div className={styles.dot}></div>
          Unsaved Changes
        </button>
        
        <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer" }}>
          <Bell size={20} />
        </button>
        
        <div style={{ height: "24px", width: "1px", background: "rgba(255,255,255,0.1)" }}></div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ 
            height: "32px", 
            width: "32px", 
            borderRadius: "50%", 
            background: "rgba(21, 101, 255, 0.2)", 
            border: "1px solid rgba(21, 101, 255, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#60A5FA"
          }}>
            <User size={16} />
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
