"use client";

import { useState } from 'react';
import { X, Send, ShieldCheck, FileCheck2, Globe2 } from 'lucide-react';
import styles from './GlobalQuoteModal.module.css';

interface GlobalQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalQuoteModal({ isOpen, onClose }: GlobalQuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    category: 'Automation & Control',
    requirements: '',
    volume: '$20,000 - $50,000'
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate submission delay or POST request
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        country: '',
        category: 'Automation & Control',
        requirements: '',
        volume: '$20,000 - $50,000'
      });
      setTimeout(() => {
        setStatus('idle');
        onClose();
      }, 3500);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} glass-card glass-card-gold`} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.goldBadge}>
              <Globe2 size={14} className={styles.goldIcon} />
              <span>International Trade Desk</span>
            </div>
            <h2 className={styles.title}>Request Sourcing Quote</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close Modal">
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {status === 'success' ? (
            <div className={styles.successState}>
              <div className={styles.successIconCircle}>
                <FileCheck2 size={36} className={styles.goldIcon} />
              </div>
              <h3 className={styles.successTitle}>Trade Inquiry Received</h3>
              <p className={styles.successDesc}>
                Thank you. Our international procurement team will review your specifications 
                and issue a formal pro-forma quotation within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.formDesc}>
                Fill in your project requirements below to receive direct OEM factory pricing and export freight schedules.
              </p>
              
              <div className={styles.formGrid}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Full Name *</label>
                  <input 
                    required 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g. Alexander Wright" 
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Corporate Email *</label>
                  <input 
                    required 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="a.wright@enterprise.com" 
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Company Name *</label>
                  <input 
                    required
                    name="company" 
                    value={formData.company} 
                    onChange={handleChange} 
                    placeholder="e.g. Apex Industrial GmbH" 
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Destination Country *</label>
                  <input 
                    required
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    placeholder="e.g. Germany, UAE, USA" 
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Product Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={styles.select}>
                    <option value="Automation & Control">Industrial Automation & PLCs</option>
                    <option value="Electrical Components">Electrical Components & Switchgear</option>
                    <option value="Sensors & Detectors">Sensors & Detectors</option>
                    <option value="Process Instruments">Process Instrumentation</option>
                    <option value="Control Panels">Custom Control Panels</option>
                    <option value="Industrial Safety">Industrial Safety Gear</option>
                    <option value="Power Supplies">Power Supplies & SMPS</option>
                    <option value="Engineering Sourcing">Turnkey Engineering Sourcing</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Estimated Order Volume</label>
                  <select name="volume" value={formData.volume} onChange={handleChange} className={styles.select}>
                    <option value="Under $10k">Under $10,000</option>
                    <option value="$10k - $50k">$10,000 - $50,000</option>
                    <option value="$50k - $200k">$50,000 - $200,000</option>
                    <option value="$200k+">$200,000+ (Bulk Container)</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroupFull}>
                <label className={styles.label}>Product Specifications / Bill of Materials *</label>
                <textarea 
                  required 
                  name="requirements" 
                  value={formData.requirements} 
                  onChange={handleChange} 
                  rows={3} 
                  placeholder="Specify part numbers, voltage ratings, sensor models, required delivery timeframe..."
                  className={styles.textarea}
                />
              </div>

              <div className={styles.footerRow}>
                <div className={styles.securityNote}>
                  <ShieldCheck size={16} className={styles.goldIcon} />
                  <span>ISO 9001 Encrypted & NDA Protected</span>
                </div>

                <button type="submit" className="btn-gold" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Processing Request...' : (
                    <><span>Submit Quote Inquiry</span> <Send size={16} /></>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
