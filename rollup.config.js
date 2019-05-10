import typescript from "rollup-plugin-typescript2";
import packagejson from "./package.json";

export default {
  input: "./src/index.ts",
  plugins: [typescript(/*{ plugin options }*/)],
  output: {
    intro: `/* fastidious ${packagejson.version} - https://github.com/johnste/fastidious */`,
    file: "dist/index.js",
    format: "umd",
    name: "fastidious"
  }
};
