/* eslint-disable @next/next/no-img-element */

/**
 * Photorealistic MacBook Pro mockup.
 * Uses /macbook-mockup.png (4340×2860) as frame.
 * Screenshot overlaid on the screen area.
 *
 * Screen coordinates within the 4340×2860 source image:
 *   x: 370, y: 105, width: 3600, height: 2310
 *   Aspect ratio: ~1.558:1 (16:10.3 — real MacBook Pro)
 *
 * Ideal screenshot size: 1920×1233 or larger, 16:10 ratio.
 */

interface Props {
  image?: string;
  width?: number; // rendered width, default 820
}

// Screen area in the source PNG (4340×2860)
const SRC_W = 4340;
const SRC_H = 2860;
const SCREEN_X = 370;
const SCREEN_Y = 105;
const SCREEN_W = 3600;
const SCREEN_H = 2310;

export default function MacbookMockup({ image, width = 820 }: Props) {
  const scale = width / SRC_W;
  const totalH = SRC_H * scale;

  const sx = SCREEN_X * scale;
  const sy = SCREEN_Y * scale;
  const sw = SCREEN_W * scale;
  const sh = SCREEN_H * scale;

  return (
    <div style={{ position: 'relative', width, height: totalH }}>
      {/* Screenshot on screen */}
      {image ? (
        <img
          src={image}
          alt="Screenshot"
          style={{
            position: 'absolute',
            left: sx,
            top: sy,
            width: sw,
            height: sh,
            objectFit: 'cover',
            objectPosition: 'top center',
            borderRadius: scale * 40,
            zIndex: 1,
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            left: sx,
            top: sy,
            width: sw,
            height: sh,
            background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)',
            borderRadius: scale * 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.12)',
            fontSize: 14 * scale * 4,
            fontFamily: 'var(--font-poppins), Poppins, sans-serif',
            zIndex: 1,
          }}
        >
          Wgraj screenshot
        </div>
      )}

      {/* MacBook frame (on top of screenshot to cover edges) */}
      <img
        src="/macbook-mockup.png"
        alt=""
        style={{
          width,
          height: totalH,
          position: 'relative',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
