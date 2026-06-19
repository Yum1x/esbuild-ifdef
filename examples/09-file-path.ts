// filePath — a RegExp matched against each file's path. Only matching files are
// processed; everything else passes through esbuild untouched.
import { demo } from "./_util.ts";

await demo({
  title: "filePath · default (/\\.[jt]sx?/) — file IS processed",
  description: "PROCESS_ME = false → the conditional branch is removed.",
  input: "inputs/file-path.ts",
  plugin: { variables: { PROCESS_ME: false } },
});

await demo({
  title: "filePath · custom /\\.jsx$/ — .ts file is NOT processed",
  description: "The filter never matches, so directives are left as plain comments.",
  input: "inputs/file-path.ts",
  plugin: { filePath: /\.jsx$/, variables: { PROCESS_ME: false } },
});
