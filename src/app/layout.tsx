import type { Metadata } from "next";
import { Noto_Serif, Nunito, VT323 } from "next/font/google";
import "./globals.css";
import Desktop from "@/components/os/Desktop";

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
    variable: '--font-vt323-serif'
});

const vt323 = VT323({
    weight: ['400'],
    subsets: ['latin'],
    style: 'normal',
    variable: '--font-vt323'
});

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
        <body className={`${noto.variable} ${nunito.variable} ${vt323.variable} overflow-hidden`}>
          <Desktop>
            {children}
          </Desktop>
        </body>
      </html>
  );
}
