// requireTripleSlash: false — accept double-slash directives (`// #if`) instead
// of requiring the triple slash (`/// #if`).
import { demo } from "./_util.ts";

for (const DEBUG of [true, false]) {
  await demo({
    title: `requireTripleSlash: false · DEBUG = ${DEBUG}`,
    input: "inputs/double-slash.ts",
    plugin: { requireTripleSlash: false, variables: { DEBUG } },
  });
}
