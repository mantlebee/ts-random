import typescript from "@rollup/plugin-typescript";

const outDir = "dist";

// Peer dependency: resolved by the consumer, never bundled.
const external = ["@mantlebee/ts-core"];

export default [
  // CommonJS single-file bundle, kept for `require` consumers.
  // Also emits the declarations into `dist/src`.
  {
    input: "src/index.ts",
    external,
    output: {
      dir: outDir,
      format: "cjs",
      sourcemap: true,
    },
    plugins: [typescript({ tsconfig: "tsconfig.prod.json" })],
  },
  // ES modules, one file per source module, so bundlers can tree-shake.
  {
    input: "src/index.ts",
    external,
    output: {
      dir: `${outDir}/esm`,
      format: "es",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: "src",
      // npm never packs nested `node_modules` folders, so the inlined
      // tslib helpers are moved to `vendor`.
      entryFileNames: ({ name }) =>
        `${name.replace(/node_modules/g, "vendor")}.mjs`,
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
