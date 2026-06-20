import type { NextConfig } from "next";

const isPagesExport = process.env.GITHUB_PAGES === 'true';
const basePath = isPagesExport ? '/recupmeseuros' : '';

const nextConfig: NextConfig = {
  // Exposed to the client so components can prefix public/ asset paths.
  // next/image with `unoptimized` does NOT prepend basePath to its src, so any
  // image under public/ must be prefixed manually to resolve on GitHub Pages.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(isPagesExport && {
    output: 'export',
    basePath,
    images: { unoptimized: true },
    // API routes are excluded automatically in static export
  }),
  // Exclude API routes from static export
  ...(isPagesExport && {
    excludeDefaultMomentLocales: true,
  }),
};

export default nextConfig;
