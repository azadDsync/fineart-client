"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { PaintingsGridInfinite } from "@/components/paintings/paintings-grid-infinite";

export default function PaintingsPage() {
  return (
    <PageLayout title="Paintings" description="Explore works submitted by members.">
      <div className="space-y-4">
        <PaintingsGridInfinite pageSize={24} />
      </div>
    </PageLayout>
  );
}
