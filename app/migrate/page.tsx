'use client';

import { useEffect, useState } from 'react';

const OLD_KEY = 'auraic-projects';

export default function MigratePage() {
  const [status, setStatus] = useState('Migracja: szukam projektów w localStorage...');
  const [done, setDone] = useState(false);

  useEffect(() => {
    async function migrate() {
      const raw = localStorage.getItem(OLD_KEY);
      if (!raw) {
        setStatus('Brak projektów w localStorage.');
        return;
      }

      const projects = JSON.parse(raw);
      setStatus(`Znaleziono ${projects.length} projektów. Migruję do bazy...`);

      let migrated = 0;
      for (const p of projects) {
        try {
          const res = await fetch(`/api/projects/${p.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: p.title || p.carousel?.title || 'Bez tytułu', carousel: p.carousel }),
          });
          if (res.ok) migrated++;
        } catch (e) {
          console.error('Failed to migrate:', p.id, e);
        }
      }

      setStatus(`Gotowe! Zmigrowano ${migrated}/${projects.length} projektów.`);
      setDone(true);
    }
    migrate();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0d0d1a] text-white gap-4">
      <p className="text-white/60 text-sm">{status}</p>
      {done && (
        <a href="/" className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors">
          Przejdź do dashboardu
        </a>
      )}
    </div>
  );
}
