import { Playfair_Display, DM_Sans, Dancing_Script } from "next/font/google";

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

// Script accent — substitute for Buffalo
export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});
