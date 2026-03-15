'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Project } from '@/lib/types';
import { getProject } from '@/lib/storage';
import Editor from '@/components/editor/Editor';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const found = getProject(id);
    if (!found) {
      router.replace('/');
      return;
    }
    setProject(found);
    setLoading(false);
  }, [params.id, router]);

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0d0d1a] text-white/40">
        Ładowanie...
      </div>
    );
  }

  return <Editor key={project.id} project={project} />;
}
