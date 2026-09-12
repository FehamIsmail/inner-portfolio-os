import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Desktop from "@/components/os/Desktop";
import local from "next/font/local";
import React from "react";
import ThemeInitializer from "@/components/theme/ThemeInitializer";

const nunito = Nunito({
  weight: ["600", "700", "800", "900", "1000"],
  subsets: ["latin"],
  style: "normal",
  variable: "--font-nunito",
});

const pixolde = local({
  src: [
    {
      path: "../assets/fonts/Pixolde.ttf",
      style: "normal",
      weight: "400",
    },
    {
      path: "../assets/fonts/Pixolde-Bold.ttf",
      style: "normal",
      weight: "700",
    },
  ],
  variable: "--font-pixolde",
});

const nevrada = local({
  src: "../assets/fonts/Nevrada.ttf",
  style: "normal",
  weight: "400",
  variable: "--font-nevrada",
});

export const metadata: Metadata = {
  title: "Ismail Feham's Desktop",
  description: "My personal desktop",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nevrada.variable} ${nunito.variable} ${pixolde.variable} overflow-hidden`}
      >
        <ThemeInitializer />
        <Desktop>{children}</Desktop>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
