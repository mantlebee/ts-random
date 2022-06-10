import cleaner from "rollup-plugin-cleaner";
import typescript from "@rollup/plugin-typescript";

const outDir = "dist"

export default {
    input: "src/index.ts",
    output: {
        dir: outDir,
        format: "cjs",
    },
    plugins: [
        cleaner({ targets: [outDir] }),
        typescript({ tsconfig: "tsconfig.prod.json" })
    ]
};