import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

// The bundle is committed and served by the integration (see frontend.py).
export default {
  input: "src/drive-route-card.ts",
  output: {
    file: "../custom_components/drive_route_card/www/drive-route-card.js",
    format: "es",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript({ noEmit: false, rewriteRelativeImportExtensions: true }),
    terser({ format: { comments: false } }),
  ],
};
