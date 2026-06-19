// #warning / #warn — surface a compile-time warning through esbuild's
// warnings channel. Works standalone or inside an included branch; a warning
// inside a branch that is pruned away does NOT fire.
import { demo } from "./_util.ts";

await demo({
  title: "#warning · standalone + inside the taken branch",
  description: "EXPERIMENTAL = true → both the top-level and in-branch warnings fire.",
  input: "inputs/messages.ts",
  plugin: { variables: { EXPERIMENTAL: true } },
});

await demo({
  title: "#warning · in-branch warning is pruned",
  description: "EXPERIMENTAL = false → only the standalone warning fires.",
  input: "inputs/messages.ts",
  plugin: { variables: { EXPERIMENTAL: false } },
});
