import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single project
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return NextResponse.json(null, { status: 404 });
  return NextResponse.json({
    id: project.id,
    title: project.title,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    carousel: project.data,
  });
}

// PUT update project
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  await prisma.project.upsert({
    where: { id },
    update: { title: body.title, data: body.carousel },
    create: { id, title: body.title, data: body.carousel },
  });
  return NextResponse.json({ ok: true });
}

// DELETE project
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } }).catch(() => {});
  return NextResponse.json({ ok: true });
}
