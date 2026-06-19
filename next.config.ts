import type { NextConfig } from "next";

const isPagesExport = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  ...(isPagesExport && {
    output: 'export',
    basePath: '/recupmeseuros',
    images: { unoptimized: true },
    // API routes are excluded automatically in static export
  }),
  // Exclude API routes from static export
  ...(isPagesExport && {
    excludeDefaultMomentLocales: true,
  }),
};

export default nextConfig;
