import typescript from "@rollup/plugin-typescript";

const outDir = "dist";

// Peer dependency: resolved by the consumer, never bundled.
const external = ["@mantlebee/ts-core"];

/**
 * TypeScript compiles enums as `var X; (function (X) { ... })(X || (X = {}));`,
 * which bundlers cannot prove side-effect free, so every enum ends up in the
 * consumer's bundle even when unused. This rewrites them as
 * `var X = /*#__PURE__*\/ (function (X) { ...; return X; })({});`
 * (the same shape Babel emits), which bundlers can drop.
 */
const pureEnums = () => ({
    name: "pure-enums",
    transform(code) {
        const enumPattern = /var (\w+);\s*\(function \(\1\) \{([\s\S]*?)\n\}\)\(\1 \|\| \(\1 = \{\}\)\);/g;
        if (!enumPattern.test(code)) return null;
        return {
            code: code.replace(
                enumPattern,
                "var $1 = /*#__PURE__*/ (function ($1) {$2\n    return $1;\n})({});"
            ),
            map: null,
        };
    },
});

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
        plugins: [
            typescript({ tsconfig: "tsconfig.prod.json" }),
            pureEnums(),
        ]
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
            entryFileNames: ({ name }) => `${name.replace(/node_modules/g, "vendor")}.mjs`,
        },
        plugins: [
            typescript({
                tsconfig: "tsconfig.prod.json",
                declaration: false,
                declarationDir: undefined,
                outDir: `${outDir}/esm`,
            }),
            pureEnums(),
        ]
    }
];
