/** @type {import('next').NextConfig} */
const nextConfig = {
  // In production the top-level `/api/*` Vercel Functions are deployed as
  // standalone serverless functions alongside this Next app. During `next dev`
  // they are not served, so proxy them to the existing local API server
  // (`npm run dev:local`, port 4732) — the same target the old CRA `proxy`
  // field used.
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:4732/api/:path*",
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
