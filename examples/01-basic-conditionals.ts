// #if / #elif / #else / #endif — pick exactly one branch at build time.
// (`#elseif` is also accepted as an alias of `#elif`.)
import { demo } from "./_util.ts";

for (const NODE_ENV of ["production", "staging", "development"]) {
  await demo({
    title: `Basic conditionals · NODE_ENV = "${NODE_ENV}"`,
    input: "inputs/conditionals.ts",
    plugin: { variables: { NODE_ENV } },
  });
}
