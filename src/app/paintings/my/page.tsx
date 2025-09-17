import { PageLayout } from '@/components/layout/page-layout';

export default function MyPaintingsPage() {
  return (
    <PageLayout
      title="My Paintings"
      description="Manage your own submissions."
    >
      <div className="p-8">
        <div className="heading-display text-3xl">Upload and manage your works.</div>
      </div>
    </PageLayout>
  );
}
