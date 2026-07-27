import styles from './IndustriesWeServe.module.css';
import { Pill, Droplet, Waves, Shirt, FlaskConical, Zap } from 'lucide-react';

export default function IndustriesWeServe() {
  const industries = [
    {
      icon: <Pill size={28} />,
      title: "Pharmaceutical",
      description: "Premium materials and components tailored for pharma manufacturing."
    },
    {
      icon: <Droplet size={28} />,
      title: "Oil & Gas",
      description: "Hazardous area rated equipment and materials for refineries."
    },
    {
      icon: <Waves size={28} />,
      title: "Water Treatment",
      description: "Flow, level, and pH analyzers for municipal and industrial water treatment plants."
    },
    {
      icon: <Shirt size={28} />,
      title: "Textiles",
      description: "Temperature, pressure, and flow control for dyeing and finishing processes."
    },
    {
      icon: <FlaskConical size={28} />,
      title: "Chemical",
      description: "Corrosion-resistant components and materials for aggressive chemical environments."
    },
    {
      icon: <Zap size={28} />,
      title: "Power Generation",
      description: "High-temperature materials and specialized equipment for power generation."
    }
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Industries We <span>Serve</span></h2>
          <p>Premium products and materials tailored for the most demanding industrial environments.</p>
        </div>
        
        <div className={styles.grid}>
          {industries.map((ind, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.iconWrapper}>
                {ind.icon}
              </div>
              <h3 className={styles.cardTitle}>{ind.title}</h3>
              <p className={styles.cardDescription}>{ind.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
