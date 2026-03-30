"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import type { SliderItem } from "@/types";

interface HeroSliderProps {
  slides: SliderItem[];
  loading?: boolean;
}

export default function HeroSlider({ slides, loading }: HeroSliderProps) {
  if (loading) {
    return (
      <div className="w-full h-[400px] lg:h-[560px] rounded-lg overflow-hidden bg-gradient-to-br from-primary to-primary-dark animate-pulse flex items-center justify-center">
        <div className="text-center px-6">
          <div className="h-8 w-64 bg-white/20 rounded mx-auto mb-4" />
          <div className="h-4 w-48 bg-white/10 rounded mx-auto" />
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full h-[400px] lg:h-[560px] rounded-lg overflow-hidden relative flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #8B0000 0%, #4A0000 50%, #2D0000 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10 text-center text-white px-6">
          <Image
            src="/images/logo-beyaz.png"
            alt="Dijital Enderun"
            width={280}
            height={60}
            className="mx-auto mb-6 opacity-90"
          />
          <p className="text-lg text-white/70">
            Siyaset Bilimi ve Kamu Yönetimi Platformu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[400px] lg:h-[560px] rounded-lg overflow-hidden relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={slides.length > 1}
        style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {slide.linkUrl ? (
              <a href={slide.linkUrl} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full cursor-pointer">
                {slide.imageUrl ? (
                  <Image src={slide.imageUrl} alt={slide.title} fill style={{ objectFit: "cover" }} sizes="100vw" priority={index === 0} />
                ) : (
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #8B0000 0%, #4A0000 50%, #2D0000 100%)" }} />
                )}
              </a>
            ) : (
              <div className="relative w-full h-full">
                {slide.imageUrl ? (
                  <Image src={slide.imageUrl} alt={slide.title} fill style={{ objectFit: "cover" }} sizes="100vw" priority={index === 0} />
                ) : (
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #8B0000 0%, #4A0000 50%, #2D0000 100%)" }} />
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
