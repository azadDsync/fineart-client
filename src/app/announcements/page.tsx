import { PageLayout } from "@/components/layout/page-layout";
import AnnouncementsList from "@/components/announcements/announcements-list";

export default function AnnouncementsPage() {
  return (
    <PageLayout
      title="Announcements"
      description="Calls, opportunities, facilities updates & community news."
    >
      <div className="">
        <AnnouncementsList />
      </div>
    </PageLayout>
  );
}
