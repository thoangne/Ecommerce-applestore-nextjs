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
    <div className="w-full py-8 ">
      <h1 className="text-center text-2xl font-semibold mb-6 text-white">
        Iphone Series
      </h1>

      <div className="relative max-w-[1200px] mx-auto overflow-hidden rounded-xl">
        {/* Gradient overlays */}
        <div className="absolute top-0 bottom-0 left-0 w-16 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none"></div>
        <div className="absolute top-0 bottom-0 right-0 w-16 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none"></div>
        <div
          className={`carousel-track ${isPaused ? "paused" : ""}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {tripledImages.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[500px] h-[350px] relative group"
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
                <Image
                  src={image.url.trim()}
                  alt={image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                {/* Overlay tối */}
                <div className="absolute inset-0 bg-black/50 transition-opacity duration-300 group-hover:bg-black/70"></div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-bold text-lg">{image.title}</h3>
                  <p className="text-sm text-gray-200 mt-1">{image.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <span
            key={index}
            className="w-2 h-2 rounded-full bg-white/30 cursor-pointer transition-all duration-300 hover:bg-white/60"
          ></span>
        ))}
      </div>
    </div>
  );
}
