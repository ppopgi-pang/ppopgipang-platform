import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
// import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/pages",
      generatedRouteTree: "./src/shared/lib/@generated/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "뽑기팡",
        short_name: "뽑기팡",
        description: "전국 뽑기방 지도·리뷰·중고거래 플랫폼",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        // Avoid SPA fallback for API OAuth callbacks.
        navigateFallbackDenylist: [/^\/api\//],
      },
    }),
    // tsconfigPaths(),
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
    ],
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
});
