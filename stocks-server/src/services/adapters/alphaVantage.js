import 'dotenv/config';
import axios from "axios";
const BASE = "https://www.alphavantage.co/query";

export async function fetchQuote(symbol, apiKey) {
  const { data } = await axios.get(BASE, {
    params: { function: "GLOBAL_QUOTE", symbol, apikey: apiKey }
  });
  const q = data?.["Global Quote"] || {};
  return {
    symbol: q["01. symbol"] || symbol,
    price: num(q["05. price"]),
    change: num(q["09. change"]),
    changePercent: num(String(q["10. change percent"] || "0").replace("%", "")),
    ts: Date.now()
  };
}

export async function fetchIntraday(symbol, apiKey, interval = "1min", outputSize = "compact") {
  // Force daily if env says so
  if (String(process.env.USE_DAILY || "false").toLowerCase() === "true") {
    const daily = await callAV({ function: "TIME_SERIES_DAILY", symbol, apikey: apiKey });
    return toPoints(daily?.["Time Series (Daily)"]);
  }

  // Try intraday first
  const intraday = await callAV({
    function: "TIME_SERIES_INTRADAY",
    symbol, interval, outputsize: outputSize, apikey: apiKey
  });
  const intradayKey = `Time Series (${interval})`;
  const intradayPts = toPoints(intraday?.[intradayKey]);
  if (intradayPts.length) return intradayPts;

  // Fallback to daily
  const daily = await callAV({ function: "TIME_SERIES_DAILY", symbol, apikey: apiKey });
  return toPoints(daily?.["Time Series (Daily)"]);
}

// ------- helpers -------
async function callAV(params) {
  try {
    const { data } = await axios.get(BASE, { params });
    if (data?.Note || data?.Information || data?.["Error Message"]) {
      console.error("[alpha] limit/error:", data.Note || data.Information || data["Error Message"]);
      return {};
    }
    return data || {};
  } catch (e) {
    console.error("[alpha] network:", e.message);
    return {};
  }
}

function toPoints(seriesObj) {
  if (!seriesObj) return [];
  return Object.entries(seriesObj)
    .map(([t, v]) => ({
      t: new Date(t).getTime(),
      o: num(v["1. open"]),
      h: num(v["2. high"]),
      l: num(v["3. low"]),
      c: num(v["4. close"]),
      v: num(v["5. volume"])
    }))
    .sort((a, b) => a.t - b.t);
}

function num(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}
