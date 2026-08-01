"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, FileCheck, Video, Home, Info, Phone, MessageSquare, UploadCloud, Settings } from "lucide-react";
import styles from "./AdminLayout.module.css";

const NAV_ITEMS = [
  { group: "Overview" },
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  
  { group: "Content Modules" },
  { name: "Catalog", href: "/admin/catalog", icon: FolderTree },
  { name: "Certificates", href: "/admin/certificates", icon: FileCheck },
  
  { group: "Media Library" },
  { name: "Videos", href: "/admin/videos", icon: Video },
  
  { group: "System" },
  { name: "Publish Center", href: "/admin/publish", icon: UploadCloud },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logoIcon}>T</div>
        Twesha CMS
      </div>
      
      <nav className={styles.sidebarNav}>
        {NAV_ITEMS.map((item, idx) => {
          if (item.group) {
            return (
              <div key={`group-${idx}`} className={styles.navGroup}>
                {item.group}
              </div>
            );
          }
          
          const Icon = item.icon!;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href!));
          
          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className={styles.sidebarFooter}>
        <button 
          onClick={async () => {
            const btn = document.getElementById("sync-btn");
            if (btn) btn.innerText = "Syncing...";
            try {
              const res = await fetch("/api/git/sync", { method: "POST" });
              if (res.ok) {
                if (btn) btn.innerText = "Synced Successfully!";
                setTimeout(() => { if (btn) btn.innerText = "Sync JSON to Live Site"; }, 2000);
              } else {
                if (btn) btn.innerText = "Sync Failed";
                setTimeout(() => { if (btn) btn.innerText = "Sync JSON to Live Site"; }, 2000);
              }
            } catch (e) {
              if (btn) btn.innerText = "Sync Failed";
              setTimeout(() => { if (btn) btn.innerText = "Sync JSON to Live Site"; }, 2000);
            }
          }}
          id="sync-btn"
          className={styles.navLink}
          style={{ justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(212, 175, 55, 0.1)", color: "#D4AF37", width: "100%", cursor: "pointer" }}
        >
          Sync JSON to Live Site
        </button>
      </div>
    </aside>
  );
}
