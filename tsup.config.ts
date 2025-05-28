import { defineConfig } from "tsup";
import { readFile, readFileSync } from "fs";

const license = readFileSync("./LICENSE", "utf-8");
const pkg = JSON.parse(readFileSync("./package.json", "utf-8")) as Record<string, string>;

export default defineConfig({
  entry: ["lib/index.ts"],
  splitting: true,
  sourcemap: false,
  format: ["cjs", "esm"],
  dts: true,
  bundle: true,
  banner: {
    js: `
/*!
 * grow-items v${pkg.version}
 * Copyright ${new Date().getFullYear()}
 * Licensed under MIT (https://github.com/StileDevs/grow-items/blob/main/LICENSE) 
*/
`
  },
  outDir: "dist",
  minify: true,
  clean: true
});
