'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/types';
import { getAllProjects, createProject, deleteProject, saveProject } from '@/lib/storage';
import { createDefaultCarousel, carouselPresets } from '@/lib/templates';
import SlideRenderer from '@/components/slides/SlideRenderer';

export default function Dashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setProjects(getAllProjects().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
  }, []);

  const handleNewProject = () => {
    const carousel = createDefaultCarousel();
    const project = createProject(carousel);
    saveProject(project);
    router.push(`/editor/${project.id}`);
  };

  const handleNewFromTemplate = (presetIndex: number) => {
    const carousel = carouselPresets[presetIndex].create();
    const project = createProject(carousel);
    saveProject(project);
    router.push(`/editor/${project.id}`);
  };

  const handleDuplicate = (project: Project) => {
    const copy = createProject({
      ...project.carousel,
      id: `carousel-${Date.now()}`,
      title: `${project.title} (kopia)`,
    });
    saveProject(copy);
    setProjects((prev) => [copy, ...prev]);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white overflow-y-auto" style={{ height: '100vh', overflowY: 'auto' }}>
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold">Auraic Post Creator</h1>
            <p className="text-white/40 text-sm mt-1">Twoje karuzele na Instagram, Facebook i LinkedIn</p>
          </div>
          <button
            onClick={handleNewProject}
            className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors"
          >
            + Nowy projekt
          </button>
        </div>

        {/* Quick start templates — always visible */}
        <div className="mb-8">
          <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">Quick start</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {carouselPresets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleNewFromTemplate(i)}
                className="flex flex-col gap-1 px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-left transition-colors shrink-0"
              >
                <span className="font-medium text-xs">{preset.name}</span>
                <span className="text-white/30 text-[10px]">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects grid */}
        {projects.length > 0 && (
          <>
            <h2 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">
              Twoje projekty ({projects.length})
            </h2>
            <div className="grid grid-cols-3 gap-5">
              {/* New project card */}
              <button
                onClick={handleNewProject}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-white/15 hover:border-purple-400/40 hover:bg-white/[0.02] transition-colors min-h-[220px]"
              >
                <span className="text-3xl text-white/20">+</span>
                <span className="text-white/40 text-sm">Nowy projekt</span>
              </button>

              {projects.map((project) => {
                const firstSlide = project.carousel.slides[0];
                return (
                  <div
                    key={project.id}
                    className="group relative rounded-xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-white/20 transition-colors cursor-pointer"
                    onClick={() => router.push(`/editor/${project.id}`)}
                  >
                    {/* Thumbnail preview */}
                    <div className="relative h-[160px] overflow-hidden bg-[#1a1a2e]">
                      {firstSlide && (
                        <div
                          style={{
                            width: 1080,
                            height: 1350,
                            transform: 'scale(0.148)',
                            transformOrigin: 'top left',
                            pointerEvents: 'none',
                          }}
                        >
                          <SlideRenderer
                            slide={firstSlide}
                            index={0}
                            total={project.carousel.slides.length}
                          />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-medium text-sm truncate">{project.title}</h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-white/30 text-xs">{project.carousel.slides.length} slajdów</span>
                        <span className="text-white/30 text-xs">{formatDate(project.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(project);
                        }}
                        className="w-7 h-7 rounded-lg bg-black/50 text-white/40 hover:text-purple-400 hover:bg-black/70 flex items-center justify-center text-xs"
                        title="Duplikuj"
                      >
                        ⧉
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(project.id);
                        }}
                        className="w-7 h-7 rounded-lg bg-black/50 text-white/40 hover:text-red-400 hover:bg-black/70 flex items-center justify-center text-xs"
                        title="Usuń"
                      >
                        x
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a30] rounded-2xl p-6 w-[360px] border border-white/10">
            <h2 className="text-base font-semibold mb-2">Usunąć projekt?</h2>
            <p className="text-white/40 text-sm mb-5">Tej operacji nie da się cofnąć.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition-colors"
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
