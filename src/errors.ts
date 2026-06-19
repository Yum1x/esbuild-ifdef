import type { DirectiveLocation } from "./types";

export type AnnotatedError = Error & {
  line?: number;
  location?: DirectiveLocation;
};

export const toAnnotatedError = (value: unknown): AnnotatedError => {
  if (value instanceof Error) return value as AnnotatedError;
  return new Error(String(value)) as AnnotatedError;
};
