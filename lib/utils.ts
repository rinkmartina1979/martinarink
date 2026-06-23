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
  email: "contact@martinarink.com",
  social: {
    linkedin: "https://www.linkedin.com/in/martinarink/",
    instagram: "https://www.instagram.com/martinarink_/",
    spotify: "https://open.spotify.com/show/4ibhGsWMIZMTBBPNQqlmTv",
  },
  pricing: {
    consultation: "€350",
    soberMuseFrom: "from €5,000",
    empowermentFrom: "from €7,000",
    soberMuseRange: "€5,000 – €13,000",
    empowermentRange: "€7,000 – €14,000",
  },
  assessment: {
    count: 10,
    minutes: 5,
    questionsPhrase: "Ten questions",
    durationPhrase: "about five minutes",
  },
} as const;
