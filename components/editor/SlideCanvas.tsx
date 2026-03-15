'use client';

import { Slide, Platform } from '@/lib/types';
import { PLATFORMS } from '@/lib/platforms';
import SlideRenderer from '../slides/SlideRenderer';

interface Props {
  slide: Slide;
  index: number;
  total: number;
  onPositionChange?: (key: string, x: number, y: number) => void;
  onDragStart?: () => void;
  platform?: Platform;
}

const SCALE = 0.44;

export default function SlideCanvas({ slide, index, total, onPositionChange, onDragStart, platform = 'instagram' }: Props) {
  const config = PLATFORMS[platform];
  const canvasW = config.width * SCALE;
  const canvasH = config.height * SCALE;

  return (
    <div className="flex items-center justify-center flex-1 bg-[#1a1a2e] overflow-hidden">
      <div
        style={{
          width: canvasW,
          height: canvasH,
          overflow: 'hidden',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            width: config.width,
            height: config.height,
            transform: `scale(${SCALE})`,
            transformOrigin: 'top left',
          }}
        >
          <SlideRenderer
            slide={slide}
            index={index}
            total={total}
            interactive={!!onPositionChange}
            scale={SCALE}
            onPositionChange={onPositionChange}
            onDragStart={onDragStart}
            platform={platform}
          />
        </div>
      </div>
    </div>
  );
}

export { SCALE };
