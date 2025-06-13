import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { compileWasm } from "../src/plugins/wasm-compiler";

const argv = yargs(hideBin(process.argv))
  .option("release", {
    type: "boolean",
    default: false,
    describe: "Build in release mode",
  })
  .option("outDir", {
    type: "string",
    describe: "Output directory for artifacts",
  })
  .demandOption("outDir", "Output directory is required")
  .option("repo", {
    type: "string",
    describe: "Repository name",
  })
  .demandOption("repo", "Repository name is required")
  .help()
  .parseSync();

async function main() {
  const release = argv.release;
  const outputDir = argv.outDir;
  const internalDir = resolve(process.cwd(), "..");
  const repoDir = resolve(internalDir, "..");
  const asmLibDir = resolve(internalDir, "assemblyscript");
  const levelDir = resolve(repoDir, "level");
  const codeDir = resolve(repoDir, "level", "code");
  const genDir = resolve(codeDir, "generated");

  const packageJson = JSON.parse(
    readFileSync(resolve(internalDir, "package.json"), "utf-8")
  );
  const tmplVersion = packageJson.version;
  const engineVersion = readFileSync(
    resolve(repoDir, "engine_version.txt"),
    "utf-8"
  );
  const levelFile = resolve(codeDir, "main.ts");

  const artifacts = await compileWasm({
    metadata: {
      engineVersion,
      tmplVersion,
      repo: argv.repo,
    },
    sourceFiles: [levelFile],
    release,
    asmLibDir,
    levelDir,
    genDir,
  });

  writeFileSync(resolve(outputDir, "main.d.ts"), artifacts.dts);
  writeFileSync(resolve(outputDir, "main.js"), artifacts.js);
  if (artifacts.text) {
    writeFileSync(resolve(outputDir, "main.wat"), artifacts.text);
  }
  writeFileSync(resolve(outputDir, "main.wasm"), artifacts.wasm);
  console.log(`WASM compilation complete. Artifacts written to ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
