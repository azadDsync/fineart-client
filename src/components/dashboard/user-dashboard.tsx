"use client";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function UserDashboard() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });

  const paintingsQuery = useQuery({
    queryKey: ['my-paintings'],
    queryFn: () => apiClient.getMyPaintings(),
  });

  interface ApiError { error?: string }
  const createPainting = useMutation<{ data: unknown }, ApiError>({
    mutationFn: () => apiClient.createPainting(form),
    onSuccess: () => {
      toast.success('Painting created');
      setForm({ title: '', description: '', imageUrl: '' });
      qc.invalidateQueries({ queryKey: ['my-paintings'] });
    },
    onError: (e) => {
      toast.error(e?.error || 'Failed to create painting');
    }
  });

  return (
    <div className="space-y-8 py-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Painting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <Input placeholder="Image URL" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
            <Button disabled={createPainting.isPending} onClick={() => createPainting.mutate()}>
              {createPainting.isPending ? 'Creating...' : 'Create'}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>My Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Paintings: {paintingsQuery.data?.data.length ?? 0}</p>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <div>
        <h2 className="text-lg font-semibold mb-4">My Paintings</h2>
        {paintingsQuery.isLoading && <p>Loading...</p>}
        {paintingsQuery.error && <p className="text-red-500 text-sm">Failed to load.</p>}
        <div className="grid gap-4 md:grid-cols-3">
          {paintingsQuery.data?.data.map(p => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3">{p.description}</p>
              </CardContent>
            </Card>
          ))}
          {paintingsQuery.data?.data.length === 0 && !paintingsQuery.isLoading && (
            <p className="col-span-full text-sm text-muted-foreground">No paintings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
