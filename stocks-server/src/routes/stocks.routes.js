import { Router } from "express";
import { getQuote, getIntraday } from "../services/priceService.js";

export default function stocksRouter({ apiKey }) {
  const r = Router();

  // Used by the chart panel
  r.get("/:symbol/intraday", async (req, res) => {
    const { symbol } = req.params;
    const { interval = "1min" } = req.query;
    try {
      const data = await getIntraday(symbol.toUpperCase(), apiKey, interval);
      res.json({ status: true, data });
    } catch (e) {
      res.status(500).json({ status: false, message: e?.message || "error" });
    }
  });

  // Optional helper if you want to inspect quotes via REST
  r.get("/:symbol/quote", async (req, res) => {
    try {
      const data = await getQuote(req.params.symbol.toUpperCase(), apiKey);
      res.json({ status: true, data });
    } catch (e) {
      res.status(500).json({ status: false, message: e?.message || "error" });
    }
  });

  return r;
}
