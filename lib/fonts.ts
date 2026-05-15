import { Playfair_Display, DM_Sans } from "next/font/google";
import localFont from "next/font/local";

// Display font — substitute for Bodoni Moda
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// Body font — substitute for Brandon Grotesque
export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Script accent — Sloop Script (premium editorial typeface)
export const dancingScript = localFont({
  src: [
    {
      path: "../app/fonts/SloopScript.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/SloopScript.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-dancing-script",
  display: "swap",
});
