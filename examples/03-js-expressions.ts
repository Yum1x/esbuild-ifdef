// Any valid JavaScript expression works: comparisons, &&/||/!, typeof,
// method calls, array/object literals, etc. Variables are in scope by name.
import { demo } from "./_util.ts";

await demo({
  title: "Arbitrary JS expressions",
  input: "inputs/expressions.ts",
  plugin: {
    variables: { VERSION: 3, LEGACY: false, CHANNEL: "beta-2", LEVEL: 20 },
  },
});
