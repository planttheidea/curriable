import typescript from "rollup-plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

export default [
  {
    input: "src/index.ts",
    output: {
      exports: "named",
      name: "curriable",
      file: "dist/curriable.js",
      format: "umd",
      sourcemap: true
    },
    plugins: [typescript()]
  },
  {
    input: "src/index.ts",
    output: {
      exports: "named",
      name: "curriable",
      file: "dist/curriable.min.js",
      format: "umd"
    },
    plugins: [typescript(), uglify()]
  }
];
