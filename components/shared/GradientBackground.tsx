'use client';

import { useEffect, useRef } from 'react';
import { bgPresets } from '@/lib/backgrounds';

/**
 * Pure CSS gradient background with canvas grain overlay.
 * 30 presets from 3 sets (Aurora Drift, Deep Void, Violet Mesh).
 * No bitmap assets — instant rendering, zero pixelation.
 */

interface Props {
  bgId?: string; // preset id like "k1s1"
}

export default function GradientBackground({ bgId = 'k1s1' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preset = bgPresets.find((p) => p.id === bgId) || bgPresets[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(1080, 1350);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: preset.css }}
      />
      <canvas
        ref={canvasRef}
        width={1080}
        height={1350}
        className="absolute inset-0 pointer-events-none"
        style={{
          width: 1080,
          height: 1350,
          opacity: preset.grain,
          mixBlendMode: 'overlay',
        }}
      />
    </>
  );
}
