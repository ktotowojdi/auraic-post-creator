import { Platform } from './types';

/**
 * Auto-adapt Instagram text for Facebook and LinkedIn.
 * Applies common transformations:
 * - "link w bio" → platform-specific CTA
 * - "⬆️" emoji removal on non-IG
 * - LinkedIn gets more professional tone tweaks
 */

const IG_TO_FB: [RegExp, string][] = [
  [/link w bio\s*⬆️?/gi, 'link w komentarzu 👇'],
  [/Link w bio\s*⬆️?/gi, 'Link w komentarzu 👇'],
  [/bio\s*⬆️/gi, 'komentarzu 👇'],
  [/⬆️/g, '👇'],
];

const IG_TO_LI: [RegExp, string][] = [
  [/link w bio\s*⬆️?/gi, 'link w komentarzu poniżej'],
  [/Link w bio\s*⬆️?/gi, 'Link w komentarzu poniżej'],
  [/bio\s*⬆️/gi, 'komentarzu poniżej'],
  [/⬆️/g, ''],
  // Tone: more professional
  [/Chcesz taką stronę\?/g, 'Zainteresowany? Porozmawiajmy.'],
  [/Zamów darmowy prototyp/gi, 'Napisz wiadomość — przygotujemy propozycję'],
  [/zamów darmowy prototyp/gi, 'napisz wiadomość — przygotujemy propozycję'],
  [/darmowy prototyp/gi, 'bezpłatną konsultację'],
];

function applyRules(text: string, rules: [RegExp, string][]): string {
  let result = text;
  for (const [pattern, replacement] of rules) {
    result = result.replace(pattern, replacement);
  }
  return result.trim();
}

/** Strip all emojis from text */
function stripEmojis(text: string): string {
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FAFF}\u{200D}\u{20E3}]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

export function adaptText(text: string, platform: Platform): string {
  if (platform === 'instagram') return text;
  if (platform === 'facebook') return applyRules(text, IG_TO_FB);
  if (platform === 'linkedin') return stripEmojis(applyRules(text, IG_TO_LI));
  return text;
}

/**
 * Adapt all text fields of a slide for a given platform.
 * Returns adapted text object (primary, secondary, listItems).
 */
export function adaptSlideText(
  text: { primary: string; secondary?: string; listItems?: string[] },
  platform: Platform
): { primary: string; secondary?: string; listItems?: string[] } {
  if (platform === 'instagram') return text;

  return {
    primary: adaptText(text.primary, platform),
    secondary: text.secondary ? adaptText(text.secondary, platform) : undefined,
    listItems: text.listItems?.map((item) => adaptText(item, platform)),
  };
}
