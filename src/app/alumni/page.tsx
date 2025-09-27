import { PageLayout } from '@/components/layout/page-layout';
import AlumniList from '@/components/alumni/alumni-list';

export default function AlumniPage() {
  return (
    <PageLayout
      title="Alumni"
      description="Artists who took their craft further — explore disciplines, practices & trajectories."
    >
      <div className="px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <AlumniList />
      </div>
    </PageLayout>
  );
}
