import { Carousel, Slide, SlideType } from './types';

let counter = 0;
export function generateId(): string {
  return `slide-${Date.now()}-${counter++}`;
}

export const defaultSlideByType: Record<SlideType, () => Slide> = {
  hook: () => ({
    id: generateId(),
    type: 'hook',
    text: {
      primary: '80% klientów sprawdza Twoją stronę przed wizytą',
    },
  }),
  'content-icon': () => ({
    id: generateId(),
    type: 'content-icon',
    text: {
      primary: 'Chatbot odpowiada 24/7',
      secondary: 'Twoi klienci nie czekają — AI odpowiada na pytania w sekundę',
    },
    icon: 'MessageCircle',
    iconColor: 'purple',
  }),
  'content-text': () => ({
    id: generateId(),
    type: 'content-text',
    text: {
      primary: 'Nowoczesna strona to nie koszt — to inwestycja, która się zwraca',
    },
  }),
  list: () => ({
    id: generateId(),
    type: 'list',
    text: {
      primary: 'Co dostajesz?',
      listItems: [
        'Stronę dopasowaną do Twojej branży',
        'Automatyczne SMS-y po każdym zgłoszeniu',
        'Chatbot AI dostępny 24/7',
      ],
    },
  }),
  cta: () => ({
    id: generateId(),
    type: 'cta',
    text: {
      primary: 'Chcesz taką stronę?',
      secondary: 'Link w bio ⬆️',
    },
  }),
  mockup: () => ({
    id: generateId(),
    type: 'mockup',
    text: {
      primary: '',
    },
  }),
};

/** Carousel presets — quick start templates */
export const carouselPresets: { name: string; description: string; create: () => Carousel }[] = [
  {
    name: 'Edu z cyferkami',
    description: 'Hook → 5× content z ikonami Num1-Num5 → CTA',
    create: () => ({
      id: `carousel-${Date.now()}`,
      title: 'Nowa karuzela edukacyjna',
      slides: [
        { id: generateId(), type: 'hook', text: { primary: 'Tytuł karuzeli 👉🏻' }, platformOverrides: { facebook: { fontSize: 85 }, linkedin: { fontSize: 90 } } },
        { id: generateId(), type: 'content-icon', icon: 'Num1', iconColor: 'purple', text: { primary: '👁️ Punkt pierwszy', secondary: 'Opis punktu pierwszego.' }, fontSize: 64, textGap: 32, bgId: 'k1s2', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'content-icon', icon: 'Num2', iconColor: 'purple', text: { primary: '📞 Punkt drugi', secondary: 'Opis punktu drugiego.' }, fontSize: 64, textGap: 32, bgId: 'k1s3', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'content-icon', icon: 'Num3', iconColor: 'purple', text: { primary: '⭐ Punkt trzeci', secondary: 'Opis punktu trzeciego.' }, fontSize: 64, textGap: 32, bgId: 'k1s4', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'content-icon', icon: 'Num4', iconColor: 'purple', text: { primary: '📱 Punkt czwarty', secondary: 'Opis punktu czwartego.' }, fontSize: 64, textGap: 32, bgId: 'k1s5', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'content-icon', icon: 'Num5', iconColor: 'purple', text: { primary: '⚡ Punkt piąty', secondary: 'Opis punktu piątego.' }, fontSize: 64, textGap: 32, bgId: 'k1s6', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'cta', text: { primary: 'Chcesz wiedzieć więcej? 💡', secondary: 'Napisz „X" w komentarzu 👇🏻' }, platformOverrides: { facebook: { fontSize: 64 }, linkedin: { fontSize: 64, secondaryFontSize: 64 } } },
      ],
    }),
  },
  {
    name: 'Edu 3 punkty + lista',
    description: 'Hook \u2192 3\u00D7 content z Num1-Num3 \u2192 lista \u2192 CTA',
    create: () => ({
      id: `carousel-${Date.now()}`,
      title: 'Nowa karuzela 3+lista',
      slides: [
        { id: generateId(), type: 'hook', text: { primary: 'Tytu\u0142 karuzeli\n**Podtytu\u0142 bold** \uD83D\uDC47' }, bgId: 'k2s9', platformOverrides: { facebook: { fontSize: 85 }, linkedin: { fontSize: 90 } } },
        { id: generateId(), type: 'content-icon', icon: 'Num1', iconColor: 'purple', text: { primary: '\uD83D\uDCAC Punkt pierwszy', secondary: 'Opis punktu pierwszego.' }, fontSize: 64, textGap: 32, bgId: 'k2s2', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'content-icon', icon: 'Num2', iconColor: 'purple', text: { primary: '\u23F0 Punkt drugi', secondary: 'Opis punktu drugiego.' }, fontSize: 64, textGap: 32, bgId: 'k2s5', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'content-icon', icon: 'Num3', iconColor: 'purple', text: { primary: '\uD83E\uDD1D Punkt trzeci', secondary: 'Opis punktu trzeciego.' }, fontSize: 64, textGap: 32, bgId: 'k2s7', platformOverrides: { facebook: { positions: { text: { x: 100, y: 500 } } }, linkedin: { positions: { text: { x: 100, y: 500 } } } } },
        { id: generateId(), type: 'list', text: { primary: 'Podsumowanie:', listItems: ['Element 1', 'Element 2', 'Element 3'] }, fontSize: 64, secondaryFontSize: 44, bgId: 'k2s1' },
        { id: generateId(), type: 'cta', text: { primary: 'CTA pytanie \uD83D\uDCA1', secondary: 'Napisz \u201eX\u201D w komentarzu \uD83D\uDC47\uD83C\uDFFB' }, bgId: 'k2s9', platformOverrides: { facebook: { fontSize: 64 }, linkedin: { fontSize: 64, secondaryFontSize: 64 } } },
      ],
    }),
  },
];

export function createDefaultCarousel() {
  return carouselPresets[0].create();
}
