import { useState } from 'react';
import styles from './Admin.module.css';

export default function GlobalQuotesInbox({ quotes }: { quotes: any[] }) {
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  if (!quotes || quotes.length === 0) {
    return (
      <div className={styles.section}>
        <h2>Global Quote Requests</h2>
        <p>No quote requests have been submitted yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2>Global Quote Requests</h2>
      <p style={{ marginBottom: "2rem" }}>These are custom quote requests submitted via the Header and Footer buttons.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        
        {/* Inbox List */}
        <div style={{ borderRight: "1px solid #eee", paddingRight: "1rem" }}>
          {quotes.slice().reverse().map(quote => (
            <div 
              key={quote.id} 
              onClick={() => setSelectedQuote(quote)}
              style={{
                padding: "1rem", 
                borderBottom: "1px solid #eee", 
                cursor: "pointer",
                backgroundColor: selectedQuote?.id === quote.id ? "#f5f5f5" : "transparent"
              }}
            >
              <strong>{quote.name}</strong> - {quote.company}
              <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
                {new Date(quote.date).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Quote Details */}
        <div>
          {selectedQuote ? (
            <div style={{ padding: "1rem", backgroundColor: "#fafafa", borderRadius: "8px", border: "1px solid #eee" }}>
              <h3 style={{ marginBottom: "1rem", color: "var(--color-primary-dark)" }}>Quote Request Details</h3>
              
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <strong>Name:</strong> <span>{selectedQuote.name}</span>
                <strong>Company:</strong> <span>{selectedQuote.company || 'N/A'}</span>
                <strong>Email:</strong> <span><a href={`mailto:${selectedQuote.email}`}>{selectedQuote.email}</a></span>
                <strong>Phone:</strong> <span><a href={`tel:${selectedQuote.phone}`}>{selectedQuote.phone}</a></span>
                <strong>Budget:</strong> <span>{selectedQuote.budget || 'Not specified'}</span>
                <strong>Date:</strong> <span>{new Date(selectedQuote.date).toLocaleString()}</span>
              </div>

              <div style={{ marginTop: "2rem" }}>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Requirements:</strong>
                <p style={{ whiteSpace: "pre-wrap", backgroundColor: "#fff", padding: "1rem", border: "1px solid #eee", borderRadius: "4px" }}>
                  {selectedQuote.requirements}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
              Select a quote from the list to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
