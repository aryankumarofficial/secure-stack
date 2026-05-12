import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.{ts,tsx}"],
  outDir: "dist",
  format: ["esm"],
  target: "node22",
  platform: "node",
  bundle: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: false,
  minify: false,
  dts: false,
});
