import { Slide, Platform, ElementPosition } from '@/lib/types';
import { getPosition, getCanvasHeight, getFontSize } from '@/lib/slide-layout';
import GradientBackground from '../shared/GradientBackground';
import AuraicLogo from '../shared/AuraicLogo';
import SlideCounter from '../shared/SlideCounter';
import BottomIcon from '../shared/BottomIcon';
import DraggableElement from '../editor/DraggableElement';
import TextWithBreaks from '../shared/TextWithBreaks';

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

const DEFAULTS: Record<string, ElementPosition> = {
  logo: { x: 80, y: 273 },
  text: { x: 100, y: 435 },
  counter: { x: 100, y: 1181 },
  bottomIcon: { x: 880, y: 1150 },
};

export default function HookSlide({ slide, index, total, interactive, scale = 0.44, onPositionChange, onDragStart, platform = 'instagram' }: Props) {
  const pos = (key: string) => getPosition(key, DEFAULTS, slide, platform);
  const h = getCanvasHeight(platform);

  const wrap = (key: string, children: React.ReactNode) => {
    const p = pos(key);
    if (interactive && onPositionChange) {
      return (
        <DraggableElement elementKey={key} x={p.x} y={p.y} scale={scale} canvasHeight={h} onPositionChange={onPositionChange} onDragStart={onDragStart}>
          {children}
        </DraggableElement>
      );
    }
    return <div className="absolute z-10" style={{ left: p.x, top: p.y }}>{children}</div>;
  };

  return (
    <div
      className="relative w-[1080px] overflow-hidden"
      style={{ height: h, fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
    >
      <GradientBackground bgId={slide.bgId} />

      {wrap('logo', <AuraicLogo />)}

      {wrap('text',
        <div className="w-[880px] h-[480px] flex flex-col justify-center">
          <p className="font-medium text-white leading-[1.2]" style={{ fontSize: getFontSize(slide, platform, 100) }}>
            <TextWithBreaks text={slide.text.primary} />
          </p>
        </div>
      )}

      {wrap('counter', <SlideCounter current={index + 1} total={total} separator={slide.counterSeparator} />)}

      {wrap('bottomIcon', <BottomIcon type={slide.bottomIcon || 'arrow'} />)}
    </div>
  );
}

export { DEFAULTS as hookDefaults };
