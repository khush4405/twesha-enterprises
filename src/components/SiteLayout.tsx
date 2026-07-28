"use client";

import { usePathname } from "next/navigation";
import EliteHeader from "./EliteHeader";
import Footer from "./Footer";
import masterContentData from "@/data/masterContent.json";

const masterContent = masterContentData as any;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Do not render Header and Footer on Admin routes
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!isAdmin && <EliteHeader categories={masterContent.categories || []} />}
      
      {/* Main content area */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {!isAdmin && <Footer categories={masterContent.categories || []} />}
    </div>
  );
}
