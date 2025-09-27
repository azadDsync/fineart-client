import { PageLayout } from '@/components/layout/page-layout';
import EventsList from '@/components/events/events-list';

export default function EventsPage() {
  return (
    <PageLayout
      title="Events"
      description="Workshops, exhibitions, critiques & community gatherings."
    >
      <div className="px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <EventsList />
      </div>
    </PageLayout>
  );
}
