'use client';

import { useEffect, useState } from 'react';

export default function ExportDataPage() {
  const [data, setData] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('auraic-projects') || '[]';
    const projects = JSON.parse(raw);
    const edu1 = projects.find((p: { id: string }) => p.id === 'project-karuzela1-proces');
    if (edu1) {
      setData(JSON.stringify(edu1, null, 2));
      // Also save to a file via API
      fetch('/api/save-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edu1),
      }).catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white p-8">
      <h1 className="text-lg font-semibold mb-4">Dane projektu edu-1</h1>
      <pre className="text-xs text-white/60 bg-white/5 p-4 rounded-lg overflow-auto max-h-[80vh]">{data}</pre>
    </div>
  );
}
