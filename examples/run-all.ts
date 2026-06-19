// Runs every example in order. Requires a build first (`yarn build`), since the
// examples import the plugin from ../dist. Use `yarn examples` to do both.
import { readdir } from "node:fs/promises";
import { basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const self = basename(process.argv[1]);

const entries = await readdir(here, { withFileTypes: true });
const examples = entries
  .filter(entry => entry.isFile())
  .map(entry => entry.name)
  .filter(name => name.endsWith(".ts") && !name.startsWith("_") && name !== self)
  .sort();

for (const name of examples) {
  console.log("\n\n########## " + name + " ##########");
  await import("./" + name);
}
