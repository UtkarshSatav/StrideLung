import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // pin the workspace root to this project (a lockfile higher up would otherwise be picked)
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
};

export default nextConfig;
