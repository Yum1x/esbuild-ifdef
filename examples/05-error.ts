// #error / #err — abort the build with a compile-time error. Great for
// enforcing that required build variables are set.
import { demo } from "./_util.ts";

await demo({
  title: "#error · missing required variable (build fails)",
  description: 'No TARGET → typeof TARGET === "undefined" is true → the #err directive throws.',
  input: "inputs/guard.ts",
  plugin: { variables: {} },
});

await demo({
  title: "#error · requirement satisfied (build succeeds)",
  description: "TARGET defined → the #if is false → the #err is never reached.",
  input: "inputs/guard.ts",
  plugin: { variables: { TARGET: "node" } },
});
