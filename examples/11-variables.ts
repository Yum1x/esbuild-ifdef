// variables — the values exposed to directive expressions. Defaults to a copy
// of process.env. Note: env values are strings, so "false"/"0" are truthy —
// pass real booleans/numbers via `variables` when you need them.
import { demo } from "./_util.ts";

// 1) Explicit variables passed to the plugin.
await demo({
  title: "variables · passed explicitly",
  input: "inputs/variables.ts",
  plugin: { variables: { FEATURE_X: true } },
});

// 2) Default: when `variables` is omitted, process.env is used.
process.env.FEATURE_X = "1";
await demo({
  title: "variables · default process.env (FEATURE_X set in the environment)",
  description: 'No `variables` option → reads process.env.FEATURE_X (= "1", truthy).',
  input: "inputs/variables.ts",
  plugin: {},
});
