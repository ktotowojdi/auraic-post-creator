import { NextResponse } from 'next/server';
import { writeFileSync } from 'fs';

export async function POST(req: Request) {
  const data = await req.json();
  writeFileSync('/tmp/auraic-edu1-export.json', JSON.stringify(data, null, 2));
  return NextResponse.json({ ok: true });
}
