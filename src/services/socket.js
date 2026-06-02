
import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "https://stock-app-1-7imv.onrender.com";

const socket = io(WS_URL, {
  autoConnect: false,
  // transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10_000,
  timeout: 20_000,
});

export default socket;
