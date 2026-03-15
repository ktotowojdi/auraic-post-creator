import { Platform } from './types';

export interface PlatformConfig {
  id: Platform;
  label: string;
  width: number;
  height: number;
  scaleY: number; // relative to IG 1350 height
}

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  instagram: {
    id: 'instagram',
    label: 'Instagram',
    width: 1080,
    height: 1350,
    scaleY: 1,
  },
  facebook: {
    id: 'facebook',
    label: 'Facebook',
    width: 1080,
    height: 1080,
    scaleY: 1080 / 1350, // 0.8
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    width: 1080,
    height: 1080,
    scaleY: 1080 / 1350,
  },
};

/**
 * Adjust a Y position from IG (1350px) canvas to another platform.
 * Elements in the top half stay roughly where they are.
 * Elements in the bottom area (counter, bottom icon) get scaled down.
 */
export function adjustYForPlatform(y: number, platform: Platform): number {
  if (platform === 'instagram') return y;
  // Scale Y proportionally but keep top elements more stable
  const config = PLATFORMS[platform];
  return Math.round(y * config.scaleY);
}
