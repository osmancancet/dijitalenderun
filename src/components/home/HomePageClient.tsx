"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { SliderItem, ResmiGazeteItem, PersonelIlani, VideoItem, SinavTakvimi } from "@/types";
import ResmiGazeteSection from "./ResmiGazeteSection";
import PersonelIlanlariSection from "./PersonelIlanlariSection";
import SinavTakvimiSection from "./SinavTakvimiSection";
import HorizontalAdBanner from "@/components/shared/HorizontalAdBanner";

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
  sinavTakvimi: SinavTakvimi[];
}

export default function HomePageClient() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/public/homepage")
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((d: HomeData) => setData(d))
      .catch((err) => {
        console.error("Homepage veri hatası:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  const slides = data?.slider.filter((s) => s.isActive) ?? [];
  const gazete = data?.resmiGazete.filter((g) => g.isActive) ?? [];
  const ilanlar = data?.personelIlanlari.filter((i) => i.isActive) ?? [];
  const sinavlar = data?.sinavTakvimi ?? [];
  const activeVideolar = data?.videolar.filter((v) => v.isActive) ?? [];

  const videos = activeVideolar.filter((v) => v.videoType !== "short");
  const shorts = activeVideolar.filter((v) => v.videoType === "short");

  function retry() {
    setLoading(true);
    setError(false);
    fetch("/api/public/homepage")
      .then((res) => {
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
      })
      .then((d: HomeData) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {error && !data && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-sm text-red-600 mb-2">Veriler yüklenirken bir hata oluştu.</p>
          <button onClick={retry} className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
            Tekrar Dene
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <HeroSlider slides={slides} loading={loading} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <ResmiGazeteSection items={gazete} loading={loading} />
          <PersonelIlanlariSection items={ilanlar} loading={loading} />
          <SinavTakvimiSection items={sinavlar} loading={loading} />
        </div>
      </div>

      <HorizontalAdBanner />

      <VideoSection videos={videos} loading={loading} />
      <ShortsSection shorts={shorts} loading={loading} />
    </div>
  );
}
