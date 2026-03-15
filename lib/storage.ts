import { Project, Carousel } from './types';

// API-based storage (works with database on Railway)

export async function getAllProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getProject(id: string): Promise<Project | null> {
  try {
    const res = await fetch(`/api/projects/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveProject(project: Project): Promise<void> {
  await fetch(`/api/projects/${project.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: project.title || project.carousel.title, carousel: project.carousel }),
  });
}

export async function deleteProject(id: string): Promise<void> {
  await fetch(`/api/projects/${id}`, { method: 'DELETE' });
}

export function createProject(carousel: Carousel): Project {
  const now = new Date().toISOString();
  return {
    id: `project-${Date.now()}`,
    title: carousel.title,
    createdAt: now,
    updatedAt: now,
    carousel,
  };
}
