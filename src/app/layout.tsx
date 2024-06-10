import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Desktop from "@/components/os/Desktop";
import local from 'next/font/local';
import Script from "next/script";
import React from "react";
import '@/assets/styles/js-dos.css'

const nunito = Nunito({
    weight: [ '600', '700', '800', '900', '1000'],
    subsets: ['latin'],
    style: 'normal',
    variable: '--font-nunito'
});

const pixolde = local({
    src: [
        {
            path: '../assets/fonts/Pixolde.ttf',
            style: 'normal',
            weight: '400'
        },
        {
            path: '../assets/fonts/Pixolde-Bold.ttf',
            style: 'normal',
            weight: '700'
        }
   ],
   variable: '--font-pixolde'
});

const nevrada = local({
    src: '../assets/fonts/Nevrada.ttf',
    style: 'normal',
    weight: '400',
    variable: '--font-nevrada'
});

export const metadata: Metadata = {
  title: "Ismail Feham's Desktop",
  description: "My personal desktop",
    }
;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <Script src="/js-dos/js-dos.js"></Script>
      <Script src="/js-dos/script.js"></Script>
      <body className={`${nevrada.variable} ${nunito.variable} ${pixolde.variable} overflow-hidden`}>
          <Desktop>
              {children}
          </Desktop>
      </body>
      </html>
  );
}
