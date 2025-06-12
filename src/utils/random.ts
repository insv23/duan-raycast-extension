import { getPreferenceValues } from "@raycast/api";

export function generateRandomSlug(): string {
  const preferences = getPreferenceValues<Preferences>();
  const chars = preferences.slugChars || "abcdefghijklmnopqrstuvwxyz0123456789";
  const length = Number.parseInt(preferences.slugLength || "4", 10);

  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
}
