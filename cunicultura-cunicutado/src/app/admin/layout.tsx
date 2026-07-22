"use client";

import React from "react";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </CartProvider>
  );
}
