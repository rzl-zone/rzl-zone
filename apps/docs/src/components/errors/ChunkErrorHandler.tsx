"use client";

import { useEffect, useState } from "react";

export default function ChunkErrorHandler() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let triggered = false;

    const handler = (e: ErrorEvent | PromiseRejectionEvent) => {
      const msg = String(
        (e as ErrorEvent)?.message || (e as PromiseRejectionEvent)?.reason || ""
      );

      if (msg.includes("ChunkLoadError") && !triggered) {
        triggered = true;

        setShow(true);
      }
    };

    window.addEventListener("error", handler);
    window.addEventListener("unhandledrejection", handler);

    return () => {
      window.removeEventListener("error", handler);
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        right: 20,
        padding: "12px 16px",
        background: "#111",
        color: "#fff",
        zIndex: 9999,
        borderRadius: 8
      }}
    >
      <div style={{ marginBottom: 8 }}>
        Failed to load some resources. This can be caused by browser extensions.
      </div>

      <button onClick={() => window.location.reload()}>Reload page</button>
    </div>
  );
}
