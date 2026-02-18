"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/**
 * Force data-theme on document for DaisyUI - ensures theme is applied correctly
 */
export function ThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.setAttribute("data-theme", resolvedTheme);
    }
  }, [resolvedTheme]);

  return null;
}
