import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  target: "es2022",
  dts: true,
  sourcemap: true,
  minify: true,
  treeshake: true,
  clean: true,
});
