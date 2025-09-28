import { PageLayout } from '@/components/layout/page-layout';
import EventsList from '@/components/events/events-list';

export default function EventsPage() {
  return (
    <PageLayout
      title="Events"
      description="Workshops, exhibitions, critiques & community gatherings."
    >
      <div className="">
        <EventsList />
      </div>
    </PageLayout>
  );
}
