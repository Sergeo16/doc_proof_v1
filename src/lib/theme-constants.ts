/** Thèmes DaisyUI — uniquement light et dark (fiables) */
export const THEME_IDS = ["dark", "light"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const STORAGE_KEY = "doc-proof-theme";
export const DEFAULT_THEME: ThemeId = "dark";

export function isValidTheme(value: string): value is ThemeId {
  return THEME_IDS.includes(value as ThemeId);
}
