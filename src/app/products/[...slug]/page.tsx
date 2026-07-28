import masterContentData from "@/data/masterContent.json";
import CategoryGrid from "@/components/CategoryGrid";
import ProductDetail from "@/components/ProductDetail";
import ProductsHero from "@/components/catalog/ProductsHero";
import styles from "@/components/catalog/ProductUI.module.css";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const masterContent = masterContentData as any;

// Helper function to find node by slug path
function findNodeByPath(data: any[], slugs: string[]): any | null {
  let currentLevel = data;
  let targetNode = null;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const found = currentLevel.find((item: any) => item.slug === slug);
    if (!found) return null;
    targetNode = found;
    currentLevel = found.children || [];
  }

  return targetNode;
}

export default async function DynamicProductPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  
  const targetNode = findNodeByPath(masterContent.categories || [], slug || []);

  if (!targetNode) {
    return (
      <div style={{ padding: "100px 0 4rem", textAlign: "center", color: "white", background: "var(--bg-navy-dark)", minHeight: "100vh" }}>
        <h1>Item Not Found</h1>
        <p>The product or category you are looking for does not exist.</p>
        <Link href="/products" style={{ color: "#60A5FA" }}>Return to Catalog</Link>
      </div>
    );
  }

  // Generate breadcrumbs
  const breadcrumbs = [];
  let currentPath = "/products";
  breadcrumbs.push({ title: "Products", url: currentPath });
  
  let curData = masterContent.categories || [];
  for (const s of slug) {
    const found = curData.find((item: any) => item.slug === s);
    if (found) {
      currentPath += `/${s}`;
      breadcrumbs.push({ title: found.title, url: currentPath });
      curData = found.children || [];
    }
  }

  const basePath = `/products/${slug.join('/')}`;

  return (
    <div style={{ background: "var(--bg-navy-dark)", minHeight: "100vh", paddingBottom: "4rem" }}>
      
      {targetNode.type === "category" ? (
        <>
          <ProductsHero 
            title={targetNode.title} 
            description={targetNode.description}
            breadcrumbs={breadcrumbs} 
          />
          <div className={styles.container} style={{ marginTop: "4rem" }}>
            <CategoryGrid items={targetNode.children || []} basePath={basePath} />
          </div>
        </>
      ) : (
        <>
          <ProductsHero 
            title={targetNode.title} 
            description={targetNode.shortDescription}
            breadcrumbs={breadcrumbs} 
          />
          <div className={styles.container} style={{ marginTop: "4rem" }}>
            <ProductDetail product={targetNode} />
          </div>
        </>
      )}
    </div>
  );
}
