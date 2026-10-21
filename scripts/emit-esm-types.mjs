// The declarations in `dist/src` are CommonJS for Node.js, since the package
// has no `"type": "module"`. ESM consumers need ES declarations, `.d.mts`, or
// TypeScript reports the package as "masquerading as CJS". This copies every
// `.d.ts` next to the ESM build as `.d.mts`, adding the extensions that ES
// modules require to the relative imports.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const sourceDir = "dist/src";
const targetDir = "dist/esm";

const relativeSpecifier = /(\bfrom\s+|\bimport\s*\(\s*)"(\.{1,2}\/[^"]*)"/g;

function withExtension(fromDir, specifier) {
    if (existsSync(join(fromDir, `${specifier}.d.ts`))) return `${specifier}.mjs`;
    if (existsSync(join(fromDir, specifier, "index.d.ts"))) return `${specifier}/index.mjs`;
    throw new Error(`emit-esm-types: cannot resolve "${specifier}" from ${fromDir}`);
}

for (const entry of readdirSync(sourceDir, { recursive: true })) {
    if (!entry.endsWith(".d.ts")) continue;
    const sourcePath = join(sourceDir, entry);
    const fromDir = dirname(sourcePath);
    const code = readFileSync(sourcePath, "utf8").replace(
        relativeSpecifier,
        (_, prefix, specifier) => `${prefix}"${withExtension(fromDir, specifier)}"`
    );
    const targetPath = join(targetDir, relative(sourceDir, sourcePath)).replace(/\.d\.ts$/, ".d.mts");
    mkdirSync(dirname(targetPath), { recursive: true });
    writeFileSync(targetPath, code);
}
