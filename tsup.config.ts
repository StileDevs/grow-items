import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  splitting: true,
  sourcemap: false,
  format: ["cjs", "esm"],
  dts: true,
  outDir: "dist",
  minify: true,
  clean: true
});
