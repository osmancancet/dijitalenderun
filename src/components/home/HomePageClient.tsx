"use client";

import { orderBy } from "firebase/firestore";
import { useCollection } from "@/hooks/useCollection";
import type { SliderItem, ResmiGazeteItem, PersonelIlani, VideoItem } from "@/types";
import HeroSlider from "./HeroSlider";
import ResmiGazeteSection from "./ResmiGazeteSection";
import PersonelIlanlariSection from "./PersonelIlanlariSection";
import VideoSection from "./VideoSection";
import ShortsSection from "./ShortsSection";

export default function HomePageClient() {
  const { items: allSlides, loading: slidesLoading } = useCollection<SliderItem>(
    "slider",
    [orderBy("order", "asc")]
  );
  const { items: allGazete, loading: gazeteLoading } = useCollection<ResmiGazeteItem>(
    "resmiGazete",
    [orderBy("createdAt", "desc")]
  );
  const { items: allIlanlar, loading: ilanlarLoading } = useCollection<PersonelIlani>(
    "personelIlanlari",
    [orderBy("createdAt", "desc")]
  );
  const { items: allVideolar, loading: videolarLoading } = useCollection<VideoItem>(
    "videolar",
    [orderBy("order", "asc")]
  );

  const slides = allSlides.filter((s) => s.isActive);
  const gazete = allGazete.filter((g) => g.isActive);
  const ilanlar = allIlanlar.filter((i) => i.isActive);
  const activeVideolar = allVideolar.filter((v) => v.isActive);

  // Videoları ve Shorts'ları ayır
  const videos = activeVideolar.filter((v) => v.videoType !== "short");
  const shorts = activeVideolar.filter((v) => v.videoType === "short");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sol: Slider */}
        <div className="lg:col-span-8">
          <HeroSlider slides={slides} loading={slidesLoading} />
        </div>

        {/* Sağ: Resmi Gazete + Personel İlanları */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ResmiGazeteSection items={gazete} loading={gazeteLoading} />
          <PersonelIlanlariSection items={ilanlar} loading={ilanlarLoading} />
        </div>
      </div>

      {/* Video İçerikler */}
      <VideoSection videos={videos} loading={videolarLoading} />

      {/* YouTube Shorts */}
      <ShortsSection shorts={shorts} loading={videolarLoading} />
    </div>
  );
}
