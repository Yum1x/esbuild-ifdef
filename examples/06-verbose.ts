// verbose: true — the plugin logs every kept line ("Including …") and every
// evaluated expression ("Expression … resulted with …") to the console during
// the build. Those lines appear between the "input" and "output" sections.
import { demo } from "./_util.ts";

await demo({
  title: "verbose: true",
  description: 'Watch for the "Including" / "Expression … resulted with" log lines.',
  input: "inputs/conditionals.ts",
  plugin: { verbose: true, variables: { NODE_ENV: "staging" } },
});
