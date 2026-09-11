import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// 실제 기상청/농사로 API를 붙일 때 이 목록에 도메인을 추가하면
// 서비스워커가 해당 API 응답을 오프라인 캐시 전략에 포함시킵니다.
// 사용법은 README.md의 "실제 공공데이터 API 연동하기" 참고.
const API_CACHE_PATTERNS = [
  // 예시) 기상청 단기예보 API
  // { urlPattern: /^https:\/\/apis\.data\.go\.kr\/1360000\//, cacheName: "kma-weather" },
  // 예시) 농사로 Open API
  // { urlPattern: /^https:\/\/apis\.data\.go\.kr\/1390802\//, cacheName: "nongsaro" },
];

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/favicon-32.png"],
      manifest: {
        id: "/",
        name: "농업AI비서",
        short_name: "농업AI비서",
        description: "기상청 날씨, 농사로 비료 정보, 병해충 예방까지 한 곳에서 확인하는 농업인용 도우미",
        lang: "ko",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#F1EFE4",
        theme_color: "#2F5233",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
        runtimeCaching: [
          ...API_CACHE_PATTERNS.map(({ urlPattern, cacheName }) => ({
            urlPattern,
            handler: "NetworkFirst",
            options: {
              cacheName,
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 3 },
              cacheableResponse: { statuses: [0, 200] }
            }
          })),
          {
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "cdn-fonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
    server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/kma-api": {
        target: "https://apihub.kma.go.kr",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kma-api/, ""),
      },
    },
  }
  
});
