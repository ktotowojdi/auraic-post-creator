'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useCarousel } from '@/hooks/useCarousel';
import { Slide, SlideType, Project, Platform } from '@/lib/types';
import { generateId } from '@/lib/templates';
import { saveProject } from '@/lib/storage';
import { PLATFORMS } from '@/lib/platforms';
import SlideCanvas from './SlideCanvas';
import SlideThumbnailStrip from './SlideThumbnailStrip';
import SlidePanel from './SlidePanel';
import SlideRenderer from '../slides/SlideRenderer';

interface Props {
  project: Project;
}

export default function Editor({ project }: Props) {
  const {
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
  } = useCarousel(project.carousel);

  const [aiModal, setAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiCategory, setAiCategory] = useState('educational');
  const [aiLoading, setAiLoading] = useState(false);
  const [exportMenu, setExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [platform, setPlatform] = useState<Platform>('instagram');

  const hiddenRenderRef = useRef<HTMLDivElement>(null);
  const hiddenIgRef = useRef<HTMLDivElement>(null);
  const hiddenFbRef = useRef<HTMLDivElement>(null);
  const hiddenLiRef = useRef<HTMLDivElement>(null);

  // Auto-save on every carousel change
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveProject({
        ...project,
        title: carousel.title,
        carousel,
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [carousel, project]);

  const handleGenerateAI = useCallback(async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/generate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, category: aiCategory }),
      });
      const data = await res.json();
      if (data.slides) {
        const newSlides: Slide[] = data.slides.map((s: { type: SlideType; primary: string; secondary?: string; listItems?: string[]; icon?: string }) => ({
          id: generateId(),
          type: s.type,
          text: {
            primary: s.primary,
            secondary: s.secondary,
            listItems: s.listItems,
          },
          icon: s.icon || undefined,
        }));
        replaceAllSlides(newSlides);
        setTitle(aiTopic);
        setAiModal(false);
        setAiTopic('');
      }
    } catch (err) {
      console.error('AI generation failed:', err);
    } finally {
      setAiLoading(false);
    }
  }, [aiTopic, aiCategory, replaceAllSlides, setTitle]);

  const getExportElements = useCallback((): HTMLElement[] => {
    if (!hiddenRenderRef.current) return [];
    return Array.from(hiddenRenderRef.current.children) as HTMLElement[];
  }, []);

  const handleExportPng = useCallback(async () => {
    setExporting(true);
    setExportMenu(false);
    try {
      const { exportAllSlidesToZip } = await import('@/lib/export-png');
      const elements = getExportElements();
      if (elements.length === 0) return;
      const exportName = `${carousel.title}_${platform}`;
      const blob = await exportAllSlidesToZip(elements, exportName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PNG export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [carousel.title, getExportElements]);

  const handleExportAllPng = useCallback(async () => {
    setExporting(true);
    setExportMenu(false);
    try {
      const { exportAllSlidesToZip } = await import('@/lib/export-png');
      const JSZip = (await import('jszip')).default;
      const masterZip = new JSZip();

      const refs: { label: string; ref: React.RefObject<HTMLDivElement | null>; }[] = [
        { label: 'instagram', ref: hiddenIgRef },
        { label: 'facebook', ref: hiddenFbRef },
        { label: 'linkedin', ref: hiddenLiRef },
      ];

      for (const { label, ref } of refs) {
        if (!ref.current) continue;
        const elements = Array.from(ref.current.children) as HTMLElement[];
        if (elements.length === 0) continue;
        const blob = await exportAllSlidesToZip(elements, `${carousel.title}_${label}`);
        masterZip.file(`${label}.zip`, blob);
      }

      const masterBlob = await masterZip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(masterBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${carousel.title}_all_platforms.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export all failed:', err);
    } finally {
      setExporting(false);
    }
  }, [carousel.title]);

  const handleExportPdf = useCallback(async () => {
    setExporting(true);
    setExportMenu(false);
    try {
      const { exportSlidesToPdf } = await import('@/lib/export-pdf');
      const elements = getExportElements();
      if (elements.length === 0) return;
      const exportName = `${carousel.title}_${platform}`;
      const blob = await exportSlidesToPdf(elements, exportName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${exportName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  }, [carousel.title, getExportElements]);

  return (
    <div className="flex flex-col h-screen bg-[#0d0d1a] text-white">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-5 py-3 bg-[#12121f] border-b border-white/10">
        <a
          href="/"
          className="text-white/40 hover:text-white/70 text-sm transition-colors mr-1"
          title="Wróć do projektów"
        >
          ←
        </a>
        <input
          value={carousel.title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-white font-medium text-lg focus:outline-none border-b border-transparent focus:border-purple-400 px-1"
        />
        <span className="text-white/20 text-xs">auto-save</span>
        <div className="flex-1" />
        <button
          onClick={() => setAiModal(true)}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors"
        >
          Generuj z AI
        </button>
        <div className="relative">
          <button
            onClick={() => setExportMenu(!exportMenu)}
            disabled={exporting}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {exporting ? 'Eksportuję...' : `Eksport (${PLATFORMS[platform].label}) ▾`}
          </button>
          {exportMenu && (
            <div className="absolute right-0 top-full mt-1 bg-[#1a1a30] border border-white/10 rounded-lg overflow-hidden z-50 shadow-xl">
              <button
                onClick={handleExportPng}
                className="block w-full px-5 py-2.5 text-left text-sm hover:bg-white/5 transition-colors"
              >
                PNG — {PLATFORMS[platform].label}
              </button>
              <button
                onClick={handleExportPdf}
                className="block w-full px-5 py-2.5 text-left text-sm hover:bg-white/5 transition-colors"
              >
                PDF — {PLATFORMS[platform].label}
              </button>
              <div className="border-t border-white/10" />
              <button
                onClick={handleExportAllPng}
                className="block w-full px-5 py-2.5 text-left text-sm hover:bg-white/5 transition-colors text-purple-400"
              >
                PNG — Wszystkie platformy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <SlideThumbnailStrip
          slides={carousel.slides}
          activeIndex={activeSlideIndex}
          onSelect={setActiveSlideIndex}
          onAdd={addSlide}
          onReorder={reorderSlides}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Platform tabs */}
          <div className="flex items-center gap-1 px-4 pt-3 bg-[#1a1a2e]">
            {(Object.values(PLATFORMS) as { id: Platform; label: string }[]).map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors ${
                  platform === p.id
                    ? 'bg-[#1a1a2e] text-white border border-white/10 border-b-transparent -mb-px relative z-10'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                {p.label}
                {p.id !== 'instagram' && (
                  <span className="ml-1.5 text-[9px] text-white/25">1080x{PLATFORMS[p.id].height}</span>
                )}
              </button>
            ))}
          </div>
          <SlideCanvas
            slide={activeSlide}
            index={activeSlideIndex}
            total={carousel.slides.length}
            onPositionChange={(key, x, y) => updateSlidePosition(activeSlide.id, key, x, y, platform)}
            onDragStart={saveSnapshot}
            platform={platform}
          />
        </div>

        <SlidePanel
          slide={activeSlide}
          platform={platform}
          onUpdateText={updateSlideText}
          onUpdateSlide={updateSlide}
          onRemove={removeSlide}
          onDuplicate={duplicateSlide}
          onPositionChange={(key, x, y) => updateSlidePosition(activeSlide.id, key, x, y, platform)}
        />
      </div>

      {/* Hidden full-size renders for export */}
      <div ref={hiddenRenderRef} className="fixed" style={{ left: '-9999px', top: '-9999px' }}>
        {carousel.slides.map((slide, i) => (
          <div key={slide.id} style={{ width: PLATFORMS[platform].width, height: PLATFORMS[platform].height }}>
            <SlideRenderer slide={slide} index={i} total={carousel.slides.length} platform={platform} />
          </div>
        ))}
      </div>
      {/* Hidden renders for all platforms (used by Export All) */}
      <div ref={hiddenIgRef} className="fixed" style={{ left: '-9999px', top: '-9999px' }}>
        {carousel.slides.map((slide, i) => (
          <div key={slide.id} style={{ width: 1080, height: 1350 }}>
            <SlideRenderer slide={slide} index={i} total={carousel.slides.length} platform="instagram" />
          </div>
        ))}
      </div>
      <div ref={hiddenFbRef} className="fixed" style={{ left: '-9999px', top: '-9999px' }}>
        {carousel.slides.map((slide, i) => (
          <div key={slide.id} style={{ width: 1080, height: 1080 }}>
            <SlideRenderer slide={slide} index={i} total={carousel.slides.length} platform="facebook" />
          </div>
        ))}
      </div>
      <div ref={hiddenLiRef} className="fixed" style={{ left: '-9999px', top: '-9999px' }}>
        {carousel.slides.map((slide, i) => (
          <div key={slide.id} style={{ width: 1080, height: 1080 }}>
            <SlideRenderer slide={slide} index={i} total={carousel.slides.length} platform="linkedin" />
          </div>
        ))}
      </div>

      {/* AI Modal */}
      {aiModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a30] rounded-2xl p-6 w-[440px] border border-white/10">
            <h2 className="text-lg font-semibold mb-4">Generuj treści z AI</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs">Temat karuzeli</label>
                <input
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="np. Chatbot na stronie firmy"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-white/50 text-xs">Kategoria</label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="educational" className="bg-[#1a1a30]">Edukacyjny</option>
                  <option value="social-proof" className="bg-[#1a1a30]">Social Proof</option>
                  <option value="behind-the-scenes" className="bg-[#1a1a30]">Behind the Scenes</option>
                  <option value="offer" className="bg-[#1a1a30]">Oferta</option>
                </select>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setAiModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm transition-colors"
                >
                  Anuluj
                </button>
                <button
                  onClick={handleGenerateAI}
                  disabled={aiLoading || !aiTopic.trim()}
                  className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {aiLoading ? 'Generuję...' : 'Generuj'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
