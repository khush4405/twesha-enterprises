"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ArrowRight, ShieldCheck, Globe } from "lucide-react";
import styles from "./EliteHeader.module.css";

interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
}

export default function EliteHeader({ categories = [] }: { categories?: Category[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
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
    { label: "Home", href: "/" },
    { label: "About", href: "/#about" },
    { label: "Products", href: "/products", isDropdown: true },
    { label: "Certificates", href: "/#certifications" },
    { label: "Videos", href: "/#videos" },
    { label: "Clients", href: "/#clients" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className={`${styles.headerWrapper} ${isScrolled ? styles.scrolled : ""}`}>
        <div className={styles.navBar}>
          {/* Brand Logo */}
          <Link href="/" className={styles.logoContainer}>
            <img
              src="/twesha-logo-subtle.png"
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
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                  {item.isDropdown && <span className={styles.chevron}>▾</span>}
                </Link>

                {/* Glass Dropdown for Products */}
                {item.isDropdown && (
                  <div className={`${styles.dropdownMenu} ${productsDropdownOpen ? styles.dropdownActive : ""}`}>
                    <div className={styles.dropdownHeader}>
                      <Globe size={16} className={styles.goldIcon} />
                      <span>Industrial Categories</span>
                    </div>
                    <div className={styles.dropdownGrid}>
                      {categories.slice(0, 4).map((cat) => (
                        <Link key={cat.id} href={`/products/${cat.slug}`} className={styles.dropdownItem} onClick={() => setProductsDropdownOpen(false)}>
                          <span className={styles.itemTitle}>{cat.title}</span>
                          <span className={styles.itemSub}>{cat.description ? (cat.description.length > 30 ? cat.description.substring(0, 30) + '...' : cat.description) : 'Explore products'}</span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/products" className={styles.dropdownFooter} onClick={() => setProductsDropdownOpen(false)}>
                      View All {categories.length} Categories <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <Link 
              href="/contact"
              className={styles.quoteBtn} 
              style={{ textDecoration: 'none' }}
            >
              <span>Request Quote</span>
              <ArrowRight size={16} />
            </Link>

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
              <Link 
                href="/contact"
                className={styles.mobileQuoteBtn} 
                onClick={() => setMobileMenuOpen(false)}
                style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}
              >
                Request Quote
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
