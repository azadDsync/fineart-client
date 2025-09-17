import { PageLayout } from '@/components/layout/page-layout';

export default function EventsPage() {
  return (
    <PageLayout
      title="Events"
      description="Workshops, exhibitions, and gatherings."
    >
      <div className="p-8">
        <div className="heading-display text-3xl">Upcoming events will be listed here.</div>
      </div>
    </PageLayout>
  );
}
