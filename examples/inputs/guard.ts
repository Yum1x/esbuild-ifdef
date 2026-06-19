// @ts-nocheck
// Guard with `typeof` — referencing a variable that was never provided would
// throw a ReferenceError before the #error directive is ever reached.
/// #if typeof TARGET === "undefined"
/// #err Build variable "TARGET" is required (e.g. variables: { TARGET: "node" })
/// #endif

export const target = "ready";
