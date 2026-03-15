import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const project = await req.json();
  // Return the project as a script that injects it into localStorage
  const script = `
    <html><body><script>
      const STORAGE_KEY = 'auraic-projects';
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.push(${JSON.stringify(project)});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      window.location.href = '/editor/${project.id}';
    </script></body></html>
  `;
  return new NextResponse(script, { headers: { 'Content-Type': 'text/html' } });
}
