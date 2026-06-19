import ifdefPlugin, { type IPluginSettings } from "../dist/index.mjs";
import { build, type BuildFailure, type BuildOptions } from "esbuild";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const rule = (ch = "─"): string => ch.repeat(74);

export interface DemoOptions {
  title: string;
  description?: string;
  /** Input file, relative to `example/`. */
  input: string;
  /** Settings forwarded to the ifdef plugin. */
  plugin?: IPluginSettings;
  /** Extra esbuild options merged into the build call. */
  esbuild?: BuildOptions;
}

/**
 * Runs esbuild on a single input file with the ifdef plugin, then prints the
 * input, the resulting output and any warnings/errors.
 */
export async function demo({ title, description, input, plugin = {}, esbuild = {} }: DemoOptions): Promise<void> {
  const entry = resolve(here, input);
  const source = await readFile(entry, "utf8");

  console.log("\n" + rule("━"));
  console.log("  " + title);
  if (description) console.log("  " + description);
  console.log(rule("━"));
  console.log(`\ninput · ${input}\n${rule()}`);
  console.log(source.replace(/\n+$/, ""));

  try {
    const result = await build({
      entryPoints: [entry],
      write: false,
      bundle: false,
      logLevel: "silent",
      plugins: [ifdefPlugin(plugin)],
      ...esbuild,
    });

    console.log(`\noutput\n${rule()}`);
    console.log((result.outputFiles?.[0]?.text ?? "").replace(/\n+$/, "") || "(empty)");

    if (result.warnings.length > 0) {
      console.log(`\nwarnings\n${rule()}`);
      for (const w of result.warnings) {
        console.log(`  ⚠ ${w.text}${w.location ? ` (line ${w.location.line})` : ""}`);
      }
    }
  } catch (error) {
    console.log(`\nbuild failed — expected for #error demos\n${rule()}`);
    const errors = (error as Partial<BuildFailure>).errors ?? [];
    if (errors.length === 0) {
      console.log(`  ✖ ${error instanceof Error ? error.message : String(error)}`);
    } else {
      for (const e of errors) {
        console.log(`  ✖ ${e.text}${e.location ? ` (line ${e.location.line})` : ""}`);
      }
    }
  }
  console.log("");
}
