"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import styles from "./EliteHeader.module.css";
import GlobalQuoteModal from "./GlobalQuoteModal";

interface Category {
  id: string;
  title: string;
  slug: string;
}

export default function EliteHeader({ categories = [] }: { categories?: Category[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Products", href: "#products", isDropdown: true },
    { label: "Industries", href: "#why-choose-us" },
    { label: "Global Trade", href: "#global-presence" },
    { label: "Certifications", href: "#certifications" },
    { label: "Contact", href: "#footer" },
  ];

  return (
    <>
      <header className={`${styles.headerWrapper} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.navBar}>
          {/* Brand Logo */}
          <Link href="/" className={styles.logoContainer}>
            <div className={styles.logoGlow}></div>
            <img 
              src="/twesha logo 2.png" 
              alt="Twesha Enterprises - Premium Industrial Import & Export" 
              className={styles.logoImage} 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className={styles.desktopNav}>
            {navItems.map((item) => (
              <div 
                key={item.label} 
                className={styles.navItemWrapper}
                onMouseEnter={() => item.isDropdown && setProductsDropdownOpen(true)}
                onMouseLeave={() => item.isDropdown && setProductsDropdownOpen(false)}
              >
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                  {item.isDropdown && <span className={styles.chevron}>▾</span>}
                </a>

                {/* Glass Dropdown for Products */}
                {item.isDropdown && (
                  <div className={`${styles.dropdownMenu} ${productsDropdownOpen ? styles.dropdownActive : ""}`}>
                    <div className={styles.dropdownHeader}>
                      <Globe size={16} className={styles.goldIcon} />
                      <span>Industrial Categories</span>
                    </div>
                    <div className={styles.dropdownGrid}>
                      <a href="#products" className={styles.dropdownItem}>
                        <span className={styles.itemTitle}>Automation & Control</span>
                        <span className={styles.itemSub}>PLC, SCADA, Drives</span>
                      </a>
                      <a href="#products" className={styles.dropdownItem}>
                        <span className={styles.itemTitle}>Sensors & Instrumentation</span>
                        <span className={styles.itemSub}>Flow, Temp, Pressure</span>
                      </a>
                      <a href="#products" className={styles.dropdownItem}>
                        <span className={styles.itemTitle}>Electrical Components</span>
                        <span className={styles.itemSub}>Switchgear, Relays</span>
                      </a>
                      <a href="#products" className={styles.dropdownItem}>
                        <span className={styles.itemTitle}>Power Supplies</span>
                        <span className={styles.itemSub}>Transformers, Inverters</span>
                      </a>
                    </div>
                    <a href="#products" className={styles.dropdownFooter}>
                      View All 10 Categories <ArrowRight size={14} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button 
              className={styles.quoteBtn} 
              onClick={() => setIsModalOpen(true)}
            >
              <span>Request Quote</span>
              <ArrowRight size={16} />
            </button>

            <button 
              className={styles.mobileToggle}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className={styles.mobileDrawer}>
            <div className={styles.mobileNavLinks}>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <button 
                className={styles.mobileQuoteBtn} 
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsModalOpen(true);
                }}
              >
                Request Quote
              </button>
            </div>
          </div>
        )}
      </header>

      <GlobalQuoteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
