import { Project, Carousel } from './types';

const STORAGE_KEY = 'auraic-projects';

export function getAllProjects(): Project[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Project[];
  } catch {
    return [];
  }
}

export function getProject(id: string): Project | null {
  return getAllProjects().find((p) => p.id === id) || null;
}

export function saveProject(project: Project): void {
  const projects = getAllProjects();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.push({ ...project, updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function deleteProject(id: string): void {
  const projects = getAllProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
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
