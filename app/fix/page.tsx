'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'auraic-projects';

export default function FixPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Naprawiam...');

  useEffect(() => {
    try {
      const projects = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const project = projects.find((p: { id: string }) => p.id === 'project-karuzela1-proces');
      if (!project) {
        setStatus('Nie znaleziono projektu');
        return;
      }

      const slides = project.carousel.slides;
      const contentPositions = {
        facebook: { positions: { text: { x: 100, y: 500 } } },
        linkedin: { positions: { text: { x: 100, y: 500 } } },
      };
      const bgSeq = ['k3s1', 'k3s2', 'k3s3', 'k3s4', 'k3s5', 'k3s6'];

      // Slide 0: hook
      if (slides[0]) {
        slides[0].fontSize = slides[0].fontSize || 80;
        slides[0].bgId = slides[0].bgId || bgSeq[0];
        slides[0].text.primary = 'Twoja strona nie musi powstawa\u0107 miesi\u0105cami.\n**Da si\u0119 to zrobi\u0107 szybciej i konkretniej** \uD83D\uDC47';
        slides[0].platformOverrides = {
          ...slides[0].platformOverrides,
          facebook: { ...(slides[0].platformOverrides?.facebook || {}), fontSize: 72 },
          linkedin: { ...(slides[0].platformOverrides?.linkedin || {}), fontSize: 76 },
        };
      }

      // Slide 1: content-icon
      if (slides[1]) {
        slides[1].fontSize = 64;
        slides[1].textGap = 32;
        slides[1].bgId = slides[1].bgId || bgSeq[1];
        slides[1].text.primary = '\uD83D\uDD04 Standardowy proces';
        slides[1].text.secondary = 'Research, teksty, makiety, poprawki, poprawki poprawek.\nI dalej \u201Eco\u015B nie gra\u201D.';
        slides[1].platformOverrides = {
          ...slides[1].platformOverrides,
          ...contentPositions,
        };
      }

      // Slide 2: list "U nas"
      if (slides[2]) {
        slides[2].fontSize = 64;
        slides[2].secondaryFontSize = 44;
        slides[2].bgId = slides[2].bgId || bgSeq[2];
        slides[2].text.primary = '\uD83C\uDFAF U nas:';
        slides[2].text.listItems = [
          'Najpierw dane i insighty',
          'Potem struktura',
          'Na ko\u0144cu design',
        ];
      }

      // Slide 3: list "Automatyzujemy"
      if (slides[3]) {
        slides[3].fontSize = 64;
        slides[3].secondaryFontSize = 44;
        slides[3].bgId = slides[3].bgId || bgSeq[3];
        slides[3].text.primary = '\u26A1 Automatyzujemy nud\u0119:';
      }

      // Slide 4: list "Efekt"
      if (slides[4]) {
        slides[4].fontSize = 64;
        slides[4].secondaryFontSize = 44;
        slides[4].bgId = slides[4].bgId || bgSeq[4];
        slides[4].text.primary = '\u2705 Efekt dla Ciebie:';
      }

      // Slide 5: cta
      if (slides[5]) {
        slides[5].bgId = slides[5].bgId || bgSeq[5];
        slides[5].text.primary = 'Chcesz zobaczy\u0107, jak wygl\u0105da taki proces krok po kroku? \uD83D\uDCA1';
        slides[5].text.secondary = 'Napisz \u201EPROCES\u201D w komentarzu \uD83D\uDC47\uD83C\uDFFB';
        slides[5].platformOverrides = {
          ...slides[5].platformOverrides,
          facebook: { ...(slides[5].platformOverrides?.facebook || {}), fontSize: 64 },
          linkedin: { ...(slides[5].platformOverrides?.linkedin || {}), fontSize: 64, secondaryFontSize: 64 },
        };
      }

      project.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      setStatus('Gotowe! Przekierowuj\u0119...');
      router.replace('/editor/project-karuzela1-proces');
    } catch (e) {
      setStatus('B\u0142\u0105d: ' + String(e));
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0d0d1a] text-white/40 text-sm">
      {status}
    </div>
  );
}
