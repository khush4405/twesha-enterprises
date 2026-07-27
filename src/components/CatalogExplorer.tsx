"use client";

import { useState } from "react";
import { 
  Cpu, 
  Zap, 
  Activity, 
  Gauge, 
  Sliders, 
  ShieldAlert, 
  BatteryCharging, 
  Network, 
  Microscope, 
  Wrench,
  Search,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react";
import styles from "./CatalogExplorer.module.css";
import GlobalQuoteModal from "./GlobalQuoteModal";

interface ProductCategory {
  id: string;
  title: string;
  categoryCode: string;
  description: string;
  icon: any;
  itemsCount: number;
  featuredSpecs: string[];
  gradient: string;
}

export default function CatalogExplorer({ data = [] }: { data?: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalProduct, setActiveModalProduct] = useState<ProductCategory | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  const categoriesList: ProductCategory[] = [
    {
      id: "automation",
      title: "Industrial Automation",
      categoryCode: "CAT-AUT-01",
      description: "Programmable Logic Controllers (PLCs), SCADA systems, VFD drives, & servo motion controllers.",
      icon: Cpu,
      itemsCount: 120,
      featuredSpecs: ["Modbus/Profinet", "IEC 61131-3", "24V DC / 400V AC"],
      gradient: "linear-gradient(135deg, rgba(21, 101, 255, 0.2) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "electrical",
      title: "Electrical Components",
      categoryCode: "CAT-ELE-02",
      description: "Heavy-duty contactors, circuit breakers, relays, terminal blocks, & industrial fuses.",
      icon: Zap,
      itemsCount: 185,
      featuredSpecs: ["DIN-Rail Mounted", "Up to 1000V AC/DC", "UL/CE Compliant"],
      gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "sensors",
      title: "Sensors & Detectors",
      categoryCode: "CAT-SEN-03",
      description: "Inductive proximity, photoelectric, ultrasonic, laser displacement, & vibration sensors.",
      icon: Activity,
      itemsCount: 95,
      featuredSpecs: ["IP67/IP69K Rated", "IO-Link Enabled", "High Frequency"],
      gradient: "linear-gradient(135deg, rgba(21, 101, 255, 0.2) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "instruments",
      title: "Process Instruments",
      categoryCode: "CAT-INS-04",
      description: "Magmeter flow meters, pressure transmitters, RTD temperature probes, & level switches.",
      icon: Gauge,
      itemsCount: 80,
      featuredSpecs: ["4-20mA HART Output", "Ex-d Explosion Proof", "Stainless 316L"],
      gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "control-panels",
      title: "Control Panels",
      categoryCode: "CAT-PNL-05",
      description: "Custom MCC panels, PLC control enclosures, distribution boards, & HMI touch units.",
      icon: Sliders,
      itemsCount: 45,
      featuredSpecs: ["NEMA 4X Outdoor", "Thermal Management", "Custom Wiring"],
      gradient: "linear-gradient(135deg, rgba(21, 101, 255, 0.2) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "safety",
      title: "Industrial Safety",
      categoryCode: "CAT-SAF-06",
      description: "Safety light curtains, emergency stop modules, interlock switches, & explosion-proof gear.",
      icon: ShieldAlert,
      itemsCount: 60,
      featuredSpecs: ["SIL3 / PLe Rated", "Category 4 Safety", "Dual Channel"],
      gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "power",
      title: "Power Supplies",
      categoryCode: "CAT-PWR-07",
      description: "Industrial DIN-rail SMPS, online UPS systems, isolation transformers, & power conditioners.",
      icon: BatteryCharging,
      itemsCount: 110,
      featuredSpecs: ["95% Efficiency", "PFC Active", "Overload Protection"],
      gradient: "linear-gradient(135deg, rgba(21, 101, 255, 0.2) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "networking",
      title: "Networking Equipment",
      categoryCode: "CAT-NET-08",
      description: "Managed industrial Ethernet switches, wireless APs, cellular gateways, & fiber converters.",
      icon: Network,
      itemsCount: 70,
      featuredSpecs: ["Gigabit Fiber SFP", "Wide Temp -40°C~75°C", "Ring Redundancy"],
      gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "testing",
      title: "Testing Instruments",
      categoryCode: "CAT-TST-09",
      description: "Digital multimeters, insulation testers, power quality analyzers, & signal calibrators.",
      icon: Microscope,
      itemsCount: 50,
      featuredSpecs: ["CAT IV 600V Safety", "NIST Traceable", "True RMS"],
      gradient: "linear-gradient(135deg, rgba(21, 101, 255, 0.2) 0%, rgba(8, 19, 32, 0.4) 100%)"
    },
    {
      id: "engineering",
      title: "Engineering Solutions",
      categoryCode: "CAT-ENG-10",
      description: "Turnkey industrial procurement, reverse engineering, custom fabrication, & global sourcing.",
      icon: Wrench,
      itemsCount: 40,
      featuredSpecs: ["Custom Sourcing", "OEM Spec Matching", "On-Site Audit"],
      gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(8, 19, 32, 0.4) 100%)"
    }
  ];

  const filteredCategories = categoriesList.filter(cat => {
    const matchesSearch = cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cat.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <section id="products" className={styles.productsSection}>
      <div className={styles.container}>
        
        {/* Section Title */}
        <div className={styles.headerBlock}>
          <div className={styles.badge}>
            <Filter size={14} className={styles.goldIcon} />
            <span>International Catalog</span>
          </div>
          <h2 className={styles.title}>
            Industrial Sourcing & <br />
            <span className="blue-gradient-text">Engineering Supply Portfolio</span>
          </h2>
          <p className={styles.subtitle}>
            Explore our Fortune 500 grade catalog of industrial products, process instruments, 
            and certified electrical components available for worldwide export.
          </p>
        </div>

        {/* Search & Filter Control Bar */}
        <div className={`${styles.controlBar} glass-card`}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search by product name, specification, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.totalBadge}>
            <span>Showing {filteredCategories.length} Categories</span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className={styles.grid}>
          {filteredCategories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div 
                key={cat.id} 
                className={`${styles.productCard} glass-card glass-card-hover`}
                onClick={() => setActiveModalProduct(cat)}
              >
                {/* Top Lighting bar */}
                <div className={styles.topLight}></div>

                <div className={styles.cardHeader}>
                  <div className={styles.iconFrame}>
                    <IconComponent size={28} className={styles.cardIcon} />
                  </div>
                  <span className={styles.categoryCode}>{cat.categoryCode}</span>
                </div>

                <h3 className={styles.cardTitle}>{cat.title}</h3>
                <p className={styles.cardDesc}>{cat.description}</p>

                {/* Specs Pill List */}
                <div className={styles.specsContainer}>
                  {cat.featuredSpecs.map((spec, i) => (
                    <span key={i} className={styles.specPill}>{spec}</span>
                  ))}
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.itemCount}>{cat.itemsCount}+ Verified SKUs</span>
                  <button className={styles.exploreLink}>
                    <span>Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Product Category Detail Modal */}
      {activeModalProduct && (
        <div className={styles.modalOverlay} onClick={() => setActiveModalProduct(null)}>
          <div className={`${styles.modalCard} glass-card`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <span className={styles.modalCode}>{activeModalProduct.categoryCode}</span>
                <h3 className={styles.modalTitle}>{activeModalProduct.title}</h3>
              </div>
              <button className={styles.closeBtn} onClick={() => setActiveModalProduct(null)}>✕</button>
            </div>

            <p className={styles.modalDesc}>{activeModalProduct.description}</p>

            <div className={styles.modalSection}>
              <h4 className={styles.modalSectionTitle}>Technical Specifications</h4>
              <div className={styles.modalSpecsGrid}>
                {activeModalProduct.featuredSpecs.map((spec, idx) => (
                  <div key={idx} className={styles.modalSpecItem}>
                    <CheckCircle2 size={16} className={styles.goldIcon} />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button 
                className="btn-gold" 
                onClick={() => {
                  setActiveModalProduct(null);
                  setIsQuoteOpen(true);
                }}
              >
                <span>Request Sourcing Quote</span>
                <ArrowRight size={16} />
              </button>
              <button className="btn-glass" onClick={() => setActiveModalProduct(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <GlobalQuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </section>
  );
}
