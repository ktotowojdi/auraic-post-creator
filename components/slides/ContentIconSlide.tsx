import { Slide, Platform, ElementPosition } from '@/lib/types';
import { getPosition, getCanvasHeight, getTextGap, getFontSize, getSecondaryFontSize, hasCustomPosition } from '@/lib/slide-layout';
import GradientBackground from '../shared/GradientBackground';
import SlideCounter from '../shared/SlideCounter';
import BottomIcon from '../shared/BottomIcon';
import Icon3D from '../shared/Icon3D';
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
  icon: { x: 413, y: 168 },
  text: { x: 100, y: 675 },
  counter: { x: 100, y: 1181 },
  bottomIcon: { x: 880, y: 1150 },
};

export default function ContentIconSlide({ slide, index, total, interactive, scale = 0.44, onPositionChange, onDragStart, platform = 'instagram' }: Props) {
  const hasIcon = slide.icon && slide.icon !== 'none';
  const pos = (key: string) => getPosition(key, DEFAULTS, slide, platform);
  const h = getCanvasHeight(platform);
  const hasCustomTextPos = hasCustomPosition('text', slide, platform);
  const textPos = pos('text');
  const gap = getTextGap(slide, platform, 32);

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

      {hasIcon && wrap('icon', <Icon3D type={slide.icon!} color={slide.iconColor || 'purple'} size={256} />)}

      {/* Text — always CSS centered unless user set custom position */}
      <div
        className="absolute w-[880px] flex flex-col items-center text-center z-10"
        style={
          hasCustomTextPos
            ? { left: textPos.x, top: textPos.y, gap }
            : { left: 100, top: '50%', transform: 'translateY(calc(-50% + 40px))', gap }
        }
      >
        <p className="font-bold text-white w-full leading-[1.2]" style={{ fontSize: getFontSize(slide, platform, 64) }}>
          <TextWithBreaks text={slide.text.primary} />
        </p>
        {slide.text.secondary && (
          <p className="w-full leading-[1.8]" style={{ fontSize: getSecondaryFontSize(slide, platform, 48), color: 'rgba(255,255,255,0.8)' }}>
            <TextWithBreaks text={slide.text.secondary} />
          </p>
        )}
      </div>

      {wrap('counter', <SlideCounter current={index + 1} total={total} separator={slide.counterSeparator} />)}
      {wrap('bottomIcon', <BottomIcon type={slide.bottomIcon || 'arrow'} />)}
    </div>
  );
}
