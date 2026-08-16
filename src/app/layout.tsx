import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "The KRMU Fresher Quiz by eOzka",
  description: "Official interactive orientation quiz presenter powered by eOzka",
  icons: {
    icon: "/eozka-monogram.svg",
    shortcut: "/eozka-monogram.svg",
    apple: "/eozka-monogram.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans relative">
        <div className="bg-canvas" aria-hidden="true">
          <div className="starfield" />
          <div className="bg-orb bg-orb-1" />
          <div className="bg-orb bg-orb-2" />
          <div className="bg-orb bg-orb-3" />
        </div>
        <div className="relative z-10 flex-1">{children}</div>
      </body>
    </html>
  );
}