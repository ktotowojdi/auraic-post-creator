/**
 * 3D-style icon using pure CSS + Lucide React SVG icons.
 * Infinitely scalable, zero pixelation. 1500+ icons available.
 */

import { IconColor } from '@/lib/types';
import { icons as lucideIconMap } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

const colorValues: Record<IconColor, { bg: string; light: string; shadow: string; iconColor: string }> = {
  purple: { bg: '#8a38f5', light: '#a855f7', shadow: '#5b21b6', iconColor: 'white' },
  green: { bg: '#22c55e', light: '#4ade80', shadow: '#15803d', iconColor: 'white' },
  red: { bg: '#ef4444', light: '#f87171', shadow: '#b91c1c', iconColor: 'white' },
  white: { bg: '#e8e8e8', light: '#ffffff', shadow: '#a0a0a0', iconColor: '#333333' },
  blue: { bg: '#3b82f6', light: '#60a5fa', shadow: '#1d4ed8', iconColor: 'white' },
  orange: { bg: '#f97316', light: '#fb923c', shadow: '#c2410c', iconColor: 'white' },
};

// Curated list of icons for the picker (grouped by category)
export const iconCategories: { label: string; icons: { name: string; label: string }[] }[] = [
  {
    label: 'Biznes',
    icons: [
      { name: 'TrendingUp', label: 'Wykres w górę' },
      { name: 'BarChart3', label: 'Wykres słupkowy' },
      { name: 'PieChart', label: 'Wykres kołowy' },
      { name: 'Target', label: 'Cel' },
      { name: 'Briefcase', label: 'Walizka' },
      { name: 'Building2', label: 'Budynek' },
      { name: 'HandCoins', label: 'Pieniądze' },
      { name: 'Wallet', label: 'Portfel' },
      { name: 'CreditCard', label: 'Karta' },
      { name: 'Receipt', label: 'Paragon' },
    ],
  },
  {
    label: 'Komunikacja',
    icons: [
      { name: 'MessageCircle', label: 'Czat' },
      { name: 'MessageSquare', label: 'Wiadomość' },
      { name: 'Mail', label: 'Email' },
      { name: 'Phone', label: 'Telefon' },
      { name: 'Send', label: 'Wyślij' },
      { name: 'Bell', label: 'Powiadomienie' },
      { name: 'Megaphone', label: 'Megafon' },
      { name: 'AtSign', label: 'At' },
      { name: 'Share2', label: 'Udostępnij' },
      { name: 'Globe', label: 'Świat' },
    ],
  },
  {
    label: 'Technologia',
    icons: [
      { name: 'Bot', label: 'Robot/AI' },
      { name: 'Cpu', label: 'Procesor' },
      { name: 'Smartphone', label: 'Telefon' },
      { name: 'Monitor', label: 'Monitor' },
      { name: 'Code2', label: 'Kod' },
      { name: 'Wifi', label: 'WiFi' },
      { name: 'Cloud', label: 'Chmura' },
      { name: 'Database', label: 'Baza danych' },
      { name: 'Settings', label: 'Ustawienia' },
      { name: 'Zap', label: 'Błyskawica' },
    ],
  },
  {
    label: 'Marketing',
    icons: [
      { name: 'Users', label: 'Użytkownicy' },
      { name: 'Heart', label: 'Serce' },
      { name: 'Star', label: 'Gwiazdka' },
      { name: 'ThumbsUp', label: 'Kciuk w górę' },
      { name: 'Eye', label: 'Oko' },
      { name: 'Search', label: 'Szukaj' },
      { name: 'Rocket', label: 'Rakieta' },
      { name: 'Award', label: 'Nagroda' },
      { name: 'Crown', label: 'Korona' },
      { name: 'Sparkles', label: 'Iskry' },
    ],
  },
  {
    label: 'Akcje',
    icons: [
      { name: 'Check', label: 'Ptaszek' },
      { name: 'X', label: 'Zamknij' },
      { name: 'Plus', label: 'Plus' },
      { name: 'ArrowRight', label: 'Strzałka' },
      { name: 'Download', label: 'Pobierz' },
      { name: 'Upload', label: 'Wyślij' },
      { name: 'RefreshCw', label: 'Odśwież' },
      { name: 'Lock', label: 'Kłódka' },
      { name: 'Shield', label: 'Tarcza' },
      { name: 'Clock', label: 'Zegar' },
    ],
  },
  {
    label: 'Numery',
    icons: [
      { name: 'Num1', label: '1' },
      { name: 'Num2', label: '2' },
      { name: 'Num3', label: '3' },
      { name: 'Num4', label: '4' },
      { name: 'Num5', label: '5' },
      { name: 'Num6', label: '6' },
      { name: 'Num7', label: '7' },
      { name: 'Num8', label: '8' },
      { name: 'Num9', label: '9' },
    ],
  },
  {
    label: 'Inne',
    icons: [
      { name: 'Calendar', label: 'Kalendarz' },
      { name: 'MapPin', label: 'Lokalizacja' },
      { name: 'Camera', label: 'Aparat' },
      { name: 'Image', label: 'Obrazek' },
      { name: 'FileText', label: 'Dokument' },
      { name: 'Clipboard', label: 'Schowek' },
      { name: 'Lightbulb', label: 'Żarówka' },
      { name: 'Palette', label: 'Paleta' },
      { name: 'Wrench', label: 'Klucz' },
      { name: 'Coffee', label: 'Kawa' },
    ],
  },
];

export const allIcons = iconCategories.flatMap((c) => c.icons);

function getLucideIcon(name: string): LucideIcon | null {
  return (lucideIconMap as Record<string, LucideIcon>)[name] || null;
}

interface Props {
  type: string;
  color?: IconColor;
  size?: number;
}

function getNumberFromType(type: string): string | null {
  const match = type.match(/^Num(\d)$/);
  return match ? match[1] : null;
}

export default function Icon3D({ type, color = 'purple', size = 256 }: Props) {
  if (!type || type === 'none') return null;

  const colors = colorValues[color];
  const number = getNumberFromType(type);
  const IconComponent = number ? null : getLucideIcon(type);
  if (!IconComponent && !number) return null;

  const borderRadius = size * 0.22;
  const iconSize = size * 0.45;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius,
        background: `linear-gradient(145deg, ${colors.light} 0%, ${colors.bg} 50%, ${colors.shadow} 100%)`,
        boxShadow: `
          0 ${size * 0.06}px ${size * 0.15}px rgba(0,0,0,0.3),
          inset 0 ${size * 0.02}px ${size * 0.04}px rgba(255,255,255,0.2),
          inset 0 -${size * 0.02}px ${size * 0.04}px rgba(0,0,0,0.15)
        `,
      }}
    >
      {number ? (
        <span
          style={{
            fontSize: iconSize * 1.2,
            fontWeight: 700,
            color: colors.iconColor,
            lineHeight: 1,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            fontFamily: 'var(--font-poppins), Poppins, sans-serif',
          }}
        >
          {number}
        </span>
      ) : (
        <IconComponent
          size={iconSize}
          color={colors.iconColor}
          strokeWidth={2}
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
        />
      )}
    </div>
  );
}
