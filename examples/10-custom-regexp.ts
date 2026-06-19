// regExp — fully custom directive syntax. Overrides requireTripleSlash. The
// RegExp must expose two named groups: `token` and `expression`.
// Here we accept `// @if EXPR`, `// @else`, `// @endif`, etc.
import { demo } from "./_util.ts";

const atSyntax = /\/\/\s*@(?<token>\w+)(?:\s+(?<expression>.*?))?\s*$/;

for (const USE_TYPESCRIPT of [true, false]) {
  await demo({
    title: `Custom regExp ("// @if") · USE_TYPESCRIPT = ${USE_TYPESCRIPT}`,
    input: "inputs/custom-syntax.ts",
    plugin: { regExp: atSyntax, variables: { USE_TYPESCRIPT } },
  });
}
