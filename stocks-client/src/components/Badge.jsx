export default function Badge({ value = 0 }) {
  const up = Number(value) >= 0;
  return (
    <span className={`badge ${up ? 'up' : 'down'}`}>
      {up ? '▲' : '▼'} {Math.abs(Number(value)).toFixed(2)}%
    </span>
  );
}
