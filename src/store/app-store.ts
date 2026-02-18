/**
 * DOC PROOF - Zustand App Store
 * Theme, language, UI state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  theme: string;
  locale: string;
  setTheme: (theme: string) => void;
  setLocale: (locale: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "dark",
      locale: "en",
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
    }),
    { name: "doc-proof-app" }
  )
);
