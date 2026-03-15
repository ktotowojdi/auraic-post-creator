'use client';

import { useState, useRef } from 'react';
import { Slide, SlideType } from '@/lib/types';
import SlideRenderer from '../slides/SlideRenderer';

interface Props {
  slides: Slide[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: (type: SlideType) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const addOptions: { value: SlideType; label: string }[] = [
  { value: 'hook', label: 'Hook' },
  { value: 'content-icon', label: 'Ikona + tekst' },
  { value: 'content-text', label: 'Tekst' },
  { value: 'list', label: 'Lista' },
  { value: 'cta', label: 'CTA' },
  { value: 'mockup', label: 'Mockup' },
];

export default function SlideThumbnailStrip({ slides, activeIndex, onSelect, onAdd, onReorder }: Props) {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragRef.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(index);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = dragRef.current;
    if (fromIndex !== null && fromIndex !== toIndex) {
      onReorder(fromIndex, toIndex);
    }
    setDragIndex(null);
    setDropTarget(null);
    dragRef.current = null;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropTarget(null);
    dragRef.current = null;
  };

  return (
    <div className="w-[160px] bg-[#12121f] border-r border-white/10 flex flex-col gap-3 p-3 overflow-y-auto">
      {slides.map((slide, i) => (
        <button
          key={slide.id}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          onClick={() => onSelect(i)}
          className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
            i === activeIndex ? 'border-purple-400' : 'border-transparent hover:border-white/20'
          } ${dragIndex === i ? 'opacity-40' : ''} ${dropTarget === i && dragIndex !== i ? 'border-purple-400/50' : ''}`}
        >
          {/* Drop indicator line */}
          {dropTarget === i && dragIndex !== null && dragIndex !== i && (
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-purple-400 z-20 rounded-t" />
          )}
          <div
            className="origin-top-left"
            style={{
              width: 1080,
              height: 1350,
              transform: 'scale(0.12)',
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          >
            <SlideRenderer slide={slide} index={i} total={slides.length} />
          </div>
          <div
            style={{ width: 1080 * 0.12, height: 1350 * 0.12 }}
            className="relative"
          />
          <span className="absolute bottom-1 right-1 text-[10px] text-white/60 bg-black/40 rounded px-1">
            {i + 1}
          </span>
        </button>
      ))}

      {/* Add slide with type picker */}
      <div className="relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center justify-center w-full h-[48px] rounded-lg border-2 border-dashed border-white/20 text-white/40 hover:border-white/40 hover:text-white/60 transition-colors text-xl"
        >
          +
        </button>
        {showAddMenu && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a30] border border-white/10 rounded-lg overflow-hidden z-50 shadow-xl">
            {addOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onAdd(opt.value);
                  setShowAddMenu(false);
                }}
                className="block w-full px-3 py-2 text-left text-xs text-white/70 hover:bg-white/5 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
