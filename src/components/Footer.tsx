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
  Share2,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import styles from "./Footer.module.css";

import Link from "next/link";

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
                <a href="https://wa.me/919426129718" target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
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
                <li><a href="#hero">Home</a></li>
                <li><a href="#about">About Twesha</a></li>
                <li><a href="#products">Industrial Products</a></li>
                <li><a href="#why-choose-us">Why Choose Us</a></li>
                <li><a href="#global-presence">Global Trade Map</a></li>
                <li><Link href="/certificates">Certifications</Link></li>
                <li><Link href="/videos">Videos</Link></li>
              </ul>
            </div>

            {/* Col 2: Services */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Core Services</h4>
              <ul className={styles.linkList}>
                <li><a href="#products">Global OEM Sourcing</a></li>
                <li><a href="#about">Pre-Shipment QA Inspection</a></li>
                <li><a href="#global-presence">Customs Clearance & Tariff</a></li>
                <li><a href="#products">Custom Control Panel Fabrication</a></li>
                <li><a href="#global-presence">FCL & LCL Ocean Freight</a></li>
                <li><a href="#hero">Emergency Air Cargo Dispatch</a></li>
              </ul>
            </div>

            {/* Col 3: Industries */}
            <div className={styles.linkGroup}>
              <h4 className={styles.linkGroupTitle}>Industries Served</h4>
              <ul className={styles.linkList}>
                <li><a href="#products">Robotics & Factory Automation</a></li>
                <li><a href="#products">Oil & Gas / Chemical Process</a></li>
                <li><a href="#products">Power Generation & Transmission</a></li>
                <li><a href="#products">Heavy Machine Manufacturing</a></li>
                <li><a href="#products">Pharmaceutical & Clean Room</a></li>
                <li><a href="#products">Automotive & Semiconductor</a></li>
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
                  <span>trade@tweshaenterprises.com</span>
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
              <a href="#" aria-label="LinkedIn" className={styles.socialGlassBtn}>
                <Share2 size={16} />
              </a>
              <a href="#" aria-label="Global Portal" className={styles.socialGlassBtn}>
                <Globe size={16} />
              </a>
              <a href="#" aria-label="Inquiry Desk" className={styles.socialGlassBtn}>
                <MessageSquare size={16} />
              </a>
              <a href="mailto:trade@tweshaenterprises.com" aria-label="Email" className={styles.socialGlassBtn}>
                <Mail size={16} />
              </a>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
