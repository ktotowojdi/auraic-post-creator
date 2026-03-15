'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Carousel, Slide, SlideType, Platform } from '@/lib/types';
import { createDefaultCarousel, defaultSlideByType } from '@/lib/templates';

const MAX_HISTORY = 100;

export function useCarousel(initialCarousel?: Carousel) {
  const [carousel, setCarousel] = useState<Carousel>(initialCarousel || createDefaultCarousel);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Undo/redo history
  const historyRef = useRef<Carousel[]>([]);
  const futureRef = useRef<Carousel[]>([]);
  const skipHistoryRef = useRef(false);

  // Push to history before every change
  const setCarouselWithHistory = useCallback((updater: (prev: Carousel) => Carousel) => {
    setCarousel((prev) => {
      const next = updater(prev);
      if (next === prev) return prev;
      if (!skipHistoryRef.current) {
        historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), prev];
        futureRef.current = [];
      }
      skipHistoryRef.current = false;
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const previous = historyRef.current[historyRef.current.length - 1];
    historyRef.current = historyRef.current.slice(0, -1);
    setCarousel((current) => {
      futureRef.current = [...futureRef.current, current];
      return previous;
    });
  }, []);

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current[futureRef.current.length - 1];
    futureRef.current = futureRef.current.slice(0, -1);
    setCarousel((current) => {
      historyRef.current = [...historyRef.current, current];
      return next;
    });
  }, []);

  const activeSlide = carousel.slides[activeSlideIndex] || carousel.slides[0];

  const updateSlide = useCallback((slideId: string, updates: Partial<Slide>) => {
    setCarouselWithHistory((prev) => ({
      ...prev,
      slides: prev.slides.map((s) => {
        if (s.id !== slideId) return s;
        // Deep merge platformOverrides
        if (updates.platformOverrides) {
          const merged = { ...s.platformOverrides };
          for (const [plat, overrides] of Object.entries(updates.platformOverrides)) {
            const key = plat as 'facebook' | 'linkedin';
            merged[key] = { ...merged[key], ...overrides };
          }
          return { ...s, ...updates, platformOverrides: merged };
        }
        return { ...s, ...updates };
      }),
    }));
  }, [setCarouselWithHistory]);

  const updateSlideText = useCallback(
    (slideId: string, textUpdates: Partial<Slide['text']>) => {
      setCarouselWithHistory((prev) => ({
        ...prev,
        slides: prev.slides.map((s) =>
          s.id === slideId ? { ...s, text: { ...s.text, ...textUpdates } } : s
        ),
      }));
    },
    [setCarouselWithHistory]
  );

  const addSlide = useCallback((type: SlideType = 'content-text') => {
    const newSlide = defaultSlideByType[type]();
    setCarouselWithHistory((prev) => ({
      ...prev,
      slides: [...prev.slides, newSlide],
    }));
    setActiveSlideIndex((prev) => prev + 1);
  }, [setCarouselWithHistory]);

  const removeSlide = useCallback(
    (slideId: string) => {
      setCarouselWithHistory((prev) => {
        const newSlides = prev.slides.filter((s) => s.id !== slideId);
        if (newSlides.length === 0) return prev;
        return { ...prev, slides: newSlides };
      });
      setActiveSlideIndex((prev) => Math.max(0, prev - 1));
    },
    [setCarouselWithHistory]
  );

  const duplicateSlide = useCallback(
    (slideId: string) => {
      setCarouselWithHistory((prev) => {
        const idx = prev.slides.findIndex((s) => s.id === slideId);
        if (idx === -1) return prev;
        const original = prev.slides[idx];
        const copy: Slide = {
          ...original,
          id: `slide-${Date.now()}-copy`,
          text: { ...original.text, listItems: original.text.listItems ? [...original.text.listItems] : undefined },
        };
        const newSlides = [...prev.slides];
        newSlides.splice(idx + 1, 0, copy);
        return { ...prev, slides: newSlides };
      });
      setActiveSlideIndex((prev) => prev + 1);
    },
    [setCarouselWithHistory]
  );

  const setTitle = useCallback((title: string) => {
    setCarouselWithHistory((prev) => ({ ...prev, title }));
  }, [setCarouselWithHistory]);

  // Call before starting a drag — saves current state to history once
  const saveSnapshot = useCallback(() => {
    setCarousel((current) => {
      historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), current];
      futureRef.current = [];
      return current;
    });
  }, []);

  const updateSlidePosition = useCallback(
    (slideId: string, elementKey: string, x: number, y: number, platform: Platform = 'instagram') => {
      // Skip history — drag positions are batched via saveSnapshot
      skipHistoryRef.current = true;
      setCarouselWithHistory((prev) => ({
        ...prev,
        slides: prev.slides.map((s) => {
          if (s.id !== slideId) return s;
          if (platform === 'instagram') {
            return { ...s, positions: { ...s.positions, [elementKey]: { x, y } } };
          }
          const existing = s.platformOverrides || {};
          const platOverrides = existing[platform] || {};
          const platPositions = platOverrides.positions || {};
          return {
            ...s,
            platformOverrides: {
              ...existing,
              [platform]: {
                ...platOverrides,
                positions: { ...platPositions, [elementKey]: { x, y } },
              },
            },
          };
        }),
      }));
    },
    [setCarouselWithHistory]
  );

  const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
    setCarouselWithHistory((prev) => {
      const slides = [...prev.slides];
      const [moved] = slides.splice(fromIndex, 1);
      slides.splice(toIndex, 0, moved);
      return { ...prev, slides };
    });
    setActiveSlideIndex(toIndex);
  }, [setCarouselWithHistory]);

  const replaceAllSlides = useCallback((slides: Slide[]) => {
    setCarouselWithHistory((prev) => ({ ...prev, slides }));
    setActiveSlideIndex(0);
  }, [setCarouselWithHistory]);

  // Refs for keyboard shortcut callbacks (stable dependency array)
  const activeSlideIdRef = useRef(activeSlide?.id);
  activeSlideIdRef.current = activeSlide?.id;
  const undoRef = useRef(undo);
  undoRef.current = undo;
  const redoRef = useRef(redo);
  redoRef.current = redo;
  const duplicateRef = useRef(duplicateSlide);
  duplicateRef.current = duplicateSlide;
  const removeRef = useRef(removeSlide);
  removeRef.current = removeSlide;

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !isTyping) {
        e.preventDefault();
        if (e.shiftKey) redoRef.current();
        else undoRef.current();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        if (activeSlideIdRef.current) duplicateRef.current(activeSlideIdRef.current);
      }

      if ((e.key === 'Backspace' || e.key === 'Delete') && !isTyping) {
        if (activeSlideIdRef.current) removeRef.current(activeSlideIdRef.current);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return {
    carousel,
    activeSlide,
    activeSlideIndex,
    setActiveSlideIndex,
    updateSlide,
    updateSlideText,
    addSlide,
    removeSlide,
    duplicateSlide,
    setTitle,
    replaceAllSlides,
    updateSlidePosition,
    reorderSlides,
    saveSnapshot,
    undo,
    redo,
  };
}
