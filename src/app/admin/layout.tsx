import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Topbar />
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
