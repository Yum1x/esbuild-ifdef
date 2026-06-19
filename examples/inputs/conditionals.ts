// @ts-nocheck
/// #if NODE_ENV === "production"
export const apiUrl = "https://api.example.com";
/// #elif NODE_ENV === "staging"
export const apiUrl = "https://staging.example.com";
/// #else
export const apiUrl = "http://localhost:3000";
/// #endif
