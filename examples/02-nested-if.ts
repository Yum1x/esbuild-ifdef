// #if blocks can be nested arbitrarily.
import { demo } from "./_util.ts";

await demo({
  title: "Nested #if · browser + analytics",
  description: "Inner #if is only considered when the outer branch is taken.",
  input: "inputs/nested.ts",
  plugin: { variables: { PLATFORM: "browser", ANALYTICS: true } },
});

await demo({
  title: "Nested #if · node (outer #else taken, inner #if skipped entirely)",
  input: "inputs/nested.ts",
  plugin: { variables: { PLATFORM: "node", ANALYTICS: true } },
});
