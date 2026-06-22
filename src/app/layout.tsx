import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universe Flashcard Quiz",
  description: "A Next.js full-stack flashcard quiz app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans relative">
        {/* Universe SVG background */}
        <div className="universe-bg" aria-hidden="true">
          <svg width="100%" height="100%" id="universeSVG">
            <circle className="planet" cx="10%" cy="80%" r="70"></circle>
            <circle className="planet2" cx="85%" cy="20%" r="50"></circle>
            <g id="stars"></g>
            <g id="comets"></g>
          </svg>
        </div>
        <div className="main-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
