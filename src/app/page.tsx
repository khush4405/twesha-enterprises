import fs from "fs";
import path from "path";
import HeroSection from "@/components/HeroSection";
import AboutTwesha from "@/components/AboutTwesha";
import CatalogExplorer from "@/components/CatalogExplorer";
import WhyChooseUs from "@/components/WhyChooseUs";
import GlobalPresenceMap from "@/components/GlobalPresenceMap";
import WorkflowTimeline from "@/components/WorkflowTimeline";
import CorporateTestimonials from "@/components/CorporateTestimonials";
import CertificationsSection from "@/components/CertificationsSection";
import CtaBanner from "@/components/CtaBanner";

export const dynamic = 'force-dynamic';

export default function Home() {
  const dataPath = path.join(process.cwd(), "src", "data", "masterContent.json");
  let masterContent: any = { categories: [] };
  try {
    masterContent = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch (e) {
    console.error("Failed to read masterContent.json", e);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-navy-dark)", color: "var(--text-white)" }}>
      {/* 2. Fullscreen Hero Section */}
      <HeroSection />

      {/* 3. About Twesha Section */}
      <AboutTwesha />

      {/* 4. Products Grid */}
      <CatalogExplorer data={masterContent.categories} />

      {/* 5. Why Choose Us (Neumorphic Cards) */}
      <WhyChooseUs />

      {/* 6. Global Presence (Interactive World Map & Trade Corridors) */}
      <GlobalPresenceMap />

      {/* 7. Workflow Timeline */}
      <WorkflowTimeline />

      {/* 8. Corporate Testimonials Carousel */}
      <CorporateTestimonials />

      {/* 9. Luxury Certifications */}
      <CertificationsSection data={masterContent.certificates || []} />

      {/* 10. CTA Banner */}
      <CtaBanner />
    </div>
  );
}
