"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, getPathWithoutLocale } from "@/i18n/routing";
import { useRef } from "react";

const LANGUAGES = [
  { code: "en" as const, label: "English" },
  { code: "fr" as const, label: "Français" },
  { code: "zh" as const, label: "中文" },
  { code: "ar" as const, label: "العربية" },
  { code: "es" as const, label: "Español" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const pathWithoutLocale = getPathWithoutLocale(pathname || "/");
  const toggleRef = useRef<HTMLLabelElement>(null);

  const closeDropdown = () => {
    (document.activeElement as HTMLElement)?.blur();
    toggleRef.current?.blur();
  };

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
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="hidden sm:inline">
          {LANGUAGES.find((l) => l.code === locale)?.label || locale}
        </span>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-40 mt-2 z-50"
      >
        {LANGUAGES.map((lang) => (
          <li key={lang.code}>
            {locale === lang.code ? (
              <span className="active cursor-default">{lang.label}</span>
            ) : (
              <Link href={pathWithoutLocale} locale={lang.code} onClick={closeDropdown}>
                {lang.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
