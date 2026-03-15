'use client';

import { useState } from 'react';
import { Slide, SlideType, IconColor, BottomIconType, ElementPosition, Platform } from '@/lib/types';
import { iconCategories } from '../shared/Icon3D';
import Icon3D from '../shared/Icon3D';
import { bgSets, bgPresets } from '@/lib/backgrounds';
import { PLATFORMS } from '@/lib/platforms';
import { getPosition as getPos, hasCustomPosition as hasCustomPos } from '@/lib/slide-layout';
import { adaptText } from '@/lib/text-adapt';
import { handleBoldShortcut } from '@/hooks/useTextFormatting';

function getDefaultFontSize(type: SlideType, field: 'primary' | 'secondary'): number {
  const defaults: Partial<Record<SlideType, { primary: number; secondary: number }>> = {
    hook: { primary: 100, secondary: 48 },
    'content-icon': { primary: 64, secondary: 48 },
    'content-text': { primary: 64, secondary: 48 },
    list: { primary: 64, secondary: 48 },
    cta: { primary: 72, secondary: 64 },
  };
  return defaults[type]?.[field] ?? 64;
}

const DEFAULT_POSITIONS: Partial<Record<SlideType, Record<string, ElementPosition>>> = {
  hook: { logo: { x: 80, y: 273 }, text: { x: 100, y: 435 }, counter: { x: 100, y: 1181 }, bottomIcon: { x: 880, y: 1150 } },
  'content-icon': { icon: { x: 413, y: 168 }, text: { x: 100, y: 675 }, counter: { x: 100, y: 1181 }, bottomIcon: { x: 880, y: 1150 } },
  'content-text': { text: { x: 100, y: 675 }, counter: { x: 100, y: 1181 }, bottomIcon: { x: 880, y: 1150 } },
  list: { text: { x: 100, y: 675 }, counter: { x: 100, y: 1181 }, bottomIcon: { x: 880, y: 1150 } },
  cta: { logo: { x: 80, y: 273 }, text: { x: 100, y: 435 }, counter: { x: 100, y: 1181 }, bottomIcon: { x: 880, y: 1150 } },
  mockup: { mockupImage: { x: 540, y: 675 }, counter: { x: 100, y: 1181 }, bottomIcon: { x: 880, y: 1150 } },
};

const ELEMENT_LABELS: Record<string, string> = {
  logo: 'Logo',
  icon: 'Ikona 3D',
  text: 'Tekst',
  counter: 'Kanter',
  bottomIcon: 'Ikona dolna',
  mockup: 'Mockup',
  mockupImage: 'Obrazek',
};

// Known element widths/heights for center calculation
const ELEMENT_SIZES: Record<string, { w: number; h: number }> = {
  logo: { w: 180, h: 98 },
  icon: { w: 256, h: 256 },
  text: { w: 880, h: 200 }, // approximate — text height varies
  counter: { w: 80, h: 38 },
  bottomIcon: { w: 100, h: 100 },
  mockup: { w: 860, h: 570 },
  mockupImage: { w: 800, h: 500 },
};

interface Props {
  slide: Slide;
  platform: Platform;
  onUpdateText: (slideId: string, text: Partial<Slide['text']>) => void;
  onUpdateSlide: (slideId: string, updates: Partial<Slide>) => void;
  onRemove: (slideId: string) => void;
  onDuplicate: (slideId: string) => void;
  onPositionChange: (key: string, x: number, y: number) => void;
}

const slideTypes: { value: SlideType; label: string }[] = [
  { value: 'hook', label: 'Hook' },
  { value: 'content-icon', label: 'Content + Ikona' },
  { value: 'content-text', label: 'Content (tekst)' },
  { value: 'list', label: 'Lista' },
  { value: 'cta', label: 'CTA' },
  { value: 'mockup', label: 'Mockup' },
];

