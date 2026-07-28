"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import styles from "./Contact.module.css";
import masterContent from "@/data/masterContent.json";

export default function ContactPage() {
  const content = masterContent as any;
  const contactInfo = content.contactInfo || {
    emails: ["contact@twesha.com"],
    phones: ["+91 9876543210"],
    address: "Global Business Hub, Mumbai, India",
    whatsapp: "+91 9876543210",
    workingHours: "Mon - Sat, 9:00 AM - 6:00 PM"
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName"),
      lastName: "N/A", // using full name in firstName field
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      message: formData.get("message")
    };

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>Contact <span className={styles.highlight}>Us</span></h1>
          <p className={styles.heroSubtitle}>
            Get in touch for quotes, technical support, or any export/import inquiries.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            
            {/* Left Column: Contact Info Cards */}
            <div className={styles.contactInfo}>
              
              <div className={styles.infoCard}>
                <div className={`${styles.iconBox} ${styles.iconBoxGold}`}>
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className={styles.cardTitle}>Call Us</h3>
                  {contactInfo.phones.map((phone: string, i: number) => (
                    <a key={i} href={`tel:${phone}`} className={styles.cardText}>{phone}</a>
                  ))}
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={`${styles.iconBox} ${styles.iconBoxBlue}`}>
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className={styles.cardTitle}>Email Us</h3>
                  {contactInfo.emails.map((email: string, i: number) => (
                    <a key={i} href={`mailto:${email}`} className={styles.cardText}>{email}</a>
                  ))}
                </div>
              </div>

              <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={styles.whatsappCard}>
                <div className={styles.whatsappIconBox}>
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h3 className={styles.whatsappTitle}>WhatsApp Us</h3>
                  <p className={styles.whatsappText}>Quick response guaranteed</p>
                </div>
              </a>

              <div className={styles.infoCard}>
                <div className={styles.iconBox} style={{ background: "rgba(15, 23, 42, 0.05)", color: "#0f172a" }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className={styles.cardTitle}>Visit Us</h3>
                  <p className={styles.cardText} style={{ lineHeight: 1.5 }}>
                    {contactInfo.address}
                  </p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.iconBox} style={{ background: "rgba(15, 23, 42, 0.05)", color: "#0f172a" }}>
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className={styles.cardTitle}>Business Hours</h3>
                  <p className={styles.cardText}>{contactInfo.workingHours}</p>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Form & Map */}
            <div>
              <div className={styles.formSection}>
                <h2 className={styles.formTitle}>Send a Message</h2>
                <p className={styles.formSubtitle}>Fill in the form below and we'll respond within 24 hours.</p>

                <form onSubmit={handleSubmit}>
                  
                  {submitStatus === "success" && (
                    <div style={{ padding: "1rem", background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10B981", borderRadius: "8px", color: "#065F46", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 500 }}>
                      <CheckCircle2 size={20} color="#10B981" />
                      Message sent successfully! We will contact you soon.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div style={{ padding: "1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", borderRadius: "8px", color: "#991B1B", marginBottom: "1.5rem", fontWeight: 500 }}>
                      Something went wrong. Please try emailing us directly.
                    </div>
                  )}

                  <div className={styles.formRow}>
                    <div>
                      <label className={styles.label}>Full Name *</label>
                      <input type="text" name="firstName" required className={styles.input} placeholder="Your name" disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className={styles.label}>Email *</label>
                      <input type="email" name="email" required className={styles.input} placeholder="you@company.com" disabled={isSubmitting} />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div>
                      <label className={styles.label}>Phone *</label>
                      <input type="tel" name="phone" required className={styles.input} placeholder="+91 9876543210" disabled={isSubmitting} />
                    </div>
                    <div>
                      <label className={styles.label}>Company / Location</label>
                      <input type="text" name="company" className={styles.input} placeholder="City, State" disabled={isSubmitting} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Message *</label>
                    <textarea name="message" required className={styles.textarea} placeholder="Tell us about your requirements..." disabled={isSubmitting}></textarea>
                  </div>

                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Map Container */}
              <div className={styles.mapContainer}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609951666!2d72.74109995777421!3d19.08219783856114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1655382218765!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" 
                  title="Twesha Enterprises Location"
                ></iframe>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
