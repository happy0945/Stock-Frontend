/**
 * src/hooks/useSocket.js
 *
 * Manages the Socket.io connection lifecycle and dispatches Redux actions
 * when live events arrive from the backend.
 *
 * Mount this hook ONCE at the app root (App.jsx). All other components
 * read state from Redux rather than subscribing directly to the socket.
 */

import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import socket from "@/services/socket";
import { tradeTick, setFeedStatus } from "@/store/slices/stocksSlice";

const useSocket = (watchlist = []) => {
  const dispatch = useDispatch();

  // Subscribe to a symbol's room on the server
  const subscribe = useCallback((symbol) => {
    if (socket.connected) {
      socket.emit("subscribe", { symbol });
    }
  }, []);

  // Unsubscribe from a symbol's room
  const unsubscribe = useCallback((symbol) => {
    if (socket.connected) {
      socket.emit("unsubscribe", { symbol });
    }
  }, []);

  useEffect(() => {
    // ── Connect ──────────────────────────────────────────────────────────────
    socket.connect();

    // ── Connection events ────────────────────────────────────────────────────
    const onConnect = () => {
      // Re-subscribe to all watchlist symbols after (re)connect
      watchlist.forEach((sym) => socket.emit("subscribe", { symbol: sym }));
    };

    const onDisconnect = (reason) => {
      console.warn("[Socket] Disconnected:", reason);
    };

    const onConnectError = (err) => {
      console.error("[Socket] Connection error:", err.message);
    };

    // ── Finnhub feed status ───────────────────────────────────────────────────
    const onFinnhubStatus = ({ connected, fatal, message }) => {
      dispatch(setFeedStatus({ connected, fatal }));
      if (fatal) {
        toast.error(message || "Real-time feed unavailable.", {
          duration: Infinity,
          id: "feed-fatal",
        });
      }
    };

    // ── Live trade ticks ─────────────────────────────────────────────────────
    const onTrade = (trade) => {
      dispatch(tradeTick(trade));
    };

    // ── Subscription list from server ─────────────────────────────────────────
    const onSubscriptions = ({ symbols }) => {
      symbols.forEach((sym) => socket.emit("subscribe", { symbol: sym }));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("finnhub:status", onFinnhubStatus);
    socket.on("stock:trade", onTrade);
    socket.on("stock:subscriptions", onSubscriptions);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("finnhub:status", onFinnhubStatus);
      socket.off("stock:trade", onTrade);
      socket.off("stock:subscriptions", onSubscriptions);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-subscribe when watchlist changes
  useEffect(() => {
    if (socket.connected) {
      watchlist.forEach((sym) => socket.emit("subscribe", { symbol: sym }));
    }
  }, [watchlist]);

  return { subscribe, unsubscribe, socket };
};

export default useSocket;
