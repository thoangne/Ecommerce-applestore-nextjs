"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Product } from "@prisma/client";
import { ProductCardSkeleton } from "@/app/products/ProductCardSkeleton";
import ProductCard from "@/app/products/ProductCard";

interface Props {
  title?: string;
  products: Product[];
}

const ProductCarouselGallery = ({ title, products }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="w-full py-12">
      {/* Tiêu đề */}
      {title && (
        <div className="flex flex-col items-center mb-10">
          <h2
            className="
        text-3xl sm:text-4xl font-extrabold tracking-tight
        bg-gradient-to-r from-black via-gray-700 to-black
        dark:from-white dark:via-gray-400 dark:to-white
        bg-clip-text text-transparent
      "
          >
            {title}
          </h2>
          <div className="w-24 h-1 mt-3 rounded-full bg-gradient-to-r from-gray-300 via-gray-500 to-gray-300 dark:from-gray-600 dark:via-gray-300 dark:to-gray-600" />
        </div>
      )}
      {/* Nút điều hướng */}
      <div className="relative">
        <button
          onClick={scrollPrev}
          className="absolute left-[-5%] top-1/2 hover:cursor-pointer -translate-y-1/2 z-10 bg-gray-200/80 dark:bg-gray-800/80 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-full shadow-md"
        >
          ◀
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-[-5%] top-1/2 hover:cursor-pointer -translate-y-1/2 z-10 bg-gray-200/80 dark:bg-gray-800/80 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-full shadow-md"
        >
          ▶
        </button>

        {/* Carousel chính */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 px-6">
            {products.length === 0 && <ProductCardSkeleton />}

            {products.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_25%]"
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselGallery;