export default function SlidePanel({ slide, platform, onUpdateText, onUpdateSlide, onRemove, onDuplicate, onPositionChange }: Props) {
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

  // Per-platform style read/write helpers
  const getStyleVal = (key: 'fontSize' | 'secondaryFontSize' | 'textGap'): number | undefined => {
    if (platform === 'instagram') return slide[key] ?? undefined;
    return slide.platformOverrides?.[platform]?.[key] ?? undefined;
  };

  // Read font size with auto-scaling for FB/LI
  const getPlatformFontSize = (key: 'fontSize' | 'secondaryFontSize', fallback: number): number => {
    if (platform === 'instagram') return slide[key] ?? fallback;
    const override = slide.platformOverrides?.[platform]?.[key];
    if (override != null) return override;
    const base = slide[key] ?? fallback;
    return key === 'fontSize' ? Math.round(base * 48 / 64) : Math.round(base * 32 / 48);
  };

  const setPlatformOverride = (key: string, value: string | number) => {
    if (platform === 'instagram') {
      onUpdateSlide(slide.id, { [key]: value });
    } else {
      const existing = slide.platformOverrides || {};
      const platOverrides = existing[platform] || {};
      onUpdateSlide(slide.id, {
        platformOverrides: {
          ...existing,
          [platform]: { ...platOverrides, [key]: value },
        },
      });
    }
  };

  const setStyleVal = (key: 'fontSize' | 'secondaryFontSize' | 'textGap', value: number) => {
    setPlatformOverride(key, value);
  };

  const defaults = DEFAULT_POSITIONS[slide.type] || {};
  const elementKeys = Object.keys(defaults);

  return (
    <div className="w-[320px] bg-[#12121f] border-l border-white/10 p-5 flex flex-col gap-5 overflow-y-auto">
      <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider">Właściwości slajdu</h3>

      {/* Template type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs">Typ szablonu</label>
        <select
          value={slide.type}
          onChange={(e) => onUpdateSlide(slide.id, { type: e.target.value as SlideType })}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
        >
          {slideTypes.map((t) => (
            <option key={t.value} value={t.value} className="bg-[#12121f]">
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mockup upload */}
      {slide.type === 'mockup' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs">Obrazek</label>
            {slide.mockupImage ? (
              <div className="flex flex-col gap-2">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.mockupImage} alt="mockup" className="w-full rounded-lg border border-white/10" />
                </div>
                <div className="flex gap-2">
                  <label className="flex-1 py-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-white/10 text-xs text-center cursor-pointer transition-colors">
                    Zmień
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => onUpdateSlide(slide.id, { mockupImage: reader.result as string });
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  <button
                    onClick={() => onUpdateSlide(slide.id, { mockupImage: undefined })}
                    className="flex-1 py-1.5 rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 text-xs transition-colors"
                  >
                    Usuń
                  </button>
                </div>
              </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-2 py-6 rounded-lg border-2 border-dashed border-white/15 hover:border-purple-400/40 cursor-pointer transition-colors">
              <span className="text-white/30 text-2xl">+</span>
              <span className="text-white/40 text-xs">Kliknij aby wgrać screenshot</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    onUpdateSlide(slide.id, { mockupImage: reader.result as string });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          )}
          </div>

          {/* Image width */}
          {slide.mockupImage && (
            <div className="flex flex-col gap-1.5">
              <label className="text-white/50 text-xs">Szerokość obrazka ({slide.mockupImageWidth || 800}px)</label>
              <input
                type="range"
                min={200}
                max={1500}
                step={10}
                value={slide.mockupImageWidth || 800}
                onChange={(e) => onUpdateSlide(slide.id, { mockupImageWidth: Number(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Primary text */}
      {slide.type !== 'mockup' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">Tekst główny</label>
          <textarea
            value={
              platform === 'instagram'
                ? slide.text.primary
                : (slide.platformOverrides?.[platform]?.textPrimary ?? adaptText(slide.text.primary, platform))
            }
            onChange={(e) => {
              if (platform === 'instagram') {
                onUpdateText(slide.id, { primary: e.target.value });
              } else {
                setPlatformOverride('textPrimary', e.target.value);
              }
            }}
            onKeyDown={(e) => handleBoldShortcut(e, (v) => {
              if (platform === 'instagram') onUpdateText(slide.id, { primary: v });
              else setPlatformOverride('textPrimary', v);
            })}
            rows={3}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-purple-400"
          />
        </div>
      )}

      {/* Secondary text */}
      {(slide.type === 'content-icon' || slide.type === 'cta' || slide.type === 'list') && (
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">Tekst secondary</label>
          <textarea
            value={
              platform === 'instagram'
                ? (slide.text.secondary || '')
                : (slide.platformOverrides?.[platform]?.textSecondary ?? adaptText(slide.text.secondary || '', platform))
            }
            onChange={(e) => {
              if (platform === 'instagram') {
                onUpdateText(slide.id, { secondary: e.target.value });
              } else {
                setPlatformOverride('textSecondary', e.target.value);
              }
            }}
            onKeyDown={(e) => handleBoldShortcut(e, (v) => {
              if (platform === 'instagram') onUpdateText(slide.id, { secondary: v });
              else setPlatformOverride('textSecondary', v);
            })}
            rows={2}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-purple-400"
          />
        </div>
      )}

      {/* Font sizes — per platform */}
      <div className="flex gap-2">
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-white/50 text-xs">Font główny (px)</label>
          <input
            type="number"
            value={getPlatformFontSize('fontSize', getDefaultFontSize(slide.type, 'primary'))}
            onChange={(e) => setStyleVal('fontSize', Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 w-full"
          />
        </div>
        {(slide.type === 'content-icon' || slide.type === 'cta' || slide.type === 'list') && (
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-white/50 text-xs">Font secondary (px)</label>
            <input
              type="number"
              value={getPlatformFontSize('secondaryFontSize', getDefaultFontSize(slide.type, 'secondary'))}
              onChange={(e) => setStyleVal('secondaryFontSize', Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 w-full"
            />
          </div>
        )}
      </div>

      {/* Spacing — per platform */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs">Odstęp tekstów (px)</label>
        <input
          type="number"
          value={getStyleVal('textGap') ?? 64}
          onChange={(e) => setStyleVal('textGap', Number(e.target.value))}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Bottom icon toggle */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs">Ikona dolna</label>
        <div className="flex gap-2">
          {([
            { value: 'arrow' as BottomIconType, label: 'Strzałka' },
            { value: 'bookmark' as BottomIconType, label: 'Bookmark' },
          ]).map((opt) => {
            const current = slide.bottomIcon || (slide.type === 'cta' ? 'bookmark' : 'arrow');
            return (
              <button
                key={opt.value}
                onClick={() => onUpdateSlide(slide.id, { bottomIcon: opt.value })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                  current === opt.value
                    ? 'bg-purple-500/20 text-purple-400 ring-1 ring-purple-400'
                    : 'bg-white/5 text-white/50 ring-1 ring-white/10 hover:bg-white/10'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background picker */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/50 text-xs">Tło slajdu</label>
        <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto bg-white/[0.02] rounded-lg p-2">
          {bgSets.map((set) => (
            <div key={set.id}>
              <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1 px-0.5">{set.name}</div>
              <div className="grid grid-cols-5 gap-1">
                {bgPresets.filter((p) => p.set === set.id).map((preset) => (
                  <button
                    key={preset.id}
                    title={`${set.name} — Slide ${preset.slide}`}
                    onClick={() => onUpdateSlide(slide.id, { bgId: preset.id })}
                    className={`h-[32px] rounded transition-all ${
                      (slide.bgId || 'k1s1') === preset.id
                        ? 'ring-2 ring-purple-400 scale-110'
                        : 'ring-1 ring-white/10 hover:ring-white/30'
                    }`}
                    style={{ background: preset.css }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Icon picker */}
      {slide.type === 'content-icon' && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs">Ikona</label>
            <button
              onClick={() => setIconPickerOpen(!iconPickerOpen)}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm hover:bg-white/10 transition-colors"
            >
              {slide.icon && slide.icon !== 'none' ? (
                <>
                  <Icon3D type={slide.icon} color={slide.iconColor || 'purple'} size={28} />
                  <span>{iconCategories.flatMap(c => c.icons).find(i => i.name === slide.icon)?.label || slide.icon}</span>
                </>
              ) : (
                <span className="text-white/40">Wybierz ikonę...</span>
              )}
            </button>

            {/* Icon grid picker */}
            {iconPickerOpen && (
              <div className="bg-[#1a1a30] border border-white/10 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                <button
                  onClick={() => { onUpdateSlide(slide.id, { icon: 'none' }); setIconPickerOpen(false); }}
                  className="w-full text-left text-xs text-white/40 hover:text-white/60 px-2 py-1 mb-2"
                >
                  Brak ikony
                </button>
                {iconCategories.map((cat) => (
                  <div key={cat.label} className="mb-3">
                    <div className="text-white/30 text-[10px] uppercase tracking-wider mb-1.5 px-1">{cat.label}</div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {cat.icons.map((icon) => (
                        <button
                          key={icon.name}
                          title={icon.label}
                          onClick={() => {
                            onUpdateSlide(slide.id, { icon: icon.name });
                            setIconPickerOpen(false);
                          }}
                          className={`flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                            slide.icon === icon.name
                              ? 'bg-purple-500/30 ring-1 ring-purple-400'
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <Icon3D type={icon.name} color={slide.iconColor || 'purple'} size={36} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Icon color */}
          <div className="flex flex-col gap-1.5">
            <label className="text-white/50 text-xs">Kolor ikony</label>
            <div className="flex gap-1 flex-wrap">
              {([
                { value: 'purple' as IconColor, color: '#8a38f5', label: 'Fiolet' },
                { value: 'green' as IconColor, color: '#22c55e', label: 'Zielony' },
                { value: 'red' as IconColor, color: '#ef4444', label: 'Czerwony' },
                { value: 'white' as IconColor, color: '#e8e8e8', label: 'Biała' },
                { value: 'blue' as IconColor, color: '#3b82f6', label: 'Niebieski' },
                { value: 'orange' as IconColor, color: '#f97316', label: 'Pomarańcz' },
              ]).map((c) => (
                <button
                  key={c.value}
                  onClick={() => onUpdateSlide(slide.id, { iconColor: c.value })}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                    (slide.iconColor || 'purple') === c.value
                      ? 'ring-2 ring-white/40'
                      : 'ring-1 ring-white/10'
                  }`}
                  style={{ backgroundColor: c.color + '30', color: c.color }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* List items */}
      {slide.type === 'list' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-white/50 text-xs">Punkty listy</label>
          {slide.text.listItems?.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => {
                  const newItems = [...(slide.text.listItems || [])];
                  newItems[i] = e.target.value;
                  onUpdateText(slide.id, { listItems: newItems });
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400"
              />
              <button
                onClick={() => {
                  const newItems = (slide.text.listItems || []).filter((_, j) => j !== i);
                  onUpdateText(slide.id, { listItems: newItems });
                }}
                className="text-red-400/60 hover:text-red-400 text-sm px-2"
              >
                x
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newItems = [...(slide.text.listItems || []), 'Nowy punkt'];
              onUpdateText(slide.id, { listItems: newItems });
            }}
            className="text-purple-400/60 hover:text-purple-400 text-xs text-left"
          >
            + Dodaj punkt
          </button>
        </div>
      )}

      {/* List item spacing */}
      {slide.type === 'list' && (
        <div className="flex gap-2">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-white/50 text-xs">Font listy (px)</label>
            <input
              type="number"
              value={getStyleVal('secondaryFontSize') ?? 48}
              onChange={(e) => setStyleVal('secondaryFontSize', Number(e.target.value))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 w-full"
            />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-white/50 text-xs">Gap listy (px)</label>
            <input
              type="number"
              value={slide.listItemGap ?? 24}
              onChange={(e) => onUpdateSlide(slide.id, { listItemGap: Number(e.target.value) })}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-400 w-full"
            />
          </div>
        </div>
      )}

      {/* Element positions */}
      <div className="flex flex-col gap-1.5">
        <label className="text-white/60 text-xs font-medium uppercase tracking-wider">Pozycje elementów</label>
        <div className="flex flex-col gap-2 bg-white/[0.02] rounded-lg p-2.5">
          {elementKeys.map((key) => {
            const pos = getPos(key, defaults, slide, platform);
            const def = defaults[key];
            const isCustom = hasCustomPos(key, slide, platform);
            const cW = PLATFORMS[platform].width;
            const cH = PLATFORMS[platform].height;
            return (
              <div key={key} className="flex items-center gap-1 flex-wrap">
                <span className="text-white/40 text-[10px] w-[48px] shrink-0">{ELEMENT_LABELS[key] || key}</span>
                <span className="text-white/30 text-[10px]">X</span>
                <input
                  type="number"
                  value={pos.x}
                  onChange={(e) => onPositionChange(key, Number(e.target.value), pos.y)}
                  className="bg-white/5 border border-white/10 rounded px-1.5 py-1 text-white text-[11px] w-[46px] focus:outline-none focus:border-purple-400"
                />
                <span className="text-white/30 text-[10px]">Y</span>
                <input
                  type="number"
                  value={pos.y}
                  onChange={(e) => onPositionChange(key, pos.x, Number(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded px-1.5 py-1 text-white text-[11px] w-[46px] focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => {
                    const elW = ELEMENT_SIZES[key]?.w || 100;
                    onPositionChange(key, Math.round((cW - elW) / 2), pos.y);
                  }}
                  className="text-white/25 hover:text-purple-400 text-[9px] px-1"
                  title="Centruj w poziomie"
                >
                  ↔
                </button>
                <button
                  onClick={() => {
                    const elH = ELEMENT_SIZES[key]?.h || 100;
                    onPositionChange(key, pos.x, Math.round((cH - elH) / 2));
                  }}
                  className="text-white/25 hover:text-purple-400 text-[9px] px-1"
                  title="Centruj w pionie"
                >
                  ↕
                </button>
                {isCustom && (
                  <button
                    onClick={() => onPositionChange(key, def.x, def.y)}
                    className="text-white/20 hover:text-white/50 text-[9px]"
                    title="Reset"
                  >
                    ↩
                  </button>
                )}
              </div>
            );
          })}

          {/* Center text group (H+V at once) */}
          {elementKeys.includes('text') && (
            <button
              onClick={() => {
                const cW = PLATFORMS[platform].width;
                const cH = PLATFORMS[platform].height;
                const textW = ELEMENT_SIZES.text.w;
                const textH = ELEMENT_SIZES.text.h;
                onPositionChange('text', Math.round((cW - textW) / 2), Math.round((cH - textH) / 2));
              }}
              className="mt-1 py-1.5 rounded bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 text-[10px] transition-colors"
            >
              Centruj tekst (H+V)
            </button>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-white/10">
        <button
          onClick={() => onDuplicate(slide.id)}
          className="flex-1 py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm transition-colors"
        >
          Duplikuj
        </button>
        <button
          onClick={() => onRemove(slide.id)}
          className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400/60 hover:bg-red-500/20 hover:text-red-400 text-sm transition-colors"
        >
          Usuń
        </button>
      </div>
    </div>
  );
}
