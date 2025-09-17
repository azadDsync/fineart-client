import { PageLayout } from '@/components/layout/page-layout';

export default function PaintingsPage() {
  return (
    <PageLayout
      title="Gallery"
      description="Explore curated works from our community."
      className=""
    >
      <div className="p-8">
        <div className="heading-display text-3xl">Curations arrive here soon.</div>
        <p className="mt-4 text-muted-foreground">Build out the gallery grid and filters.</p>
      </div>
    </PageLayout>
  );
}
