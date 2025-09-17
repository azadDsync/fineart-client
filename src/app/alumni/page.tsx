import { PageLayout } from '@/components/layout/page-layout';

export default function AlumniPage() {
  return (
    <PageLayout
      title="Alumni"
      description="Artists who took their craft further."
    >
      <div className="p-8">
        <div className="heading-display text-3xl">Alumni stories and profiles.</div>
      </div>
    </PageLayout>
  );
}
