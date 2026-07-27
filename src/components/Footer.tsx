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

export default function Footer({ categories = [] }: { categories?: any[] }) {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
    }
  };

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
                  src="/Twesha EnterPrize logo.png" 
                  alt="Twesha Enterprises - Premium Industrial Import Export" 
                  className={styles.footerLogo} 
                />
              </div>
              <p className={styles.brandDesc}>
                Twesha Enterprises is an international industrial import-export powerhouse, 
                connecting global engineering manufacturers with high-growth markets worldwide.
              </p>
              <div className={styles.certBadge}>
                <ShieldCheck size={16} className={styles.goldIcon} />
                <span>ISO 9001:2015 Accredited Exporter</span>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className={styles.newsletterCol}>
              <h3 className={styles.colTitle}>Subscribe to Global Trade Insights</h3>
              <p className={styles.colSub}>
                Receive monthly updates on industrial tariff changes, OEM sourcing trends, and international logistics reports.
              </p>

              {subscribed ? (
                <div className={styles.subSuccess}>
                  ✓ Thank you! You've been subscribed to Twesha Trade Briefing.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
                  <div className={styles.glassInputGroup}>
                    <Mail size={18} className={styles.inputIcon} />
                    <input 
                      type="email" 
                      placeholder="Enter corporate email address..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      required
                      className={styles.glassInput}
                    />
                    <button type="submit" className="btn-gold">
                      <span>Subscribe</span>
                      <Send size={14} />
                    </button>
                  </div>
                </form>
              )}
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
                <li><a href="#certifications">Certifications</a></li>
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
                  <span>Twesha Enterprises HQ, Industrial Trade Center, Mumbai, Maharashtra, India</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={18} className={styles.blueIcon} />
                  <span>+91 98765 43210 / +91 22 4567 8900</span>
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
              © {new Date().getFullYear()} Twesha Enterprises. All Rights Reserved. Designed for Global Trade Leadership.
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
