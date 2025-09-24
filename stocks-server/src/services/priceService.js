
import 'dotenv/config';
// stocks-server/src/services/priceService.js
import { err } from "../utils/logger.js";

// Toggle mock vs real via .env
const USE_MOCK = String(process.env.USE_MOCK || "false").toLowerCase() === "true";

// Top-level dynamic import (Node 18+ supports this; you’re on Node 20 so it’s fine)
const adapter = USE_MOCK
  ? await import("./adapters/mock.js")
  : await import("./adapters/alphaVantage.js");

const { fetchQuote, fetchIntraday } = adapter;

// Very small in-memory cache: symbol -> { lastQuote, history, historyTs }
const cache = new Map();

/** Live quote for table (no aggressive caching; let the scheduler refresh) */
export async function getQuote(symbol, apiKey) {
  try {
    const q = await fetchQuote(symbol, apiKey);
    const entry = cache.get(symbol) || {};
    entry.lastQuote = q;
    cache.set(symbol, entry);
    return q;
  } catch (e) {
    err("quote error", symbol, e?.message || e);
    throw e;
  }
}

/** Series for chart; cache ~30s */
export async function getIntraday(symbol, apiKey, interval = "1min") {
  try {
    const entry = cache.get(symbol) || {};
    const now = Date.now();
    if (entry.history && now - (entry.historyTs || 0) < 30_000) {
      return entry.history;
    }
    const hist = await fetchIntraday(symbol, apiKey, interval);
    entry.history = hist;
    entry.historyTs = now;
    cache.set(symbol, entry);
    return hist;
  } catch (e) {
    err("intraday error", symbol, e?.message || e);
    throw e;
  }
}

