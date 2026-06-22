import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next ships legacy "extends" presets. ESLint 9 flat config can't
// spread them directly (it throws "Plugin '' not found"), so we bridge them with
// FlatCompat. tsc --noEmit (`npm run typecheck`) remains the authoritative
// type-safety gate; production builds run with `next build --no-lint`.
const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const eslintConfig = [
  ...compat.config({ extends: ["next/core-web-vitals", "next/typescript"] }),
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
];

export default eslintConfig;
