import type { DirectiveMatch } from "./types";

export const DIRECTIVE_REGEXPS = {
  double: /\/\/\s*#(?<token>.*?)(?:\s+(?<expression>.*?))?\s*$/,
  triple: /\/\/\/\s*#(?<token>.*?)(?:\s+(?<expression>.*?))?\s*$/,
} as const;

export const getToken = (regExp: RegExp, line: string): DirectiveMatch | undefined => {
  const match = regExp.exec(line);
  if (!match?.groups) return undefined;
  return {
    token: match.groups.token ?? "",
    expression: match.groups.expression ?? "",
    column: match.index,
    length: match[0]?.length ?? 0,
  };
};
