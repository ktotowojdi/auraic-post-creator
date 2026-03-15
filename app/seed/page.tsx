'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STORAGE_KEY = 'auraic-projects';

function id() { return 's-' + Math.random().toString(36).slice(2, 9); }

const PROJECTS = [
  {
    id: 'edu-1-' + Date.now(),
    title: '5 rzeczy, które klient sprawdza na Twojej stronie',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    carousel: {
      id: 'c-edu1',
      title: '5 rzeczy, które klient sprawdza na Twojej stronie',
      slides: [
        { id: id(), type: 'hook', text: { primary: 'Zanim klient do Ciebie zadzwoni,\nsprawdza 5 rzeczy na Twojej stronie.' } },
        { id: id(), type: 'content-icon', icon: 'Eye', iconColor: 'purple', text: { primary: '1. Pierwsze wrażenie', secondary: 'Masz 3 sekundy. Jeśli strona wygląda przestarzale — zamyka kartę.' } },
        { id: id(), type: 'content-icon', icon: 'Phone', iconColor: 'green', text: { primary: '2. Dane kontaktowe', secondary: 'Numer telefonu, adres, godziny otwarcia.\nJeśli musi ich szukać — odchodzi.' } },
        { id: id(), type: 'content-icon', icon: 'Star', iconColor: 'purple', text: { primary: '3. Opinie innych', secondary: 'Recenzje, realizacje, logo klientów.\nSocial proof buduje zaufanie szybciej niż tekst.' } },
        { id: id(), type: 'content-icon', icon: 'Smartphone', iconColor: 'red', text: { primary: '4. Wygląd na telefonie', secondary: '70% ruchu to mobile.\nJeśli strona się rozjeżdża — tracisz większość klientów.' } },
        { id: id(), type: 'content-icon', icon: 'Zap', iconColor: 'green', text: { primary: '5. Szybkość ładowania', secondary: 'Każda sekunda opóźnienia = 7% mniej konwersji.\nWolna strona to stracone pieniądze.' } },
        { id: id(), type: 'cta', text: { primary: 'Chcesz wiedzieć, jak Twoja strona wypada w tych 5 punktach?', secondary: 'Napisz \u201eAUDYT\u201d w komentarzu.' } },
      ],
    },
  },
  {
    id: 'edu-2-' + Date.now(),
    title: 'Dlaczego Twoja strona nie generuje zapytań',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    carousel: {
      id: 'c-edu2',
      title: 'Dlaczego Twoja strona nie generuje zapytań',
      slides: [
        { id: id(), type: 'hook', text: { primary: 'Masz stronę, ale telefon nie dzwoni?\nPrawdopodobnie popełniasz jeden z tych błędów.' } },
        { id: id(), type: 'content-text', text: { primary: 'Brak jasnego wezwania do działania.\n\n\u201eZadzwoń\u201d, \u201eWyślij zapytanie\u201d, \u201eUmów wizytę\u201d — klient musi wiedzieć, co ma zrobić.' } },
        { id: id(), type: 'content-text', text: { primary: 'Za dużo tekstu, za mało konkretu.\n\nNikt nie czyta ścian tekstu. Klient skanuje stronę w 5 sekund.' } },
        { id: id(), type: 'content-text', text: { primary: 'Strona nie mówi, czym się wyróżniasz.\n\nJeśli Twoja oferta wygląda jak każda inna — klient wybierze tańszą opcję.' } },
        { id: id(), type: 'list', text: { primary: 'Strona, która sprzedaje:', listItems: ['Ma jeden jasny cel na każdej podstronie', 'Pokazuje efekty, nie tylko usługi', 'Ułatwia kontakt — nie utrudnia'] }, secondaryFontSize: 44 },
        { id: id(), type: 'cta', text: { primary: 'Chcesz zobaczyć, co konkretnie poprawić na Twojej stronie?', secondary: 'Napisz \u201eANALIZA\u201d w komentarzu.' } },
      ],
    },
  },
  {
    id: 'edu-3-' + Date.now(),
    title: 'Formularz vs chatbot — co lepiej konwertuje',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    carousel: {
      id: 'c-edu3',
      title: 'Formularz vs chatbot — co lepiej konwertuje',
      slides: [
        { id: id(), type: 'hook', text: { primary: 'Formularz kontaktowy czy chatbot?\nOdpowiedź Cię zaskoczy.' } },
        { id: id(), type: 'content-icon', icon: 'MessageCircle', iconColor: 'purple', text: { primary: 'Chatbot odpowiada w 2 sekundy.', secondary: 'Formularz? Średnio 24 godziny.\nKlient, który czeka — szuka dalej.' } },
        { id: id(), type: 'content-icon', icon: 'Clock', iconColor: 'red', text: { primary: 'Formularz działa 8h dziennie.', secondary: 'Chatbot działa 24/7.\n60% zapytań przychodzi po godzinach pracy.' } },
        { id: id(), type: 'content-text', text: { primary: 'Ale formularz nie jest zły.\nNajlepsze strony mają jedno i drugie.\n\nChatbot na szybkie pytania.\nFormularz na szczegółowe zapytania.' } },
        { id: id(), type: 'list', text: { primary: 'Idealne połączenie:', listItems: ['Chatbot AI na pytania typu \u201eile kosztuje\u201d', 'Formularz na wyceny i zamówienia', 'SMS do właściciela po każdym zgłoszeniu'] }, secondaryFontSize: 44 },
        { id: id(), type: 'cta', text: { primary: 'Chcesz zobaczyć, jak chatbot mógłby wyglądać na Twojej stronie?', secondary: 'Napisz \u201eCHATBOT\u201d w komentarzu.' } },
      ],
    },
  },
];

export default function SeedPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Tworzę projekty...');

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      let added = 0;
      for (const project of PROJECTS) {
        if (!existing.find((p: { id: string }) => p.id === project.id)) {
          existing.push(project);
          added++;
        }
      }
      if (added > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      }
      setStatus(`Dodano ${added} projektów. Przekierowuję...`);
      router.replace('/');
    } catch (e) {
      setStatus('Błąd: ' + String(e));
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0d0d1a] text-white/40 text-sm">
      {status}
    </div>
  );
}
