import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cunicultura Cunicutado | Qualidade, genética e paixão na criação de coelhos",
  description:
    "Cunicultura Cunicutado - Especializada na criação, comercialização e distribuição de coelhos de alta qualidade. Produtos, acessórios, alimentação e serviços para cunicultura.",
  keywords: [
    "cunicultura",
    "coelhos",
    "criação de coelhos",
    "coelhos gigantes",
    "coelhos anões",
    "rações para coelhos",
    "gaiolas",
    "Anselmo Gomes",
    "Cunicutado",
  ],
  authors: [{ name: "Anselmo Gomes" }],
  creator: "Cunicultura Cunicutado",
  publisher: "Cunicultura Cunicutado",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://cuniculturacunicutado.com.br",
    siteName: "Cunicultura Cunicutado",
    title: "Cunicultura Cunicutado | Qualidade, genética e paixão na criação de coelhos",
    description:
      "Especializada na criação, comercialização e distribuição de coelhos de alta qualidade.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cunicultura Cunicutado",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cunicultura Cunicutado",
    description:
      "Qualidade, genética e paixão na criação de coelhos.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
