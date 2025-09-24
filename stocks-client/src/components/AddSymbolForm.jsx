import { useState } from "react";

export default function AddSymbolForm({ onAdd }) {
  const [sym, setSym] = useState("");
  return (
    <form
      className="mb8"
      onSubmit={(e)=>{ e.preventDefault(); const s=sym.trim().toUpperCase(); if(s){ onAdd(s); setSym(""); } }}
    >
      <div className="mb8"><h3 style={{margin:0}}>Add symbol</h3></div>
      <div style={{display:"flex", gap:8}}>
        <input className="input" placeholder="Search / add e.g. TSLA" value={sym} onChange={(e)=>setSym(e.target.value)} />
        <button className="btn" type="submit">Add</button>
      </div>
      <div className="small" style={{marginTop:6}}>Click a row below to open its chart</div>
    </form>
  );
}
