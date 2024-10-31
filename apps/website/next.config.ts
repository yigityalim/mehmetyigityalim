import type { NextConfig } from "next";

export default {
  devIndicators: {
    appIsrStatus: true,
    buildActivity: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mehmetyigityalim.com",
      },
    ],
  },
} satisfies NextConfig;
