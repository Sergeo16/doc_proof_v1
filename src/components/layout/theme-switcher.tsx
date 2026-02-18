"use client";

import { useTheme } from "@/components/providers/theme-provider";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";

const THEMES = [
  { id: "dark", color: "bg-neutral" },
  { id: "light", color: "bg-base-100" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLLabelElement>(null);

  useEffect(() => setMounted(true), []);

  const handleThemeChange = (tId: string) => {
    setTheme(tId);
    (document.activeElement as HTMLElement)?.blur();
    toggleRef.current?.blur();
  };

  if (!mounted) return null;

  return (
    <div className="dropdown dropdown-end">
      <label
        ref={toggleRef}
        tabIndex={0}
        className="btn btn-ghost btn-sm gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="hidden sm:inline">{t(theme as "dark") || theme}</span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-3 shadow-xl bg-base-200 rounded-box w-72 mt-2 z-50 border border-base-300"
      >
        <li className="menu-title py-2">
          <span className="text-sm font-semibold opacity-80">{t("selectTheme")}</span>
        </li>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((tItem) => (
            <li key={tItem.id}>
              <button
                type="button"
                onClick={() => handleThemeChange(tItem.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all hover:scale-105 ${
                  theme === tItem.id
                    ? "ring-2 ring-primary bg-primary/20"
                    : "hover:bg-base-300/50"
                }`}
                title={t(tItem.id as "dark") || tItem.id}
              >
                <span
                  className={`w-8 h-8 rounded-full ${tItem.color} border-2 border-base-300 shadow-sm`}
                />
                <span className="text-xs truncate max-w-full">
                  {t(tItem.id as "dark") || tItem.id}
                </span>
              </button>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}
