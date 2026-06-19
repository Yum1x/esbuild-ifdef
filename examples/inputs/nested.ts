// @ts-nocheck
/// #if PLATFORM === "browser"
import { mount } from "./dom";
/// #if ANALYTICS
export const analytics = true;
/// #endif
export const platform = "browser";
/// #else
export const platform = "node";
/// #endif
