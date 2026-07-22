"use client";

import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}
