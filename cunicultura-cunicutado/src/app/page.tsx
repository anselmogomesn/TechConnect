"use client";

import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { AdvantagesSection } from "@/components/home/AdvantagesSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { CtaSection } from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <AdvantagesSection />
      <FeaturedSection />
      <AboutPreviewSection />
      <CategoriesSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </SiteLayout>
  );
}
