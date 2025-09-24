export default function IntervalControl({ interval, onChange }) {
  return (
    <div className="interval-pill">
      <span className="small">Interval</span>
      <select
        className="select"
        value={interval}
        onChange={(e)=>onChange(Number(e.target.value))}
      >
        <option value={5000}>5 s</option>
        <option value={10000}>10 s</option>
        <option value={15000}>15 s</option>
        <option value={30000}>30 s</option>
        <option value={60000}>60 s</option>
      </select>
    </div>
  );
}
