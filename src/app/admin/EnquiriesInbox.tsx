"use client";

import React, { useState } from "react";
import styles from "./Admin.module.css";

export default function EnquiriesInbox({ enquiries }: { enquiries: any[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Sort by timestamp descending (newest first)
  const sorted = [...enquiries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div>
      <h3>Enquiries Inbox</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left", background: "#f0f0f0" }}>
            <th style={{ padding: "0.75rem" }}>Date</th>
            <th style={{ padding: "0.75rem" }}>Product</th>
            <th style={{ padding: "0.75rem" }}>Volume</th>
            <th style={{ padding: "0.75rem" }}>Status</th>
            <th style={{ padding: "0.75rem" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#666" }}>No enquiries received yet.</td>
            </tr>
          ) : (
            sorted.map((enq) => (
              <React.Fragment key={enq.id}>
                <tr style={{ borderBottom: "1px solid #eee", cursor: "pointer", background: expandedRow === enq.id ? "#f9f9f9" : "transparent" }} onClick={() => setExpandedRow(expandedRow === enq.id ? null : enq.id)}>
                  <td style={{ padding: "0.75rem" }}>{new Date(enq.timestamp).toLocaleString()}</td>
                  <td style={{ padding: "0.75rem" }}>{enq.productName} ({enq.sku})</td>
                  <td style={{ padding: "0.75rem" }}>{enq.volume}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <span style={{ 
                      padding: "0.2rem 0.6rem", 
                      borderRadius: "12px", 
                      fontSize: "0.8rem", 
                      background: enq.status === 'New' ? '#ffeeba' : (enq.status === 'Quoted' ? '#d4edda' : '#e2e3e5')
                    }}>
                      {enq.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {expandedRow === enq.id ? "Collapse" : "Expand"}
                  </td>
                </tr>
                {expandedRow === enq.id && (
                  <tr style={{ background: "#fdfdfd", borderBottom: "2px solid #eee" }}>
                    <td colSpan={5} style={{ padding: "1.5rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div><strong>Target Incoterms:</strong> {enq.incoterms}</div>
                        <div><strong>Destination Port:</strong> {enq.destination}</div>
                        <div style={{ gridColumn: "1 / -1" }}><strong>Special Packaging:</strong> {enq.packaging || "None specified"}</div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
