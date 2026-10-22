import { existsSync, readdirSync } from "node:fs";

import typescript from "@rollup/plugin-typescript";

const outDir = "dist";

// Peer dependency: resolved by the consumer, never bundled.
const external = ["@mantlebee/ts-core"];

// The package root and the barrel of each area, the subpaths of `exports`:
// as inputs, the barrels are emitted even if they only re-export.
const input = [
  "src/index.ts",
  ...readdirSync("src", { withFileTypes: true })
    .filter((a) => a.isDirectory())
    .map((a) => `src/${a.name}/index.ts`)
    .filter((a) => existsSync(a)),
];

// npm never packs nested `node_modules` folders, so the inlined tslib helpers
// are moved to `vendor`.
const entryFileNames =
  (extension) =>
  ({ name }) =>
    `${name.replace(/node_modules/g, "vendor")}.${extension}`;

export default [
  // CommonJS, one file per source module, so `require` consumers can load an
  // area only, e.g. `@mantlebee/ts-random/passwords`.
  // Also emits the declarations into `dist/src`.
  {
    input,
    external,
    output: {
      dir: outDir,
      format: "cjs",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: entryFileNames("js"),
    },
    plugins: [typescript({ tsconfig: "tsconfig.prod.json" })],
  },
  // ES modules, one file per source module, so bundlers can tree-shake.
  {
    input,
    external,
    output: {
      dir: `${outDir}/esm`,
      format: "es",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: entryFileNames("mjs"),
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.prod.json",
        declaration: false,
        declarationDir: undefined,
        outDir: `${outDir}/esm`,
      }),
    ],
  },
];
