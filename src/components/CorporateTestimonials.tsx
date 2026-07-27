"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Building } from "lucide-react";
import styles from "./CorporateTestimonials.module.css";

interface Testimonial {
  id: number;
  clientName: string;
  role: string;
  company: string;
  country: string;
  quote: string;
  rating: number;
  category: string;
}

export default function CorporateTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      clientName: "Marcus Vance",
      role: "VP of Global Supply Chain",
      company: "Apex Industrial Automation GmbH",
      country: "Frankfurt, Germany",
      quote: "Twesha Enterprises has consistently delivered precision PLC systems and high-voltage electrical components for our European plants. Their zero-defect QA audit and on-time maritime logistics have saved us hundreds of operational hours.",
      rating: 5,
      category: "Industrial Automation"
    },
    {
      id: 2,
      clientName: "Siddharth Mehta",
      role: "Chief Procurement Officer",
      company: "Gulf Energy & Power Solutions",
      country: "Dubai, UAE",
      quote: "In the Middle East oil and gas sector, reliability is paramount. Twesha’s international sourcing team matched exact OEM specifications for our explosion-proof pressure sensors and process instruments with total compliance.",
      rating: 5,
      category: "Process Instrumentation"
    },
    {
      id: 3,
      clientName: "Elena Rostova",
      role: "Director of International Trade",
      company: "Vanguard Robotics Corp",
      country: "Singapore",
      quote: "Working with Twesha Enterprises gave us direct access to certified factory pricing without compromising quality. Their customs documentation and air freight speed are unmatched in the APAC region.",
      rating: 5,
      category: "Robotics & Controls"
    }
  ];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.badge}>
            <Building size={14} className={styles.goldIcon} />
            <span>Corporate Endorsements</span>
          </div>
          <h2 className={styles.title}>
            Trusted By International <br />
            <span className="blue-gradient-text">Industrial Decision Makers</span>
          </h2>
          <p className={styles.subtitle}>
            Discover how Twesha Enterprises powers global supply chains for enterprise industrial clients across six continents.
          </p>
        </div>

        {/* Carousel Container */}
        <div className={`${styles.carouselCard} glass-card glass-card-gold`}>
          
          {/* Background Watermark Quote Icon */}
          <div className={styles.quoteWatermark}>“</div>

          <div className={styles.cardContent}>
            
            {/* Top Stars & Category */}
            <div className={styles.topRow}>
              <div className={styles.stars}>
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="#D4AF37" color="#D4AF37" />
                ))}
              </div>
              <span className={styles.categoryBadge}>{current.category}</span>
            </div>

            {/* Quote Body */}
            <p className={styles.quoteText}>"{current.quote}"</p>

            {/* Author Footer */}
            <div className={styles.authorRow}>
              <div className={styles.authorInfo}>
                <h4 className={styles.authorName}>{current.clientName}</h4>
                <p className={styles.authorRole}>{current.role}</p>
                <span className={styles.companyName}>{current.company} — <span className={styles.countryText}>{current.country}</span></span>
              </div>

              {/* Navigation Arrows */}
              <div className={styles.navControls}>
                <button className={styles.arrowBtn} onClick={prevSlide} aria-label="Previous Testimonial">
                  <ChevronLeft size={20} />
                </button>
                <span className={styles.counterText}>{currentIndex + 1} / {testimonials.length}</span>
                <button className={styles.arrowBtn} onClick={nextSlide} aria-label="Next Testimonial">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
