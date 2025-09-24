import { getQuote } from "./services/priceService.js";

export function attachSockets(io, { apiKey, pollMs: initialMs = 10000, minMs = 5000 }) {
  const tracked = new Set(["AAPL", "MSFT", "GOOGL", "TSLA"]);
  let pollMs = Math.max(minMs, Number(initialMs));
  let timer = null;

  async function tick() {
    const payload = [];
    for (const sym of tracked) {
      try {
        const q = await getQuote(sym, apiKey);
        payload.push(q);
      } catch (_) { /* ignore individual symbol errors */ }
    }
    if (payload.length) io.emit("tick", payload);
  }

  function start() { if (!timer) timer = setInterval(tick, pollMs); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }

  io.on("connection", (socket) => {
    socket.emit("symbols", Array.from(tracked));

    socket.on("add-symbol", (sym) => {
      if (!sym) return;
      tracked.add(String(sym).toUpperCase());
      io.emit("symbols", Array.from(tracked));
    });

    socket.on("remove-symbol", (sym) => {
      if (!sym) return;
      tracked.delete(String(sym).toUpperCase());
      io.emit("symbols", Array.from(tracked));
    });

    socket.on("set-interval", (ms) => {
      const next = Math.max(minMs, Number(ms));
      if (!Number.isFinite(next)) return;
      pollMs = next; stop(); start();
    });
  });

  start();
}
