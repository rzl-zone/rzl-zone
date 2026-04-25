"use client";

import { useEffect, useRef, useState } from "react";
import { useEffectEvent } from "@rzl-zone/core-react/hooks";

export function useDebounceFD<T>(value: T, delayMs = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timer = useRef<number | null>(null);

  const setDbcVal = useEffectEvent(() => setDebouncedValue(value));

  useEffect(() => {
    if (delayMs === 0) {
      setDbcVal();
      return;
    }

    if (timer.current) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setDbcVal();
    }, delayMs);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
