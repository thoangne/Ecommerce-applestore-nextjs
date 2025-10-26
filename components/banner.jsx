"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import "../components/styles/banner.css";

const AppleBanner = () => {
  const product = {
    name: "Apple Stores",
    tagline: "THE FUTURE IS HERE. REIMAGINED.",
    description:
      "Redesigned from the inside out. Smarter, faster, and more intuitive than ever.",
    video: "/video/videoplayback.mp4",
    accentColor: "#0071e3",
  };

  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Decorative Elements */}
      <div className="geometric-pattern" />

      {/* Curved Lines - Left */}
      <div className="curved-lines" style={{ top: "-250px", left: "-150px" }} />
      <div className="curved-lines" style={{ top: "-200px", left: "-100px" }} />
      <div className="curved-lines" style={{ top: "-150px", left: "-50px" }} />

      {/* Curved Lines - Right */}
      <div
        className="curved-lines"
        style={{ bottom: "-250px", right: "-150px" }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-8 flex items-center">
        <div className="grid grid-cols-2 gap-16 w-full items-center">
          {/* Left Content */}
          <div className="space-y-8 slide-in">
            <div className="text-sm text-gray-400 tracking-widest uppercase">
              {product.tagline}
            </div>

            <h1 className="text-6xl font-bold leading-none">
              <span className="text-gradient">{product.name}</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
              {product.description}
            </p>

            <div className="flex gap-4 pt-6">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-base transition-all">
                RESERVE NOW
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-6 text-base font-semibold transition-all">
                LEARN MORE
              </Button>
            </div>

            {/* Date */}
            <div className="text-xs text-gray-600 tracking-widest">
              25.10.25
            </div>
          </div>

          {/* Right Content - Product Video */}
          <div className="relative h-full flex items-center justify-center">
            {/* Glow Effect */}
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl glow-effect"
              style={{
                background: `radial-gradient(circle, ${product.accentColor}40 0%, transparent 70%)`,
              }}
            />

            {/* Product Video */}
            <div className="relative animate-float">
              <video
                src={product.video}
                autoPlay
                loop
                muted
                playsInline
                className="relative w-full max-w-md lg:max-w-xl h-auto object-contain drop-shadow-2xl"
                style={{
                  mixBlendMode: "lighten",
                  filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleBanner;
