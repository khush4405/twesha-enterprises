"use client";

import { useState, useEffect } from "react";
import { FolderPlus, PackagePlus, ArrowUp, ArrowDown, Edit2, Trash2, Folder, Package, ClipboardPaste } from "lucide-react";
import styles from "../AdminLayout.module.css";

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function CatalogPage() {
  const [content, setContent] = useState<any>(null);
  const [path, setPath] = useState<number[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/save-content")
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      });
  }, []);

  const saveToBackend = async (newContent: any) => {
    setSaving(true);
    await fetch("/api/save-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newContent)
    });
    setContent(newContent);
    setSaving(false);
  };

  if (loading || !content) return <div style={{ padding: "2rem" }}>Loading Catalog...</div>;

  // Navigate path
  let currentLevel = content.categories;
  for (const idx of path) {
    if (currentLevel[idx] && currentLevel[idx].children) {
      currentLevel = currentLevel[idx].children;
    }
  }

  const handleSaveItem = async (item: any) => {
    if (!item.slug) item.slug = slugify(item.title);
    if (!item.id) {
      item.id = Date.now().toString();
      if (item.type === "category") item.children = [];
    }

    let newContent = JSON.parse(JSON.stringify(content));
    let targetList = newContent.categories;
    for (const idx of path) {
      targetList = targetList[idx].children;
    }

    const existingIdx = targetList.findIndex((x: any) => x.id === item.id);
    if (existingIdx >= 0) {
      targetList[existingIdx] = item;
    } else {
      targetList.push(item);
    }

    await saveToBackend(newContent);
    setEditItem(null);
  };

  const handleDeleteItem = async (e: any, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this item? Sub-items will also be deleted.")) return;
    
    let newContent = JSON.parse(JSON.stringify(content));
    let targetList = newContent.categories;
    for (const idx of path) {
      targetList = targetList[idx].children;
    }
    
    const existingIdx = targetList.findIndex((x: any) => x.id === id);
    if (existingIdx >= 0) {
      targetList.splice(existingIdx, 1);
      await saveToBackend(newContent);
    }
  };

  const handleMove = async (e: any, idx: number, direction: 'up' | 'down') => {
    e.stopPropagation();
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === currentLevel.length - 1) return;

    let newContent = JSON.parse(JSON.stringify(content));
    let targetList = newContent.categories;
    for (const p of path) targetList = targetList[p].children;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = targetList[idx];
    targetList[idx] = targetList[targetIdx];
    targetList[targetIdx] = temp;

    await saveToBackend(newContent);
  };

  const handleBulkPaste = (e: any) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const lines = pastedText.split('\n').filter((l: string) => l.trim() !== '');
    
    const newSpecs = [...(editItem.keySpecifications || [])];
    
    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        newSpecs.push({ label: parts[0].trim(), value: parts[1].trim() });
      } else if (parts.length === 1) {
        newSpecs.push({ label: parts[0].trim(), value: "" });
      }
    }
    
    setEditItem({ ...editItem, keySpecifications: newSpecs });
  };

  const getBreadcrumbs = () => {
    let elems = [<span key="root" onClick={() => setPath([])} style={{ cursor: "pointer", color: "#60A5FA" }}>Catalog Root</span>];
    let cur = content.categories;
    let tempPath: number[] = [];
    
    for (let i = 0; i < path.length; i++) {
      const idx = path[i];
      tempPath.push(idx);
      const currentTempPath = [...tempPath];
      elems.push(<span key={`sep-${i}`} style={{ margin: "0 0.5rem", color: "rgba(255,255,255,0.4)" }}>/</span>);
      elems.push(
        <span key={`node-${i}`} onClick={() => setPath(currentTempPath)} style={{ cursor: "pointer", color: i === path.length - 1 ? "white" : "#60A5FA" }}>
          {cur[idx].title}
        </span>
      );
      cur = cur[idx].children;
    }
    return <div style={{ display: "flex", alignItems: "center", fontSize: "0.875rem" }}>{elems}</div>;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0", fontFamily: "var(--font-heading)" }}>Catalog Manager</h1>
          {getBreadcrumbs()}
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => setEditItem({ type: "category", children: [] })} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", borderRadius: "8px", cursor: "pointer" }}
          >
            <FolderPlus size={16} /> New Folder
          </button>
          <button 
            onClick={() => setEditItem({ type: "product", keySpecifications: [], requestQuoteOption: true })} 
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "#1565FF", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: 500 }}
          >
            <PackagePlus size={16} /> New Product
          </button>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", overflow: "hidden" }}>
        {currentLevel.length === 0 ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "rgba(255,255,255,0.5)" }}>
            <Folder size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.5 }} />
            <p>This folder is empty.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.1)", textAlign: "left", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                <th style={{ padding: "1rem" }}>Name</th>
                <th style={{ padding: "1rem", width: "15%" }}>Type</th>
                <th style={{ padding: "1rem", width: "15%" }}>Order</th>
                <th style={{ padding: "1rem", width: "20%", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentLevel.map((item: any, idx: number) => (
                <tr 
                  key={item.id} 
                  onClick={() => { if (item.type === "category") setPath([...path, idx]); }}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: item.type === "category" ? "pointer" : "default", transition: "background 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem", flex: "1 min-w-0" }}>
                    {item.type === "category" ? <Folder size={18} color="#D4AF37" /> : <Package size={18} color="#60A5FA" />}
                    <span style={{ fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</span>
                  </td>
                  <td style={{ padding: "1rem", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
                    {item.type === "category" ? "Folder" : "Product"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={(e) => handleMove(e, idx, 'up')} disabled={idx === 0} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: idx === 0 ? "rgba(255,255,255,0.2)" : "white", padding: "4px", borderRadius: "4px", cursor: idx === 0 ? "default" : "pointer" }}><ArrowUp size={14} /></button>
                      <button onClick={(e) => handleMove(e, idx, 'down')} disabled={idx === currentLevel.length - 1} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: idx === currentLevel.length - 1 ? "rgba(255,255,255,0.2)" : "white", padding: "4px", borderRadius: "4px", cursor: idx === currentLevel.length - 1 ? "default" : "pointer" }}><ArrowDown size={14} /></button>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "right" }}>
                    <button onClick={(e) => { e.stopPropagation(); setEditItem(item); }} style={{ background: "rgba(21, 101, 255, 0.1)", border: "none", color: "#60A5FA", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500, marginRight: "0.5rem" }}>Edit</button>
                    <button onClick={(e) => handleDeleteItem(e, item.id)} style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editItem && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "2rem" }}>
          <div style={{ background: "var(--bg-navy-dark, #0b1120)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "var(--bg-navy-dark, #0b1120)", zIndex: 10 }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem" }}>{editItem.id ? "Edit" : "New"} {editItem.type === "category" ? "Folder" : "Product"}</h2>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}>&times;</button>
            </div>
            
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>Title</label>
                <input type="text" value={editItem.title || ""} onChange={e => setEditItem({...editItem, title: e.target.value})} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }} />
              </div>

              {editItem.type === "category" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>Description</label>
                    <textarea value={editItem.description || ""} onChange={e => setEditItem({...editItem, description: e.target.value})} rows={3} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>Cover Image URL</label>
                    <input type="text" value={editItem.coverImage || ""} onChange={e => setEditItem({...editItem, coverImage: e.target.value})} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }} />
                  </div>
                </>
              )}

              {editItem.type === "product" && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>Primary Image URL</label>
                    <input type="text" value={editItem.image || ""} onChange={e => setEditItem({...editItem, image: e.target.value})} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }} />
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>Short Description</label>
                    <input type="text" value={editItem.shortDescription || ""} onChange={e => setEditItem({...editItem, shortDescription: e.target.value})} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>Long Description</label>
                    <textarea value={editItem.longDescription || ""} onChange={e => setEditItem({...editItem, longDescription: e.target.value})} rows={5} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>Catalogue Attachment (PDF URL)</label>
                    <input type="text" value={editItem.catalogueAttachment || ""} onChange={e => setEditItem({...editItem, catalogueAttachment: e.target.value})} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white" }} />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <input type="checkbox" id="quoteOpt" checked={!!editItem.requestQuoteOption} onChange={e => setEditItem({...editItem, requestQuoteOption: e.target.checked})} style={{ width: "16px", height: "16px" }} />
                    <label htmlFor="quoteOpt" style={{ fontSize: "0.875rem", cursor: "pointer" }}>Enable "Request a Quote" Option</label>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <label style={{ fontSize: "1rem", fontWeight: 500 }}>Key Specifications Table</label>
                      <button type="button" onClick={() => {
                        const ta = document.createElement("textarea");
                        ta.style.position = "absolute";
                        ta.style.left = "-9999px";
                        document.body.appendChild(ta);
                        ta.focus();
                        setTimeout(() => {
                          ta.addEventListener("paste", handleBulkPaste);
                          document.execCommand("paste");
                          ta.remove();
                        }, 50);
                      }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "0.75rem", cursor: "pointer" }}
                      title="Paste tabular data from Excel (Ctrl+V into the table area manually if this fails)">
                        <ClipboardPaste size={14} /> Bulk Paste Helper
                      </button>
                    </div>
                    
                    {/* Fallback bulk paste area for browsers that block execCommand("paste") */}
                    <textarea 
                      placeholder="Or paste Excel data here..." 
                      onPaste={handleBulkPaste}
                      style={{ width: "100%", padding: "0.5rem", background: "rgba(0,0,0,0.2)", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "6px", color: "white", marginBottom: "1rem", minHeight: "40px" }}
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {(editItem.keySpecifications || []).map((spec: any, sIdx: number) => (
                        <div key={sIdx} style={{ display: "flex", gap: "0.5rem" }}>
                          <input type="text" placeholder="Label (e.g. Material)" value={spec.label} onChange={e => {
                            const newSpecs = [...editItem.keySpecifications];
                            newSpecs[sIdx].label = e.target.value;
                            setEditItem({...editItem, keySpecifications: newSpecs});
                          }} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", flex: 1 }} />
                          <input type="text" placeholder="Value (e.g. Steel)" value={spec.value} onChange={e => {
                            const newSpecs = [...editItem.keySpecifications];
                            newSpecs[sIdx].value = e.target.value;
                            setEditItem({...editItem, keySpecifications: newSpecs});
                          }} style={{ padding: "0.75rem", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "white", flex: 2 }} />
                          <button onClick={() => {
                            const newSpecs = [...editItem.keySpecifications];
                            newSpecs.splice(sIdx, 1);
                            setEditItem({...editItem, keySpecifications: newSpecs});
                          }} style={{ background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", padding: "0 1rem", borderRadius: "6px", cursor: "pointer" }}><Trash2 size={16} /></button>
                        </div>
                      ))}
                      <button onClick={() => setEditItem({...editItem, keySpecifications: [...(editItem.keySpecifications || []), { label: "", value: "" }]})} 
                        style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "0.875rem", cursor: "pointer", marginTop: "0.5rem" }}>
                        + Add Row
                      </button>
                    </div>
                  </div>
                </>
              )}
              
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <button onClick={() => handleSaveItem(editItem)} disabled={saving} style={{ background: "#1565FF", border: "none", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", flex: 1 }}>
                  {saving ? "Saving..." : "Save Item"}
                </button>
                <button onClick={() => setEditItem(null)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
