"use client";

import dynamic from "next/dynamic";
import { orderBy, limit } from "firebase/firestore";
import { useCollection } from "@/hooks/useCollection";
import type { SliderItem, ResmiGazeteItem, PersonelIlani, VideoItem } from "@/types";
import HeroSlider from "./HeroSlider";
import ResmiGazeteSection from "./ResmiGazeteSection";
import PersonelIlanlariSection from "./PersonelIlanlariSection";

const VideoSection = dynamic(() => import("./VideoSection"), {
  loading: () => <div className="mt-8 h-64 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false,
});

const ShortsSection = dynamic(() => import("./ShortsSection"), {
  loading: () => <div className="mt-8 h-48 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false,
});

export default function HomePageClient() {
  const { items: allSlides, loading: slidesLoading } = useCollection<SliderItem>(
    "slider",
    [orderBy("order", "asc"), limit(10)]
  );
  const { items: allGazete, loading: gazeteLoading } = useCollection<ResmiGazeteItem>(
    "resmiGazete",
    [orderBy("createdAt", "desc"), limit(5)]
  );
  const { items: allIlanlar, loading: ilanlarLoading } = useCollection<PersonelIlani>(
    "personelIlanlari",
    [orderBy("createdAt", "desc"), limit(10)]
  );
  const { items: allVideolar, loading: videolarLoading } = useCollection<VideoItem>(
    "videolar",
    [orderBy("order", "asc"), limit(12)]
  );

  const slides = allSlides.filter((s) => s.isActive);
  const gazete = allGazete.filter((g) => g.isActive);
  const ilanlar = allIlanlar.filter((i) => i.isActive);
  const activeVideolar = allVideolar.filter((v) => v.isActive);

  const videos = activeVideolar.filter((v) => v.videoType !== "short");
  const shorts = activeVideolar.filter((v) => v.videoType === "short");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <HeroSlider slides={slides} loading={slidesLoading} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <ResmiGazeteSection items={gazete} loading={gazeteLoading} />
          <PersonelIlanlariSection items={ilanlar} loading={ilanlarLoading} />
        </div>
      </div>

      <VideoSection videos={videos} loading={videolarLoading} />
      <ShortsSection shorts={shorts} loading={videolarLoading} />
    </div>
  );
}
