// @ts-nocheck
// Directives accept any valid JavaScript expression.

/// #if VERSION >= 2 && !LEGACY
export const useModernApi = true;
/// #endif

/// #if typeof CHANNEL === "string" && CHANNEL.startsWith("beta")
export const beta = true;
/// #endif

/// #if [10, 20, 30].includes(LEVEL)
export const knownLevel = true;
/// #endif
