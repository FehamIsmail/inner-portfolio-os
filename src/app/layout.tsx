import type { Metadata } from "next";
import { Noto_Serif, Nunito } from "next/font/google";
import "./globals.css";
import Desktop from "@/components/os/Desktop";

const nunito = Nunito({
    weight: [ '600', '700', '800', '900', '1000'],
    subsets: ['latin'],
    style: 'normal',
    variable: '--font-nunito'
});

const noto = Noto_Serif({
    weight: ['400', '700', '900'],
    subsets: ['latin'],
    style: 'normal',
    variable: '--font-noto-serif'
});

// const pixolde = localFont({
//     src: [
//         {
//             path: './Pixolde.ttf',
//             style: 'normal',
//             weight: '400'
//         },
//         // {
//         //     path: './Pixolde-Bold.ttf',
//         //     style: 'normal',
//         //     weight: '700'
//         // }
//    ],
//    variable: '--font-pixolde'
// });

// const pixolde = localFont({
//     src: '../assets/fonts/Pixolde.ttf',
//     display: 'swap',
// })

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
        <body className={`${noto.variable} ${nunito.variable} overflow-hidden`}>
          <Desktop>
            {children}
          </Desktop>
        </body>
      </html>
  );
}
