import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        background: "src/background.ts",
        content: "src/content.ts",
        devtools: "ui/devtools.html",
        popup: "ui/popup.html"
      },
      output: {
        entryFileNames: "dist/[name].js",
        chunkFileNames: "dist/chunks/[name].js",
        assetFileNames: "dist/assets/[name][extname]"
      }
    }
  }
});
