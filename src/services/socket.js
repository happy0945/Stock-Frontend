/**
 * src/services/socket.js
 *
 * Singleton Socket.io client.
 * The same socket instance is reused across the entire app — never create
 * a new `io()` connection in a component. Import `socket` from here.
 *
 * The socket is created with `autoConnect: false` so the app controls
 * exactly when the connection opens (see useSocket hook).
 */

import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:5000";

const socket = io(WS_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10_000,
  timeout: 20_000,
});

export default socket;
