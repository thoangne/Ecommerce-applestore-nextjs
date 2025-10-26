// ExpandableGallery.jsx
"use client";
import React, { useState } from "react";

export default function ExpandableGallery() {
  const [activeIndex, setActiveIndex] = useState(null);

  const galleryItems = [
    {
      id: 1,
      title: "Apple Vision Pro M5",

      image:
        "https://i.pinimg.com/1200x/84/43/c8/8443c810cfd69bd887f549ef96b9a34b.jpg",
      description:
        "Trang bị chip M5 và dây đeo được thiết kế lại cho cảm giác thoải mái hơn",
    },
    {
      id: 2,
      title: "Airpod Max 5",

      image:
        "https://i.pinimg.com/1200x/29/2b/02/292b020d6d162284ea5f4e00dbff37ed.jpg",
      description: "Mang đến âm thanh cực kỳ chi tiết và có độ trung thực cao",
    },
    {
      id: 3,
      title: "Apple Products",

      image:
        "https://i.pinimg.com/736x/3c/07/26/3c072692eac70fb711c0a6b721f3e932.jpg",
      description: "Siries đồ apple với tone màu chủ đạo là đen xám",
    },
    {
      id: 4,
      title: "MacBook Air M4",

      image:
        "https://i.pinimg.com/1200x/6c/f9/86/6cf986c388400c12243bc5c845b595e4.jpg",
      description: "Cung cấp khả năng xử lý đa tác vụ nhanh chóng, mượt mà",
    },
    {
      id: 5,
      title: "Ipad Pro",

      image:
        "https://i.pinimg.com/736x/cb/83/07/cb8307da7a3d0f9abcdca1ddaaa0c0df.jpg",
      description:
        "Thiết kế hiện đại, màn hình Liquid Retina sắc nét với công nghệ True Tone và dải màu rộng P3",
    },
  ];

  return (
    <>
      <section className="max-w-7xl mx-auto py-16 px-10">
        <div className="text-center mb-5 animate-[fadeInDown_0.8s_ease-out]">
          <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700 tracking-[-1px] mb-4 text-white">
            Bộ Sưu Tập Mới Của Apple
          </h2>
          <p className="text-base text-gray-600 font-medium">
            Chạm vào để xem chi tiết
          </p>
        </div>

        <div className="flex gap-4 h-[500px] max-w-6xl mx-auto overflow-visible">
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              className={`gallery-item relative flex-1 rounded-xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden transform group ${
                activeIndex === index
                  ? "flex-[3] scale-100"
                  : "flex-[0.3] scale-85"
              }`}
              style={{
                backgroundImage: `url(${item.image.trim()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {/* Overlay */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  activeIndex === index
                    ? "bg-gradient-to-b from-transparent via-black/30 to-black/95"
                    : "bg-gradient-to-b from-black/10 via-black/50 to-black/90"
                }`}
              ></div>

              {activeIndex === index && (
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  {/* Number */}
                  <span className="inline-block text-xs font-black bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3 opacity-0 translate-y-5 transition-all duration-500 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
                    0{item.id}
                  </span>

                  {/* Title */}
                  <h3 className="text-3xl font-black m-0 mb-2 opacity-0 -translate-x-5 transition-all duration-500 delay-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 group-hover:translate-x-0">
                    {item.title}
                  </h3>
                  {/* Description */}
                  <p className="text-sm leading-relaxed text-white/85 max-w-[400px] opacity-0 translate-y-5 transition-all duration-500 delay-250 group-hover:opacity-100 group-hover:translate-y-0">
                    {item.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
