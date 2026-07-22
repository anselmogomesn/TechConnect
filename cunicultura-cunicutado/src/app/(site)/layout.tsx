"use client";

import React from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export default function SitePagesLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
