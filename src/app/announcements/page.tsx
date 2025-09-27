import { PageLayout } from '@/components/layout/page-layout';
import AnnouncementsList from '@/components/announcements/announcements-list';

export default function AnnouncementsPage() {
  return (
    <PageLayout
      title="Announcements"
      description="Calls, opportunities, facilities updates & community news."
    >
      <div className="px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <AnnouncementsList />
      </div>
    </PageLayout>
  );
}
