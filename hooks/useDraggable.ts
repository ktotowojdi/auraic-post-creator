'use client';

import { useCallback, useRef, useState } from 'react';

interface UseDraggableReturn {
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent, elementKey: string) => void;
}

export function useDraggable(
  scale: number,
  onPositionChange: (elementKey: string, x: number, y: number) => void
): UseDraggableReturn {
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{
    key: string;
    startMouseX: number;
    startMouseY: number;
    startElemX: number;
    startElemY: number;
  } | null>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.current) return;
      const { key, startMouseX, startMouseY, startElemX, startElemY } = dragState.current;
      const dx = (e.clientX - startMouseX) / scale;
      const dy = (e.clientY - startMouseY) / scale;
      const newX = Math.round(startElemX + dx);
      const newY = Math.round(startElemY + dy);
      onPositionChange(key, newX, newY);
    },
    [scale, onPositionChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragState.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, elementKey: string) => {
      e.preventDefault();
      e.stopPropagation();

      // Get current position from the element's style
      const el = e.currentTarget as HTMLElement;
      const currentLeft = parseFloat(el.style.left) || 0;
      const currentTop = parseFloat(el.style.top) || 0;

      dragState.current = {
        key: elementKey,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startElemX: currentLeft,
        startElemY: currentTop,
      };
      setIsDragging(true);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  return { isDragging, handleMouseDown };
}
