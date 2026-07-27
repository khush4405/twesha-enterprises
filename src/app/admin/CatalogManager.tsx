"use client";

import { useState } from "react";
import styles from "./Admin.module.css";

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export default function CatalogManager({ content, setContent }: { content: any, setContent: any }) {
  const [path, setPath] = useState<number[]>([]);
  
  // Find current node
  let currentLevel = content.categories;
  for (const idx of path) {
    if (currentLevel[idx] && currentLevel[idx].children) {
      currentLevel = currentLevel[idx].children;
    }
  }

  const [editItem, setEditItem] = useState<any>(null);
  
  const handleSaveItem = (item: any) => {
    // Basic symmetry locker for product summary
    if (item.type === "product" && item.summary && item.summary.length > 110) {
      alert("Symmetry Locker Warning: Short Card Summary exceeds 110 characters! Please reduce it.");
      return;
    }

    if (!item.slug) {
      item.slug = slugify(item.title);
    }
    
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

    setContent(newContent);
    setEditItem(null);
  };

  const handleDeleteItem = (e: any, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    let newContent = JSON.parse(JSON.stringify(content));
    let targetList = newContent.categories;
    for (const idx of path) {
      targetList = targetList[idx].children;
    }
    
    const existingIdx = targetList.findIndex((x: any) => x.id === id);
    if (existingIdx >= 0) {
      targetList.splice(existingIdx, 1);
      setContent(newContent);
    }
  };

  const navigateDown = (idx: number) => {
    setPath([...path, idx]);
  };

  const navigateUp = () => {
    setPath(path.slice(0, -1));
  };

  const getBreadcrumbs = () => {
    let str = "Root";
    let cur = content.categories;
    for (const idx of path) {
      str += ` > ${cur[idx].title}`;
      cur = cur[idx].children;
    }
    return str;
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
        <div>
          <strong>Current Path: </strong> {getBreadcrumbs()}
          {path.length > 0 && (
            <button onClick={navigateUp} style={{ marginLeft: "1rem" }} className={styles.btnSecondary}>
              Up One Level
            </button>
          )}
        </div>
        <div>
          <button onClick={() => setEditItem({ type: "category" })} className={styles.btnPrimary} style={{ marginRight: "0.5rem" }}>+ New Folder</button>
          <button onClick={() => setEditItem({ type: "product", specs: [] })} className={styles.btnPrimary}>+ New Product</button>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc", textAlign: "left" }}>
            <th style={{ padding: "0.5rem" }}>Type</th>
            <th style={{ padding: "0.5rem" }}>Title</th>
            <th style={{ padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentLevel.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: "1rem", textAlign: "center", color: "#666" }}>
                Empty Category. Add a folder or product above.
              </td>
            </tr>
          )}
          {currentLevel.map((item: any, idx: number) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{item.type === "product" ? "📦 Product" : "📁 Folder"}</td>
              <td style={{ padding: "0.5rem", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {(!item.type || item.type === "category") ? (
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateDown(idx); }}>{item.title}</a>
                ) : (
                  <span>{item.title}</span>
                )}
              </td>
              <td style={{ padding: "0.5rem" }}>
                <button onClick={(e) => { e.stopPropagation(); setEditItem(item); }} className={styles.btnSecondary} style={{ padding: "0.3rem 0.6rem", fontSize: "0.9rem", marginRight: "0.5rem" }}>Edit</button>
                <button onClick={(e) => handleDeleteItem(e, item.id)} className={styles.btnSecondary} style={{ padding: "0.3rem 0.6rem", fontSize: "0.9rem", background: "#dc3545", color: "white" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editItem && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
          <h3>{editItem.id ? "Edit" : "New"} {editItem.type === "product" ? "Product" : "Folder"}</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <input type="text" placeholder="Title" value={editItem.title || ""} onChange={e => setEditItem({...editItem, title: e.target.value})} style={{ padding: "0.5rem" }} />
            
            {editItem.type === "category" && (
              <>
                <textarea placeholder="Description" value={editItem.description || ""} onChange={e => setEditItem({...editItem, description: e.target.value})} style={{ padding: "0.5rem" }} rows={3} />
                <input type="text" placeholder="Cover Image URL" value={editItem.coverImage || ""} onChange={e => setEditItem({...editItem, coverImage: e.target.value})} style={{ padding: "0.5rem" }} />
              </>
            )}

            {editItem.type === "product" && (
              <>
                <input type="text" placeholder="Short Summary (Max 110 chars)" value={editItem.summary || ""} onChange={e => setEditItem({...editItem, summary: e.target.value})} style={{ padding: "0.5rem", border: (editItem.summary?.length > 110) ? "2px solid red" : "1px solid #ccc" }} />
                <div style={{ fontSize: "0.8rem", color: (editItem.summary?.length > 110) ? "red" : "#666" }}>
                  {editItem.summary?.length || 0} / 110 characters (Symmetry Locker)
                </div>
                
                <textarea placeholder="Detailed Description" value={editItem.description || ""} onChange={e => setEditItem({...editItem, description: e.target.value})} style={{ padding: "0.5rem" }} rows={4} />
                <input type="text" placeholder="Image Gallery Array (comma separated URLs)" value={(editItem.images || []).join(",")} onChange={e => setEditItem({...editItem, images: e.target.value ? e.target.value.split(",") : []})} style={{ padding: "0.5rem" }} />
                <input type="text" placeholder="Attachment PDF Path" value={editItem.attachment || ""} onChange={e => setEditItem({...editItem, attachment: e.target.value})} style={{ padding: "0.5rem" }} />
                
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <input type="checkbox" id="isExternal" checked={!!editItem.externalLink} onChange={e => setEditItem({...editItem, externalLink: e.target.checked ? "https://" : ""})} />
                  <label htmlFor="isExternal">Is External Link?</label>
                </div>
                {editItem.externalLink !== undefined && editItem.externalLink !== "" && (
                  <input type="text" placeholder="External URL (e.g. https://...)" value={editItem.externalLink} onChange={e => setEditItem({...editItem, externalLink: e.target.value})} style={{ padding: "0.5rem" }} />
                )}
                
                <h4>Specs & Packing List</h4>
                {(editItem.specs || []).map((spec: any, sIdx: number) => (
                  <div key={sIdx} style={{ display: "flex", gap: "0.5rem" }}>
                    <input type="text" placeholder="Label (e.g. Material)" value={spec.label} onChange={e => {
                      const newSpecs = [...editItem.specs];
                      newSpecs[sIdx].label = e.target.value;
                      setEditItem({...editItem, specs: newSpecs});
                    }} style={{ padding: "0.5rem", flex: 1 }} />
                    <input type="text" placeholder="Value (e.g. Steel)" value={spec.value} onChange={e => {
                      const newSpecs = [...editItem.specs];
                      newSpecs[sIdx].value = e.target.value;
                      setEditItem({...editItem, specs: newSpecs});
                    }} style={{ padding: "0.5rem", flex: 2 }} />
                  </div>
                ))}
                <button onClick={() => setEditItem({...editItem, specs: [...(editItem.specs || []), { label: "", value: "" }]})} className={styles.btnSecondary} style={{ alignSelf: "flex-start" }}>+ Add Spec</button>
              </>
            )}
            
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => handleSaveItem(editItem)} className={styles.btnPrimary}>Save Item</button>
              <button onClick={() => setEditItem(null)} className={styles.btnSecondary}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
