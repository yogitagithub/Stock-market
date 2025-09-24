import http from "http";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { log } from "./utils/logger.js";
import stocksRouter from "./routes/stocks.routes.js";
import { attachSockets } from "./sockets.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";
const POLL_INTERVAL_MS = Number(process.env.POLL_INTERVAL_MS || 10000);
const MIN_POLL_MS = Number(process.env.MIN_POLL_MS || 5000);
const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY || "";

if (!ALPHA_VANTAGE_KEY) {
  log("⚠️  No ALPHA_VANTAGE_KEY set; the server will run but API calls will fail.");
}

const app = express();
app.use(helmet());
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/stocks", stocksRouter({ apiKey: ALPHA_VANTAGE_KEY }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });

attachSockets(io, {
  apiKey: ALPHA_VANTAGE_KEY,
  pollMs: POLL_INTERVAL_MS,
  minMs: MIN_POLL_MS
});

server.listen(PORT, () => log(`Server listening on :${PORT}`));
