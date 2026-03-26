"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { SliderItem, ResmiGazeteItem, PersonelIlani, VideoItem } from "@/types";
import ResmiGazeteSection from "./ResmiGazeteSection";
import PersonelIlanlariSection from "./PersonelIlanlariSection";

const HeroSlider = dynamic(() => import("./HeroSlider"), {
  loading: () => (
    <div className="w-full h-[400px] lg:h-[560px] rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary-dark animate-pulse" />
  ),
  ssr: false,
});

const VideoSection = dynamic(() => import("./VideoSection"), {
  loading: () => <div className="mt-8 h-64 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false,
});

const ShortsSection = dynamic(() => import("./ShortsSection"), {
  loading: () => <div className="mt-8 h-48 bg-gray-100 rounded-lg animate-pulse" />,
  ssr: false,
});

interface HomeData {
  slider: SliderItem[];
  resmiGazete: ResmiGazeteItem[];
  personelIlanlari: PersonelIlani[];
  videolar: VideoItem[];
}

export default function HomePageClient() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/homepage")
      .then((res) => res.json())
      .then((d: HomeData) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const slides = data?.slider.filter((s) => s.isActive) ?? [];
  const gazete = data?.resmiGazete.filter((g) => g.isActive) ?? [];
  const ilanlar = data?.personelIlanlari.filter((i) => i.isActive) ?? [];
  const activeVideolar = data?.videolar.filter((v) => v.isActive) ?? [];

  const videos = activeVideolar.filter((v) => v.videoType !== "short");
  const shorts = activeVideolar.filter((v) => v.videoType === "short");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <HeroSlider slides={slides} loading={loading} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <ResmiGazeteSection items={gazete} loading={loading} />
          <PersonelIlanlariSection items={ilanlar} loading={loading} />
        </div>
      </div>

      <VideoSection videos={videos} loading={loading} />
      <ShortsSection shorts={shorts} loading={loading} />
    </div>
  );
}
