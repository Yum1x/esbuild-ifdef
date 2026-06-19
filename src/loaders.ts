import type { Loader } from "esbuild";

const SUPPORTED_LOADERS = ["tsx", "jsx", "ts", "js"] as const satisfies readonly Loader[];
type SupportedLoader = (typeof SUPPORTED_LOADERS)[number];

const isSupportedLoader = (extension: string): extension is SupportedLoader =>
  (SUPPORTED_LOADERS as readonly string[]).includes(extension);

export const resolveLoader = (extension: string): Loader => (isSupportedLoader(extension) ? extension : "js");
