import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all projects
export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(
    projects.map((p) => ({
      id: p.id,
      title: p.title,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      carousel: p.data,
    }))
  );
}

// POST create project
export async function POST(req: Request) {
  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      id: body.id,
      title: body.title,
      data: body.carousel,
    },
  });
  return NextResponse.json({ id: project.id });
}
