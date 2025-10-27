// components/Carousel.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import "@/components/styles/carousel.css";

export default function Carousel() {
  const [isPaused, setIsPaused] = useState(false);

  const images = [
    {
      url: "https://i.ytimg.com/vi/KpI-QDbrf0Y/maxresdefault.jpg",
      title: "Iphone 13",
      subtitle: "Khám Phá Bộ Sưu Tập mới của Iphone 13 Series",
    },
    {
      url: "https://i.pinimg.com/1200x/08/2d/0a/082d0aef7eeb758b03b67b73a95de841.jpg",
      title: "Iphone 17",
      subtitle: "Khám Phá Bộ Sưu Tập mới của Iphone 17 Series",
    },
    {
      url: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/34b5bf180145769.6505ae7623131.jpg",
      title: "Iphone 15",
      subtitle: "Khám Phá Bộ Sưu Tập mới của Iphone 15 Series",
    },
    {
      url: "https://i.pinimg.com/736x/42/eb/40/42eb4058f515752ddfd6f03e9c7e890b.jpg",
      title: "Iphone 16",
      subtitle: "Khám Phá Bộ Sưu Tập mới của Iphone 16 Series",
    },
    {
      url: "https://i.pinimg.com/1200x/56/f9/dc/56f9dc0086131835cea5ceabd6b5f127.jpg",
      title: "Iphone 14",
      subtitle: "Khám Phá Bộ Sưu Tập mới của Iphone 14 Series",
    },
  ];

  const tripledImages = [...images, ...images, ...images];

  return (
    <section className="w-full py-12 bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
      {/* ======= Tiêu đề ======= */}
      <div className="text-center mb-8">
        <h1
          className="
            text-4xl sm:text-5xl font-extrabold mb-3
            bg-gradient-to-r from-[#000000] via-[#555555] to-[#aaaaaa]
            dark:from-[#ffffff] dark:via-[#cccccc] dark:to-[#777777]
            bg-[length:200%_auto] bg-clip-text text-transparent
            animate-gradient-flow
            tracking-tight leading-tight
            drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]
            hover:scale-[1.05] transition-transform duration-700 ease-in-out
            animate-fade-in
          "
        >
          iPhone Series
        </h1>
        <p
          className="
            text-base sm:text-lg font-medium text-gray-600 dark:text-gray-300
            animate-fade-in-delayed
          "
        >
          Khám phá những siêu phẩm mới nhất từ Apple — sang trọng, mạnh mẽ, đột
          phá.
        </p>
      </div>

      {/* ======= Carousel ======= */}
      <div className="relative max-w-[2400px] mx-auto overflow-hidden rounded-2xl shadow-2xl">
        {/* Overlay gradient 2 bên */}
        <div className="absolute top-0 bottom-0 left-0 w-24 z-20 bg-gradient-to-r  dark:from-black to-transparent pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 z-20 bg-gradient-to-l  dark:from-black to-transparent pointer-events-none" />

        {/* Track hình */}
        <div
          className={`carousel-track ${isPaused ? "paused" : ""}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {tripledImages.map((image, index) => (
            <div
              key={index}
              className="
                flex-shrink-0 w-[500px] h-[350px] relative group 
                transition-transform duration-500 ease-out hover:scale-[1.04]
              "
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src={image.url.trim()}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 500px"
                />

                {/* Overlay tối */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-500" />

                {/* Nội dung overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                  <h3 className="font-bold text-xl drop-shadow-md">
                    {image.title}
                  </h3>
                  <p className="text-sm text-gray-200 mt-1">{image.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======= Indicators ======= */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <span
            key={index}
            className="
              w-3 h-3 rounded-full bg-gray-400/40 dark:bg-white/20 
              cursor-pointer transition-all duration-300
              hover:bg-gray-600 dark:hover:bg-white/60
            "
          />
        ))}
      </div>
    </section>
  );
}
