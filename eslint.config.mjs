import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";
import nextTs from "eslint-config-next/typescript.js";

// NOTE: eslint-config-next has partial ESLint 9 flat-config support in 15.x.
// "Plugin not found" / "not iterable" warnings are upstream issues.
// TypeScript (tsc --noEmit) is the authoritative type-safety check.
// Use `npm run typecheck` before deploying.

function toArray(cfg) {
  if (Array.isArray(cfg)) return cfg;
  if (cfg && typeof cfg === "object") return [cfg];
  return [];
}

const eslintConfig = defineConfig([
  ...toArray(nextVitals),
  ...toArray(nextTs),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
