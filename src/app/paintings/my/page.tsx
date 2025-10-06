"use client";

import { useMemo } from 'react';
import { PageLayout } from '@/components/layout/page-layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { UploadPaintingForm } from '@/components/paintings/upload-painting-form';
import { useMyPaintings, useDeletePainting } from '@/lib/hooks/use-api';
import { LoadingSpinner } from '@/components/ui/loading';
import { ScatteredGallery } from '@/components/paintings/scattered-gallery';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils';

export default function MyPaintingsPage() {
  const { data: res, isLoading: loading, error, refetch } = useMyPaintings({ limit: 100 });
  const items = res?.data ?? [];

  const deletePainting = useDeletePainting(() => {
    toast.success('Painting deleted');
  });

  const galleryItems = useMemo(() => {
    const paintingItems = res?.data ?? [];
    return paintingItems.map(p => ({
      id: p.id,
      title: p.title,
      subtitle: p.description ?? undefined,
      imageUrl: p.imageUrl,
    }));
  }, [res?.data]);

  const onCreated = () => {
    // The hook will automatically refetch after creation
    toast.success('Painting uploaded');
  };

  const onDelete = (id: string) => {
    deletePainting.mutate(id, {
      onError: (e) => {
        toast.error(getErrorMessage(e, 'Delete failed'));
      }
    });
  };

  return (
    <ProtectedRoute>
      <PageLayout title="My Paintings" description="Upload and manage your works.">
        <div className="p-6 space-y-6">
          <UploadPaintingForm onCreated={onCreated} />

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your uploads</h2>
            <button onClick={() => refetch()} className="text-sm underline">Refresh</button>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><LoadingSpinner /> Loading…</div>
          ) : error ? (
            <div className="rounded-md border border-red-500/30 bg-red-500/10 p-2 text-sm text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : 'Failed to load your paintings'}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">No paintings yet. Upload your first above.</div>
          ) : (
            <div className="space-y-6">
              {/* Draggable canvas + grid toggle, reusing shared component */}
              <ScatteredGallery items={galleryItems} />

              {/* Simple list with quick actions */}
              <div className="grid gap-3">
                {items.map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{p.title}</div>
                      {p.description && <div className="text-xs text-muted-foreground truncate">{p.description}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={p.imageUrl} target="_blank" className="text-xs underline" rel="noreferrer">Open</a>
                      <button onClick={() => onDelete(p.id)} className="text-xs text-red-600 underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
