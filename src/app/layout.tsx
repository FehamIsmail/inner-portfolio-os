import type { Metadata } from "next";
import { Noto_Serif, Nunito } from "next/font/google";
import "./globals.css";
import Desktop from "@/components/os/Desktop";
import localFont from "next/dist/compiled/@next/font/dist/local";

const nunito = Nunito({
    weight: ['400', '500', '600', '700', '800', '900', '1000'],
    subsets: ['latin'],
    style: 'normal',
    variable: '--font-nunito'
});

const noto = Noto_Serif({
    weight: ['400', '600', '700', '800', '900'],
    subsets: ['latin'],
    style: 'normal',
    variable: '--font-noto-serif'
});

const millennium = localFont({
    src: '../assets/fonts/Millennium.ttf',
    variable: '--font-millennium'
})

export const metadata: Metadata = {
  title: "Ismail Feham's Desktop",
  description: "My personal desktop",};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body className={`${noto.variable} ${nunito.variable} ${millennium.variable} overflow-hidden`}>
          <Desktop>
            {children}
          </Desktop>
        </body>
      </html>
  );
}
