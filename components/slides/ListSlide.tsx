import { Slide, Platform, ElementPosition } from '@/lib/types';
import { getPosition, getCanvasHeight, getTextGap, getFontSize, getSecondaryFontSize, hasCustomPosition } from '@/lib/slide-layout';
import GradientBackground from '../shared/GradientBackground';
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
  text: { x: 100, y: 675 },
  counter: { x: 100, y: 1181 },
  bottomIcon: { x: 880, y: 1150 },
};

export default function ListSlide({ slide, index, total, interactive, scale = 0.44, onPositionChange, onDragStart, platform = 'instagram' }: Props) {
  const pos = (key: string) => getPosition(key, DEFAULTS, slide, platform);
  const h = getCanvasHeight(platform);
  const hasCustomTextPos = hasCustomPosition('text', slide, platform);
  const textPos = pos('text');
  const gap = getTextGap(slide, platform, 80);

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

      {/* Text — always CSS centered unless user set custom position */}
      <div
        className="absolute z-10"
        style={
          hasCustomTextPos
            ? { left: textPos.x, top: textPos.y }
            : { left: 100, top: '50%', transform: 'translateY(-50%)' }
        }
      >
        <div className="w-[880px] flex flex-col items-start text-white" style={{ gap }}>
          <p className="font-bold w-full leading-[1.4]" style={{ fontSize: getFontSize(slide, platform, 64) }}>
            <TextWithBreaks text={slide.text.primary} />
          </p>
          {slide.text.secondary && (
            <p className="w-full leading-[1.6]" style={{ fontSize: getSecondaryFontSize(slide, platform, 48), color: 'rgba(255,255,255,0.75)' }}>
              <TextWithBreaks text={slide.text.secondary} />
            </p>
          )}
          {slide.text.listItems && slide.text.listItems.length > 0 && (
            <div className="font-medium w-full flex flex-col" style={{ fontSize: getSecondaryFontSize(slide, platform, 48), gap: slide.listItemGap ?? 24 }}>
              {slide.text.listItems.map((item, i) => (
                <div key={i} className="flex items-start" style={{ gap: 24 }}>
                  <span className="shrink-0" style={{ color: 'rgba(255,255,255,0.4)' }}>—</span>
                  <span style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {wrap('counter', <SlideCounter current={index + 1} total={total} separator={slide.counterSeparator} />)}
      {wrap('bottomIcon', <BottomIcon type={slide.bottomIcon || 'arrow'} />)}
    </div>
  );
}
