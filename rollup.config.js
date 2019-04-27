import typescript from "rollup-plugin-typescript2";

export default {
  input: "./src/index.ts",
  plugins: [typescript(/*{ plugin options }*/)],
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "fastidious"
  }
};
