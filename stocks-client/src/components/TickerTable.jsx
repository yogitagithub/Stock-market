import Badge from "./Badge";

export default function TickerTable({ rows, onRemove, onClickRow }) {
  return (
    <div className="card">
      <div className="hdr mb8">
        <h3 style={{margin:0}}>Watchlist</h3>
        <span className="small">{rows.length} symbols</span>
      </div>

      <table className="table">
        <thead>
          <tr><th>Symbol</th><th>Price</th><th>Change</th><th>%</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.symbol} className="row" onClick={()=>onClickRow(r.symbol)}>
              <td style={{fontWeight:600}}>{r.symbol}</td>
              <td>{typeof r.price==='number' ? `$${r.price.toFixed(2)}` : '—'}</td>
              <td style={{color: (r.change??0) >= 0 ? 'var(--green)' : 'var(--red)'}}>
                {typeof r.change==='number' ? r.change.toFixed(2) : '—'}
              </td>
              <td><Badge value={r.changePercent || 0} /></td>
              <td>
                <button className="btn" onClick={(e)=>{ e.stopPropagation(); onRemove(r.symbol); }}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
