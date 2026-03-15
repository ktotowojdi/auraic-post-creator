export type SlideType = 'hook' | 'content-icon' | 'content-text' | 'cta' | 'list' | 'mockup';
export type IconType = string; // Lucide icon name or 'none'
export type IconColor = 'purple' | 'green' | 'red' | 'white' | 'blue' | 'orange';

export type BottomIconType = 'arrow' | 'bookmark';

export interface ElementPosition {
  x: number;
  y: number;
}

export interface SlideStyleOverrides {
  fontSize?: number;
  secondaryFontSize?: number;
  textGap?: number;
  positions?: Record<string, ElementPosition>;
  textPrimary?: string;
  textSecondary?: string;
}

export interface Slide {
  id: string;
  type: SlideType;
  text: {
    primary: string;
    secondary?: string;
    listItems?: string[];
  };
  icon?: IconType;
  iconColor?: IconColor;
  fontSize?: number;
  secondaryFontSize?: number;
  textGap?: number; // Instagram default
  textGapFacebook?: number;   // deprecated — use platformOverrides
  textGapLinkedin?: number;   // deprecated — use platformOverrides
  bgId?: string; // background preset id like "k1s1"
  counterSeparator?: string;
  bottomIcon?: BottomIconType;
  positions?: Record<string, ElementPosition>;
  listItemGap?: number; // spacing between list items (default 24)
  mockupImage?: string; // base64 data URL for mockup slide
  mockupImageWidth?: number; // rendered width of the image in px (default 800)
  platformOverrides?: {
    facebook?: SlideStyleOverrides;
    linkedin?: SlideStyleOverrides;
  };
}

export interface Carousel {
  id: string;
  title: string;
  slides: Slide[];
}

export type Platform = 'instagram' | 'facebook' | 'linkedin';

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  carousel: Carousel;
}
