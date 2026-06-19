import ifdefPlugin, { type IPluginSettings } from "../dist/index.mjs";
import type { OnLoadArgs, OnLoadResult, PluginBuild } from "esbuild";
// fillWithSpaces — controls HOW removed lines are blanked in the text handed
// to esbuild: commented out with `//` (default) or replaced with spaces.
// esbuild then strips both, so the final JS is identical; the difference only
// matters for the intermediate text (space-filling keeps original column
// offsets, which yields more accurate source-map positions).
//
// To make the raw difference visible, this example bypasses esbuild's compile
// step and calls the plugin's onLoad directly to capture what it produces.
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const input = resolve(here, "inputs/spacing.ts");
const rule = "─".repeat(74);

type OnLoadCallback = (args: OnLoadArgs) => OnLoadResult | null | undefined | Promise<OnLoadResult | null | undefined>;

/** Invoke the plugin's onLoad in isolation to capture its raw output. */
async function transform(settings: IPluginSettings): Promise<string> {
  const callbacks: OnLoadCallback[] = [];
  const stub = {
    onLoad: (_filter: unknown, callback: OnLoadCallback) => void callbacks.push(callback),
  } as unknown as PluginBuild;

  ifdefPlugin(settings).setup(stub);
  const onLoad = callbacks[0];
  if (!onLoad) throw new Error("plugin registered no onLoad handler");

  const result = await onLoad({ path: input } as OnLoadArgs);
  const contents = result && "contents" in result ? result.contents : undefined;
  return typeof contents === "string" ? contents : "";
}

const source = await readFile(input, "utf8");
console.log(`\ninput · inputs/spacing.ts\n${rule}\n${source.replace(/\n+$/, "")}`);

console.log(`\nfillWithSpaces: false (default) — removed lines commented out\n${rule}`);
console.log((await transform({ variables: { INCLUDE_SECRET: false } })).replace(/\n+$/, ""));

console.log(`\nfillWithSpaces: true — removed lines replaced with spaces\n${rule}`);
const spaced = await transform({ fillWithSpaces: true, variables: { INCLUDE_SECRET: false } });
// Render spaces as middots so the effect is visible in a terminal.
console.log(spaced.replace(/\n+$/, "").replace(/ /g, "·"));
console.log("");
