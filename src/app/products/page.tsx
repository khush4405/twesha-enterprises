import ProductsHero from "@/components/catalog/ProductsHero";
import CategoryGrid from "@/components/CategoryGrid";
import styles from "@/components/catalog/ProductUI.module.css";
import masterContent from "@/data/masterContent.json";

export default function ProductsHomePage() {
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
