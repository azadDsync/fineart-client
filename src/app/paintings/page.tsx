import { PageLayout } from "@/components/layout/page-layout";
import { ScatteredGallery } from "@/components/paintings/scattered-gallery";

// Visible sample using existing local assets
const baseImages = [
  {
    src: "/vercel.svg",
    title: "Inner Peace",
    subtitle: "Mindfulness Retreat | Bali",
  },
  { src: "/next.svg", title: "Adventure Awaits", subtitle: "Weekly Chapters" },
  { src: "/globe.svg", title: "Explore More", subtitle: "Travel Journals" },
  { src: "/window.svg", title: "Let it Flow", subtitle: "Creative Sessions" },
  { src: "/file.svg", title: "Ext it Flow", subtitle: "Archive Series" },
];

const placeholderItems = Array.from({ length: 60 }).map((_, i) => {
  const img = baseImages[i % baseImages.length];
  return {
    id: `ph-${i}`,
    title: img.title,
    subtitle: img.subtitle,
    imageUrl: img.src,
  };
});

export default function PaintingsPage() {
  return (
    <>
    <PageLayout>
      <div >
        {/* ScatteredGallery now includes a search bar & a toggle to switch between draggable scatter view and simple grid */}
        <ScatteredGallery
          items={placeholderItems}
          initialVisible={5}
          minDistance={500}
        />
      </div>
      </PageLayout>
    </>
  );
}
