import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin tracing root to this project so module paths don't get mangled
  // by the parent folder name "martinarink-next" (the "-next" suffix
  // triggers a path-stripping bug in Next.js's webpack output on Windows).
  outputFileTracingRoot: path.resolve(__dirname),
  transpilePackages: ["sanity", "next-sanity"],
};

export default nextConfig;
