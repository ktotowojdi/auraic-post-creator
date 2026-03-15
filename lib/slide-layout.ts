import { Platform, ElementPosition, Slide, SlideStyleOverrides } from './types';
import { PLATFORMS } from './platforms';

/**
 * Get platform-specific style override, falling back to IG base value.
 */
function getOverride(slide: Slide, platform: Platform): SlideStyleOverrides {
  if (platform === 'instagram') return {};
  return slide.platformOverrides?.[platform] || {};
}

/**
 * Get platform-adjusted position for a slide element.
 * 1. Check platformOverrides.positions for the current platform
 * 2. Fall back to IG positions (slide.positions)
 * 3. Fall back to defaults
 * For non-IG without override, auto-scale Y from IG defaults.
 */
export function getPosition(
  key: string,
  defaults: Record<string, ElementPosition>,
  slide: Slide,
  platform: Platform = 'instagram'
): ElementPosition {
  // Platform-specific override has highest priority
  const override = getOverride(slide, platform);
  if (override.positions?.[key]) return override.positions[key];

  // IG: use slide.positions or defaults
  const base = slide.positions?.[key] || defaults[key] || { x: 0, y: 0 };
  if (platform === 'instagram') return base;

  // Non-IG without override: auto-scale Y from IG
  const config = PLATFORMS[platform];
  return {
    x: base.x,
    y: Math.round(base.y * config.scaleY),
  };
}

/**
 * Check if the current platform has a custom position for this key.
 */
export function hasCustomPosition(key: string, slide: Slide, platform: Platform): boolean {
  if (platform === 'instagram') return !!slide.positions?.[key];
  return !!slide.platformOverrides?.[platform]?.positions?.[key];
}

/** Get canvas height for a platform */
export function getCanvasHeight(platform: Platform): number {
  return PLATFORMS[platform].height;
}

/**
 * Scale factor for default font sizes on non-IG platforms.
 * FB/LI canvas is 1080x1080 vs IG 1080x1350 — text needs to be smaller.
 */
/** Get fontSize for a specific platform. */
export function getFontSize(slide: Slide, platform: Platform, fallback: number): number {
  const override = getOverride(slide, platform);
  if (override.fontSize != null) return override.fontSize;
  const base = slide.fontSize ?? fallback;
  if (platform === 'instagram') return base;
  return Math.round(base * 48 / 64);
}

/** Get secondaryFontSize for a specific platform. */
export function getSecondaryFontSize(slide: Slide, platform: Platform, fallback: number): number {
  const override = getOverride(slide, platform);
  if (override.secondaryFontSize != null) return override.secondaryFontSize;
  const base = slide.secondaryFontSize ?? fallback;
  if (platform === 'instagram') return base;
  return Math.round(base * 32 / 48);
}

/** Get textGap for a specific platform. */
export function getTextGap(slide: Slide, platform: Platform, fallback: number): number {
  const override = getOverride(slide, platform);
  return override.textGap ?? slide.textGap ?? fallback;
}
