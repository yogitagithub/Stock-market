import { useEffect, useMemo, useState } from "react";
import IntervalControl from "./components/IntervalControl";
import AddSymbolForm from "./components/AddSymbolForm";
import TickerTable from "./components/TickerTable";
import PriceChart from "./components/PriceChart";
import { socket } from "./services/socket";
import { getIntraday } from "./services/api";

export default function App() {
  const [symbols, setSymbols] = useState(["AAPL","MSFT","GOOGL","TSLA"]);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState("AAPL");
  const [series, setSeries] = useState([]);
  const [intervalMs, setIntervalMs] = useState(10000);


  useEffect(()=>{
    socket.on("symbols", list => setSymbols(list));
    socket.on("tick", payload => {
      setRows(prev => {
        const map = new Map(prev.map(r=>[r.symbol, r]));
        for (const q of payload) map.set(q.symbol, { ...map.get(q.symbol), ...q });
        return Array.from(map.values()).sort((a,b)=>a.symbol.localeCompare(b.symbol));
      });
    });
    return ()=>{ socket.off("symbols"); socket.off("tick"); };
  },[]);

  // Load chart when selected changes
  useEffect(()=>{ if(selected) getIntraday(selected).then(setSeries); }, [selected]);

  const addSymbol = (sym) => { socket.emit("add-symbol", sym); if(!symbols.includes(sym)) setSymbols([...symbols, sym]); };
 
  const removeSymbol = (sym) => {
  socket.emit("remove-symbol", sym);
  setSymbols(prev => {
    const next = prev.filter(s => s !== sym);
    if (selected === sym) setSelected(next[0] || "");
    return next;
  });
};


  const setIntervalSrv = (ms) => { setIntervalMs(ms); socket.emit("set-interval", ms); };

  // const list = useMemo(()=>{
  //   const map = new Map(rows.map(r=>[r.symbol, r]));
  //   for (const s of symbols){ if(!map.has(s)) map.set(s, { symbol:s }); }
  //   return Array.from(map.values()).sort((a,b)=>a.symbol.localeCompare(b.symbol));
  // }, [rows, symbols]);


  const list = useMemo(() => {
  const rowsMap = new Map(rows.map(r => [r.symbol, r]));
  // only include symbols that are currently in the watchlist
  return symbols.map(s => rowsMap.get(s) ?? { symbol: s });
}, [rows, symbols]);


  return (
    <div className="container">
      <div className="hdr">
        <div className="title">Real-Time Stock Market Data Visualisation Dashboard</div>
        <IntervalControl interval={intervalMs} onChange={setIntervalSrv} />
      </div>

      <div className="grid">
        {/* Left */}
        <div>
          <div className="card" style={{marginBottom:16}}>
            <AddSymbolForm onAdd={addSymbol} />
          </div>
          <div onClick={(e)=>{
            const tr = e.target.closest("tr"); if(!tr) return;
            const sym = tr.firstChild?.textContent?.trim();
            if(sym) setSelected(sym);
          }}>
            <TickerTable rows={list} onRemove={removeSymbol} onClickRow={(sym)=>setSelected(sym)} />
          </div>
        </div>

        {/* Right */}
        <div>
          {selected ? <PriceChart symbol={selected} series={series} /> : <div className="card">Select a symbol</div>}
        </div>
      </div>
    </div>
  );
}
