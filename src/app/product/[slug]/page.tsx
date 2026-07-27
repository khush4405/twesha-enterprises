import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import EliteHeader from "@/components/EliteHeader";
import QuickTradeInquiry from "@/components/QuickTradeInquiry";
import Footer from "@/components/Footer";
import styles from "./ProductDetail.module.css";
import Link from "next/link";

export const dynamic = 'force-dynamic';

function findProductBySlug(items: any[], slug: string): any {
  for (const item of items) {
    if (item.type === "product" && item.slug === slug) {
      return item;
    }
    if (item.children && Array.isArray(item.children)) {
      const found = findProductBySlug(item.children, slug);
      if (found) return found;
    }
  }
  return null;
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  const dataPath = path.join(process.cwd(), "src", "data", "masterContent.json");
  const masterContent = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  const product = findProductBySlug(masterContent.categories, slug);

  if (!product) {
    notFound();
  }

  const validImages = product.images ? product.images.filter((img: string) => img && img.trim() !== "") : [];

  return (
    <main className={styles.main}>
      <EliteHeader categories={masterContent.categories} />
      <div className={styles.headerSpacer}></div>

      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link> &gt; <span>{product.title}</span>
        </div>

        <div className={styles.layout}>
          {/* Main Product Content */}
          <div className={styles.productContent}>
            <h1 className={styles.title}>{product.title}</h1>
            
            <div className={styles.gallery}>
              {validImages.length > 0 ? (
                validImages.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`${product.title} - Image ${idx + 1}`} className={styles.image} />
                ))
              ) : (
                <div className={styles.noImage}>No image available</div>
              )}
            </div>

            <div className={styles.section}>
              <h2>Description</h2>
              <p>{product.description}</p>
            </div>

            <div className={styles.section}>
              <h2>Specifications & Packaging</h2>
              <table className={styles.specTable}>
                <tbody>
                  {product.specs && product.specs.map((spec: any, idx: number) => (
                    <tr key={idx}>
                      <th>{spec.label}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {product.attachment && (
              <div className={styles.section}>
                <h2>Documents</h2>
                <a href={product.attachment} target="_blank" className="btn-gold" style={{ display: 'inline-block' }}>
                  Download Technical Specifications (PDF)
                </a>
              </div>
            )}
          </div>

          {/* Lateral Inquiry Panel */}
          <aside className={styles.sidebar}>
            <QuickTradeInquiry productSku={product.slug} productName={product.title} />
          </aside>
        </div>
      </div>
      
      <Footer categories={masterContent.categories} />
    </main>
  );
}
