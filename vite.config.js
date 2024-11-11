import { defineConfig } from "vite";
import { playwrightLauncher } from "@web/test-runner-playwright";

export default defineConfig({
  root: "./",
  nodeResolve: true, // Modülleri çözmek için kullanılır
  browsers: [
    playwrightLauncher({ product: "chromium" }), // Chrome kullanarak testleri çalıştırır
  ],
  files: "test/**/*.test.js", // Test dosyalarının bulunduğu dizin
  build: {
    outDir: "dist",
  },
});
