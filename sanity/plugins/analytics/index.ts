/**
 * Analytics plugin for Sanity Studio.
 *
 * Registers a custom tool in the Studio sidebar showing
 * the full Phase 1 + Phase 2 funnel: assessments, leads,
 * active clients, archetype distribution, digest history.
 *
 * Usage — already wired in sanity.config.ts.
 */

import { definePlugin } from "sanity";
import { ActivityIcon } from "@sanity/icons";
import { AnalyticsTool } from "./AnalyticsTool";

export const analyticsPlugin = definePlugin(() => ({
  name: "analytics",
  tools: [
    {
      name: "analytics",
      title: "Analytics",
      icon: ActivityIcon,
      component: AnalyticsTool,
    },
  ],
}));
