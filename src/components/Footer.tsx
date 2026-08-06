"use client";

import { useState } from "react";
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import styles from "./Footer.module.css";

import Link from "next/link";

/**
 * Company LinkedIn page. Paste the full URL here, e.g.
 *   "https://www.linkedin.com/company/twesha-enterprise/"
 * While this is empty the icon is hidden, so the footer never shows a dead link.
 */
const LINKEDIN_URL = "https://www.linkedin.com/company/twesha-enterprise/";

const WHATSAPP_NUMBER = "919426129718";

/** lucide v1 removed brand marks, so the LinkedIn glyph is inlined. */
function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

export default function Footer({ categories = [] }: { categories?: any[] }) {
  return (
    <footer id="footer" className={styles.footer}>
      
      {/* Upper Footer: Logo & Newsletter */}
      <div className={styles.topSection}>
        <div className={styles.container}>
          <div className={styles.topGrid}>
            
            {/* Brand Information */}
            <div className={styles.brandCol}>
              <div className={styles.logoWrapper}>
                <img 
                  src="/Twesha EnterPrize logo new.webp" 
                  alt="Twesha Enterprise - Premium Industrial Import Export" 
                  className={styles.footerLogo} 
                />
              </div>
              <p className={styles.brandDesc}>
                Twesha Enterprise is an international industrial import-export powerhouse, 
                connecting global engineering manufacturers with high-growth markets worldwide.
              </p>
              <div className={styles.certBadge}>
                <ShieldCheck size={16} className={styles.goldIcon} />
                <span>ISO 9001:2015 Accredited Exporter</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className={styles.ctaCol}>
              <h3 className={styles.ctaTitle}>
                Ready to Discuss Your <span className={styles.highlightGold}>Instrumentation</span> Needs?
              </h3>
              <p className={styles.ctaSub}>
                Get expert consultation and custom quotes for your process control requirements.
              </p>

              <div className={styles.ctaButtons}>
                <Link href="/contact" className={styles.btnPrimary}>
                  Get a Quote
                </Link>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
                  WhatsApp Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className={styles.linksSection}>
        <div className={styles.container}>
          <div className={styles.linksGrid}>
            
            {/* Col 1: Quick Links */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Quick Links</h4>
              <ul className={styles.linkList}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/#about">About Twesha</Link></li>
                <li><Link href="/products">Industrial Products</Link></li>
                <li><Link href="/#why-choose-us">Why Choose Us</Link></li>
                <li><Link href="/#global-presence">Global Trade Map</Link></li>
                <li><Link href="/certificates">Certifications</Link></li>
                <li><Link href="/videos">Videos</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Col 2: Services */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Core Services</h4>
              <ul className={styles.linkList}>
                <li><Link href="/products">Global OEM Sourcing</Link></li>
                <li><Link href="/certificates">Pre-Shipment QA Inspection</Link></li>
                <li><Link href="/#global-presence">Customs Clearance &amp; Tariff</Link></li>
                <li><Link href="/products/instrumentation-products/automation-products">Custom Control Panel Fabrication</Link></li>
                <li><Link href="/#global-presence">FCL &amp; LCL Ocean Freight</Link></li>
                <li><Link href="/contact">Emergency Air Cargo Dispatch</Link></li>
              </ul>
            </div>

            {/* Col 3: Industries */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Industries Served</h4>
              <ul className={styles.linkList}>
                <li><Link href="/products/instrumentation-products/automation-products">Robotics &amp; Factory Automation</Link></li>
                <li><Link href="/products/engineering-products/valves">Oil &amp; Gas / Chemical Process</Link></li>
                <li><Link href="/products/instrumentation-products/heating-solution-and-temperature-measurement">Power Generation &amp; Transmission</Link></li>
                <li><Link href="/products/engineering-products/hose-pipes">Heavy Machine Manufacturing</Link></li>
                <li><Link href="/products/instrumentation-products/analytical-instruments-and-pneumatic-products">Pharmaceutical &amp; Clean Room</Link></li>
                <li><Link href="/products/instrumentation-products/flow-measurement">Automotive &amp; Semiconductor</Link></li>
              </ul>
            </div>

            {/* Col 4: Corporate Contact */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Global Headquarters</h4>
              <div className={styles.contactDetails}>
                <div className={styles.contactItem}>
                  <MapPin size={18} className={styles.goldIcon} />
                  <span>Twesha Enterprise, 06 Sanskruti Cottage Society, Near Arti Colony, Opp. Pashupatinath Temple, GIDC Ankleshwar, Gujarat 393002, India</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={18} className={styles.blueIcon} />
                  <span>+91 94261 29718 / +91 98255 31123</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={18} className={styles.goldIcon} />
                  <span>info@tweshaenterprise.com</span>
                </div>
                <div className={styles.contactItem}>
                  <Clock size={18} className={styles.blueIcon} />
                  <span>Mon - Sat: 09:00 - 19:00 IST (UTC +5:30)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Glass Social Icons */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <div className={styles.bottomFlex}>
            
            <div className={styles.copyright}>
              © {new Date().getFullYear()} Twesha Enterprise. All Rights Reserved. Designed for Global Trade Leadership.
            </div>

            {/* Glass Social Buttons */}
            <div className={styles.socialButtons}>
              {LINKEDIN_URL && (
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twesha Enterprise on LinkedIn"
                  title="LinkedIn"
                  className={styles.socialGlassBtn}
                >
                  <LinkedInIcon size={16} />
                </a>
              )}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us on +91 94261 29718"
                title="WhatsApp +91 94261 29718"
                className={styles.socialGlassBtn}
              >
                <MessageSquare size={16} />
              </a>
              <a href="tel:+919426129718" aria-label="Call us" title="Call" className={styles.socialGlassBtn}>
                <Phone size={16} />
              </a>
              <a href="mailto:info@tweshaenterprise.com" aria-label="Email us" title="Email" className={styles.socialGlassBtn}>
                <Mail size={16} />
              </a>
              <Link href="/contact" aria-label="Contact page" title="Contact" className={styles.socialGlassBtn}>
                <Globe size={16} />
              </Link>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
