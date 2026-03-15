'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SeedPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Ta strona nie jest już potrzebna. Projekty zapisują się w bazie danych.');

  useEffect(() => {
    // Redirect to dashboard after 2 seconds
    const t = setTimeout(() => router.replace('/'), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-[#0d0d1a] text-white/40 text-sm">
      {status}
    </div>
  );
}
