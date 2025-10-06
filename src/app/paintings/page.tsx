"use client";

import { PageLayout } from "@/components/layout/page-layout";
import { PaintingsGridInfinite } from "@/components/paintings/paintings-grid-infinite";
import { Suspense, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function PaintingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  // Keep input in sync with URL changes (e.g., back/forward)
  useEffect(() => {
    const spQ = searchParams.get("q") ?? "";
    setQ(spQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounce URL update
  useEffect(() => {
    const id = setTimeout(() => {
      const sp = new URLSearchParams(searchParams.toString());
      if (q) sp.set("q", q);
      else sp.delete("q");
      router.replace(`${pathname}?${sp.toString()}`);
    }, 350);
    return () => clearTimeout(id);
  }, [q, router, pathname, searchParams]);

  const search = useMemo(() => q.trim() || undefined, [q]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search paintings…"
          className="w-72 rounded-md border bg-background px-3 py-2 text-sm border-black dark:border-neutral-700/40 focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <PaintingsGridInfinite pageSize={24} search={search} />
    </div>
  );
}

export default function PaintingsPage() {
  return (
    <PageLayout title="Paintings" description="Explore works submitted by members.">
      <Suspense fallback={<div className="p-4 text-sm text-muted-foreground">Loading...</div>}>
        <PaintingsContent />
      </Suspense>
    </PageLayout>
  );
}
