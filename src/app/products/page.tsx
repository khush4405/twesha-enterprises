import fs from "fs";
import path from "path";
import ProductsHero from "@/components/catalog/ProductsHero";
import CategoryGrid from "@/components/CategoryGrid";
import styles from "@/components/catalog/ProductUI.module.css";

// Read the CMS data at request time so admin edits appear without a rebuild.
export const dynamic = "force-dynamic";

function loadMasterContent(): any {
  try {
    const p = path.join(process.cwd(), "src", "data", "masterContent.json");
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch (e) {
    console.error("Failed to read masterContent.json", e);
    return { categories: [] };
  }
}

export default function ProductsHomePage() {
  const masterContent = loadMasterContent();
  const categories = masterContent.categories || [];

  return (
    <div style={{ background: "var(--bg-navy-dark)", minHeight: "100vh", paddingBottom: "4rem" }}>
      <ProductsHero 
        title="Engineering Supply Portfolio" 
        breadcrumbs={[{ title: "Products", url: "/products" }]} 
      />

      <div className={styles.container} style={{ marginTop: "4rem" }}>
        <CategoryGrid items={categories} basePath="/products" />
      </div>
    </div>
  );
}
