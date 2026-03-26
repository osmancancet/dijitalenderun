"use client";

import { useState } from "react";
import { Play, Tv, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import type { VideoItem } from "@/types";

const MAX_VISIBLE = 6;

interface VideoSectionProps {
  videos: VideoItem[];
  loading?: boolean;
}

function getYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match ? match[1] : null;
}

function LazyVideo({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYoutubeId(video.youtubeUrl);

  if (!videoId) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-t-lg">
        <Play size={40} className="text-gray-300" />
      </div>
    );
  }

  if (playing) {
    return (
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={video.title}
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
      className="relative w-full block group cursor-pointer"
      style={{ paddingBottom: "56.25%" }}
    >
      <Image
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt={video.title}
        fill
        className="absolute inset-0 object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play size={28} className="text-white ml-1" fill="white" />
        </div>
      </div>
    </button>
  );
}

export default function VideoSection({ videos, loading }: VideoSectionProps) {
  const t = useTranslations("home");

  if (loading) {
    return (
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Tv size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t("videosTitle")}</h2>
            <p className="text-xs text-gray-500">{t("videosSubtitle")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-border rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="w-full h-48 bg-gray-200" />
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  const visibleVideos = videos.slice(0, MAX_VISIBLE);
  const hasMore = videos.length > MAX_VISIBLE;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Tv size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{t("videosTitle")}</h2>
            <p className="text-xs text-gray-500">{t("videosSubtitle")}</p>
          </div>
        </div>
        <a
          href="https://www.youtube.com/@dijitalenderun/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
        >
          {t("goToChannel")}
          <ChevronRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleVideos.map((video) => (
          <div key={video.id} className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <LazyVideo video={video} />
            <div className="p-4">
              <h3 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">{video.title}</h3>
              {video.description && (
                <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{video.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-5">
          <a
            href="https://www.youtube.com/@dijitalenderun/videos"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            {t("moreVideos")}
            <ChevronRight size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
