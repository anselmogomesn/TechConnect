"use client";

import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  light?: boolean;
  center?: boolean;
}

export function SectionTitle({ title, subtitle, light, center = true }: SectionTitleProps) {
  return (
    <div className={`mb-12 md:mb-16 ${center ? "text-center" : ""}`}>
      <h2
        className={`font-poppins font-bold text-[clamp(1.5rem,4vw,2.5rem)] ${
          light ? "text-white" : "text-[#212121]"
        }`}
      >
        {title}
      </h2>
      <div className="w-[60px] h-[3px] bg-gradient-to-r from-[#1B5E20] to-[#4CAF50] rounded-full mt-3 mb-4 mx-auto md:mx-0" />
      {subtitle && (
        <p
          className={`font-inter text-base md:text-lg max-w-2xl ${
            center ? "mx-auto" : ""
          } ${light ? "text-gray-300" : "text-gray-500"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
