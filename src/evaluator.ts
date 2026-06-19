import type { AnnotatedError } from "./errors";
import type { IfdefContext } from "./types";

const IDENTIFIER_REGEXP = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

const isValidIdentifier = (name: string): boolean => IDENTIFIER_REGEXP.test(name);

export const buildVariableScope = (
  variables: Record<string, unknown>,
): {
  names: string[];
  values: unknown[];
} => {
  const names = Object.keys(variables).filter(isValidIdentifier);
  const values = names.map(name => variables[name]);
  return { names, values };
};

export const evalExpression = (context: IfdefContext, expression: string, line: number, file: string): boolean => {
  const body = expression.trim() === "" ? "return false;" : `return (${expression});`;
  try {
    const fn = new Function(...context.variableNames, body);
    const result = Boolean(fn(...context.variableValues));
    if (context.verbose) {
      console.log(`Expression "${expression}" at ${file}:${line + 1} resulted with ${result}`);
    }
    return result;
  } catch (caught) {
    const err: AnnotatedError =
      caught instanceof Error ? caught : new Error("Error executing expression: " + String(caught));
    err.line = line;
    throw err;
  }
};
