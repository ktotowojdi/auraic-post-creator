'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

interface Props {
  elementKey: string;
  x: number;
  y: number;
  scale: number;
  canvasWidth?: number;
  canvasHeight?: number;
  onPositionChange: (key: string, x: number, y: number) => void;
  onDragStart?: () => void;
  children: React.ReactNode;
  className?: string;
}

const SNAP_THRESHOLD = 8; // px on canvas to snap to center

export default function DraggableElement({
  elementKey,
  x,
  y,
  scale,
  canvasWidth = 1080,
  canvasHeight = 1350,
  onPositionChange,
  onDragStart: onDragStartProp,
  children,
  className = '',
}: Props) {
  const [dragging, setDragging] = useState(false);
  const [elSize, setElSize] = useState({ w: 0, h: 0 });
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startMouseX: number;
    startMouseY: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Measure element size after mount
  useEffect(() => {
    if (!elRef.current) return;
    const w = elRef.current.offsetWidth;
    const h = elRef.current.offsetHeight;
    setElSize((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
  }, [x, y, children]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = (e.clientX - dragRef.current.startMouseX) / scale;
      const dy = (e.clientY - dragRef.current.startMouseY) / scale;
      let newX = Math.round(dragRef.current.startX + dx);
      let newY = Math.round(dragRef.current.startY + dy);

      // Snap to horizontal center
      const elW = elRef.current?.offsetWidth || 0;
      const elH = elRef.current?.offsetHeight || 0;
      const centerTargetX = Math.round((canvasWidth - elW) / 2);
      const centerTargetY = Math.round((canvasHeight - elH) / 2);

      if (Math.abs(newX - centerTargetX) < SNAP_THRESHOLD) newX = centerTargetX;
      if (Math.abs(newY - centerTargetY) < SNAP_THRESHOLD) newY = centerTargetY;

      onPositionChange(elementKey, newX, newY);
    },
    [elementKey, scale, onPositionChange, canvasWidth, canvasHeight]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
    dragRef.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onDragStartProp?.();
      dragRef.current = {
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startX: x,
        startY: y,
      };
      setDragging(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [x, y, handleMouseMove, handleMouseUp]
  );

  // Center detection
  const centerTargetX = Math.round((canvasWidth - elSize.w) / 2);
  const centerTargetY = Math.round((canvasHeight - elSize.h) / 2);
  const isCenteredH = elSize.w > 0 && x === centerTargetX;
  const isCenteredV = elSize.h > 0 && y === centerTargetY;

  return (
    <div
      ref={elRef}
      className={`absolute z-10 ${className}`}
      style={{
        left: x,
        top: y,
        cursor: dragging ? 'grabbing' : 'grab',
        outline: dragging ? '2px solid rgba(138,56,245,0.5)' : 'none',
        outlineOffset: 4,
      }}
      onMouseDown={handleMouseDown}
    >
      {children}

      {/* Position tooltip while dragging */}
      {dragging && (
        <div
          style={{
            position: 'absolute',
            top: -32,
            left: 0,
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            fontSize: 12,
            padding: '3px 8px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 100,
            fontFamily: 'monospace',
          }}
        >
          {x}, {y}
          {isCenteredH && <span style={{ color: '#a855f7', marginLeft: 6 }}>H</span>}
          {isCenteredV && <span style={{ color: '#a855f7', marginLeft: 4 }}>V</span>}
        </div>
      )}

      {/* Horizontal center guide line (full canvas width) */}
      {dragging && isCenteredH && (
        <div
          style={{
            position: 'absolute',
            left: -x,
            top: Math.round(elSize.h / 2) - 0.5,
            width: canvasWidth,
            height: 1,
            background: '#a855f7',
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: 99,
          }}
        />
      )}

      {/* Vertical center guide line (full canvas height) */}
      {dragging && isCenteredV && (
        <div
          style={{
            position: 'absolute',
            top: -y,
            left: Math.round(elSize.w / 2) - 0.5,
            width: 1,
            height: canvasHeight,
            background: '#a855f7',
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
}
