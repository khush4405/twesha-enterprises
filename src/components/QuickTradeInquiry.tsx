"use client";

import { useState } from "react";
import styles from "./QuickTradeInquiry.module.css";

export default function QuickTradeInquiry({ productSku, productName }: { productSku: string; productName: string }) {
  const [formData, setFormData] = useState({
    sku: productSku,
    volume: "",
    incoterms: "FOB",
    destination: "",
    packaging: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productName, timestamp: new Date().toISOString(), status: "New" })
      });
      
      if (res.ok) {
        setStatus("success");
        setFormData({ ...formData, volume: "", destination: "", packaging: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className={styles.panel}>
      <h3>Quick Trade Inquiry</h3>
      <p>Request a quote for <strong>{productName}</strong></p>
      
      {status === "success" && (
        <div className={styles.successMsg}>Your inquiry has been submitted successfully. Our team will contact you shortly.</div>
      )}

      {status === "error" && (
        <div className={styles.errorMsg}>Failed to submit inquiry. Please try again.</div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Product SKU</label>
          <input type="text" value={formData.sku} readOnly className={styles.readOnly} />
        </div>

        <div className={styles.formGroup}>
          <label>Order Volume / Quantity *</label>
          <input 
            type="text" 
            required 
            placeholder="e.g., 2x 40ft FCL"
            value={formData.volume}
            onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Target Incoterms *</label>
          <select 
            value={formData.incoterms}
            onChange={(e) => setFormData({ ...formData, incoterms: e.target.value })}
          >
            <option value="EXW">EXW (Ex Works)</option>
            <option value="FCA">FCA (Free Carrier)</option>
            <option value="FOB">FOB (Free On Board)</option>
            <option value="CIF">CIF (Cost, Insurance, and Freight)</option>
            <option value="DDP">DDP (Delivered Duty Paid)</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Destination Port *</label>
          <input 
            type="text" 
            required 
            placeholder="e.g., Port of Rotterdam"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Special Packaging Requirements</label>
          <textarea 
            rows={3} 
            placeholder="Any specific palletizing, shrink wrapping, or labeling needs..."
            value={formData.packaging}
            onChange={(e) => setFormData({ ...formData, packaging: e.target.value })}
          ></textarea>
        </div>

        <button type="submit" className={`btn-gold ${styles.submitBtn}`} disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Submit Quote Request"}
        </button>
      </form>
    </div>
  );
}
