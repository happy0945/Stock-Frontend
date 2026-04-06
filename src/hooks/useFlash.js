/**
 * src/hooks/useFlash.js
 *
 * Returns the current flash state for a symbol and auto-clears it after
 * the animation duration so it can re-fire on the next price change.
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectFlashState, clearFlash } from "@/store/slices/stocksSlice";

const FLASH_DURATION_MS = 600;

const useFlash = (symbol) => {
  const dispatch = useDispatch();
  const flash = useSelector(selectFlashState(symbol));

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => {
      dispatch(clearFlash(symbol));
    }, FLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [flash, symbol, dispatch]);

  return flash; // "gain" | "loss" | null
};

export default useFlash;
