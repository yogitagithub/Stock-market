// Tiny random-walk generator for demo/testing
const mem = new Map();

export async function fetchQuote(symbol) {
  const q = step(symbol);
  return {
    symbol,
    price: q.price,
    change: q.change,
    changePercent: q.changePct,
    ts: Date.now()
  };
}

export async function fetchIntraday(symbol) {
  // 120 points ~ last 2 hours (1min cadence) – works fine for daily too
  const now = Date.now();
  const base = step(symbol).price;
  const pts = Array.from({ length: 120 }, (_, i) => {
    const t = now - (120 - i) * 60_000;
    const p = base * (1 + Math.sin(i / 12) * 0.01) + (Math.random() - 0.5) * 0.5;
    return { t, o: p - 0.1, h: p + 0.25, l: p - 0.3, c: p, v: 1000 + Math.floor(Math.random() * 500) };
  });
  return pts;
}

function step(symbol) {
  const last = mem.get(symbol) || { price: 100 + Math.random() * 50 };
  const delta = (Math.random() - 0.5) * 0.6;
  const price = Math.max(1, last.price + delta);
  const change = price - (last.prev ?? price);
  const changePct = (change / (last.prev ?? price)) * 100 || 0;
  const q = { prev: price, price, change, changePct };
  mem.set(symbol, q);
  return q;
}
