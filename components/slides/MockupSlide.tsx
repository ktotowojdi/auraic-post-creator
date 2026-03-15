/* eslint-disable @next/next/no-img-element */
import { Slide, Platform, ElementPosition } from '@/lib/types';
import { getPosition, getCanvasHeight } from '@/lib/slide-layout';
import GradientBackground from '../shared/GradientBackground';
import SlideCounter from '../shared/SlideCounter';
import BottomIcon from '../shared/BottomIcon';
import DraggableElement from '../editor/DraggableElement';

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
  mockupImage: { x: 540, y: 675 },
  counter: { x: 100, y: 1181 },
  bottomIcon: { x: 880, y: 1150 },
};

export default function MockupSlide({ slide, index, total, interactive, scale = 0.44, onPositionChange, onDragStart, platform = 'instagram' }: Props) {
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

  const imgPos = pos('mockupImage');
  const hasImage = !!slide.mockupImage;

  return (
    <div
      className="relative w-[1080px] overflow-hidden"
      style={{ height: h, fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
    >
      <GradientBackground bgId={slide.bgId} />

      {/* User-uploaded image — draggable, centered by default */}
      {hasImage && (
        interactive && onPositionChange ? (
          <DraggableElement elementKey="mockupImage" x={imgPos.x} y={imgPos.y} scale={scale} canvasHeight={h} onPositionChange={onPositionChange} onDragStart={onDragStart}>
            <img
              src={slide.mockupImage}
              alt=""
              style={{
                maxWidth: 'none',
                height: 'auto',
                width: slide.mockupImageWidth || 800,
                pointerEvents: 'none',
                transform: `translate(-50%, -50%)`,
              }}
            />
          </DraggableElement>
        ) : (
          <div className="absolute z-10" style={{ left: imgPos.x, top: imgPos.y }}>
            <img
              src={slide.mockupImage}
              alt=""
              style={{
                maxWidth: 'none',
                height: 'auto',
                width: slide.mockupImageWidth || 800,
                pointerEvents: 'none',
                transform: `translate(-50%, -50%)`,
              }}
            />
          </div>
        )
      )}

      {wrap('counter', <SlideCounter current={index + 1} total={total} separator={slide.counterSeparator} />)}
      {wrap('bottomIcon', <BottomIcon type={slide.bottomIcon || 'arrow'} />)}
    </div>
  );
}
