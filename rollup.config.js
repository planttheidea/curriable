import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const UMD_CONFIG = {
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  input: "src/index.ts",
  output: {
    exports: "named",
    name: pkg.name,
    file: pkg.browser,
    format: "umd",
    sourcemap: true
  },
  plugins: [
    typescript({
      typescript: require("typescript")
    })
  ]
};

const FORMATTED_CONFIG = {
  ...UMD_CONFIG,
  output: [
    {
      ...UMD_CONFIG.output,
      file: pkg.main,
      format: "cjs"
    },
    {
      ...UMD_CONFIG.output,
      file: pkg.module,
      format: "es"
    }
  ]
};

export default [
  UMD_CONFIG,
  FORMATTED_CONFIG,
  {
    ...UMD_CONFIG,
    output: {
      ...UMD_CONFIG.output,
      file: pkg.browser.replace(".js", ".min.js"),
      sourcemap: false
    },
    plugins: [...UMD_CONFIG.plugins, terser()]
  }
];
