import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "Martina Rink",
  url: "https://martinarink.com",
  description:
    "Private mentoring for high-achieving women at the intersection of identity, leadership, and the examined life. The Sober Muse Method and Female Empowerment & Leadership. By application, from €5,000.",
  email: "hello@martinarink.com",
  social: {
    linkedin: "https://www.linkedin.com/in/martinarink/",
    instagram: "https://www.instagram.com/martinarink_/",
  },
  pricing: {
    consultation: "€450",
    soberMuseFrom: "from €5,000",
    empowermentFrom: "from €7,500",
  },
} as const;
