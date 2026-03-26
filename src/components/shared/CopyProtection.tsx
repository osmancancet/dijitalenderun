"use client";

import { useEffect } from "react";

export default function CopyProtection() {
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+C, Ctrl+U (view source), Ctrl+S (save), F12 (devtools)
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "C" || e.key === "u" || e.key === "U" || e.key === "s" || e.key === "S")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    }

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
