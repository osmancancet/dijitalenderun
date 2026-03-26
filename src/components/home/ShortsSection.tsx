"use client";

import { useState } from "react";
import { Play, Zap, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { VideoItem } from "@/types";

const MAX_VISIBLE = 5;

interface ShortsSectionProps {
  shorts: VideoItem[];
  loading?: boolean;
}

function getVideoId(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  if (shortsMatch) return shortsMatch[1];
  const watchMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return watchMatch ? watchMatch[1] : null;
}

function LazyShort({ short }: { short: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getVideoId(short.youtubeUrl);

  if (!videoId) return null;

  if (playing) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "9/16", maxHeight: "400px" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1`}
          title={short.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      className="relative w-full block group cursor-pointer rounded-xl overflow-hidden bg-black"
      style={{ aspectRatio: "9/16", maxHeight: "400px" }}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={short.title}
        fill
        className="absolute inset-0 object-cover"
        sizes="(max-width: 768px) 50vw, 25vw"
      />
      {/* Play overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-14 h-14 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play size={24} className="text-white ml-1" fill="white" />
        </div>
      </div>
      {/* Title overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-white text-xs font-medium line-clamp-2">{short.title}</p>
      </div>
    </button>
  );
}

export default function ShortsSection({ shorts, loading }: ShortsSectionProps) {
  const t = useTranslations("home");

  if (loading) {
    return (
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t("shortsTitle")}</h2>
            <p className="text-xs text-gray-500">{t("shortsSubtitle")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-xl bg-gray-200" style={{ aspectRatio: "9/16", maxHeight: "400px" }} />
          ))}
        </div>
      </div>
    );
  }

  if (shorts.length === 0) return null;

  const visibleShorts = shorts.slice(0, MAX_VISIBLE);
  const hasMore = shorts.length > MAX_VISIBLE;

  return (
    <div className="mt-10 mb-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t("shortsTitle")}</h2>
            <p className="text-xs text-gray-500">{t("shortsSubtitle")}</p>
          </div>
        </div>
        <a
          href="https://www.youtube.com/@dijitalenderun/shorts"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
        >
          {t("watchAll")}
          <ChevronRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {visibleShorts.map((short) => (
          <LazyShort key={short.id} short={short} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-5">
          <a
            href="https://www.youtube.com/@dijitalenderun/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            {t("moreShorts")}
            <ChevronRight size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
