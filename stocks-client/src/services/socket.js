import { io } from "socket.io-client";
const WS_BASE = process.env.REACT_APP_WS_BASE || "http://localhost:5001";
export const socket = io(WS_BASE, { transports: ["websocket"] });
