import { Slide, Platform } from '@/lib/types';
import { adaptSlideText } from '@/lib/text-adapt';
import HookSlide from './HookSlide';
import ContentIconSlide from './ContentIconSlide';
import ContentTextSlide from './ContentTextSlide';
import ListSlide from './ListSlide';
import CtaSlide from './CtaSlide';
import MockupSlide from './MockupSlide';

interface Props {
  slide: Slide;
  index: number;
  total: number;
  interactive?: boolean;
  scale?: number;
  onPositionChange?: (key: string, x: number, y: number) => void;
  onDragStart?: () => void;
  platform?: Platform;
}

export default function SlideRenderer({ slide, index, total, interactive, scale, onPositionChange, onDragStart, platform = 'instagram' }: Props) {
  let adaptedSlide = slide;

  if (platform !== 'instagram') {
    const overrides = slide.platformOverrides?.[platform];
    // Manual text overrides take priority, then auto-adapt from IG text
    const autoAdapted = adaptSlideText(slide.text, platform);
    adaptedSlide = {
      ...slide,
      text: {
        ...autoAdapted,
        primary: overrides?.textPrimary ?? autoAdapted.primary,
        secondary: overrides?.textSecondary !== undefined ? overrides.textSecondary : autoAdapted.secondary,
      },
    };
  }

  const props = { slide: adaptedSlide, index, total, interactive, scale, onPositionChange, onDragStart, platform };

  switch (slide.type) {
    case 'hook':
      return <HookSlide {...props} />;
    case 'content-icon':
      return <ContentIconSlide {...props} />;
    case 'content-text':
      return <ContentTextSlide {...props} />;
    case 'list':
      return <ListSlide {...props} />;
    case 'cta':
      return <CtaSlide {...props} />;
    case 'mockup':
      return <MockupSlide {...props} />;
    default:
      return <HookSlide {...props} />;
  }
}
