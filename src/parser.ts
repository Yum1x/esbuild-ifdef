import { toAnnotatedError, type AnnotatedError } from "./errors";
import { evalExpression } from "./evaluator";
import { getToken } from "./tokenizer";
import type { IfdefContext, ParseResult, Warn } from "./types";

export const parseIf = (
  context: IfdefContext,
  warn: Warn,
  file: string,
  lines: string[],
  start = 0,
  ignore = false,
): ParseResult => {
  const remove: number[] = [];
  let prune = false;
  let done = false;
  let i = start;
  try {
    for (i = start; i < lines.length; i += 1) {
      const line = lines[i];
      if (line === undefined) continue;
      const tokenData = getToken(context.regExp, line);
      if (prune || ignore) remove.push(i);
      if (!tokenData) {
        if (!prune && !ignore && context.verbose) {
          console.log("Including " + file + ":" + (i + 1));
        }
        continue;
      }
      remove.push(i);
      const { token, expression, column, length } = tokenData;
      switch (token) {
        case "if": {
          if (i !== start) {
            const nested = parseIf(context, warn, file, lines, i, prune || ignore);
            i = nested.end;
            for (const n of nested.remove) remove.push(n);
          } else {
            const exp = evalExpression(context, expression, i, file);
            done = exp;
            prune = !exp;
          }
          continue;
        }
        case "endif":
          return {
            end: i,
            remove,
          };
      }
      if (ignore || (prune && done)) continue;
      switch (token) {
        case "else":
          prune = done;
          break;
        case "elseif":
        case "elif": {
          const exp = evalExpression(context, expression, i, file);
          prune = done || !exp;
          if (!done) done = exp;
        }
      }
      if (prune) continue;
      switch (token) {
        case "warning":
        case "warn":
          warn({
            text: expression,
            location: {
              line: i + 1,
              lineText: line,
              column,
              length,
            },
          });
          break;
        case "error":
        case "err": {
          const err: AnnotatedError = new Error(expression);
          err.line = i;
          throw err;
        }
      }
    }
    throw new Error("Unterminated #if found on line " + start);
  } catch (caught) {
    const err = toAnnotatedError(caught);
    const lineNo = err.line ?? start;
    const lineText = lines[lineNo] ?? "";
    const tokenData = getToken(context.regExp, lineText);
    err.location = {
      line: lineNo + 1,
      lineText,
    };
    if (tokenData) {
      err.location.column = tokenData.column;
      err.location.length = tokenData.length;
    }
    throw err;
  }
};
export const format = (context: IfdefContext, source: string, file: string, warn: Warn): string => {
  const lines = source.split("\n");
  const removed = new Set<number>();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === undefined) continue;
    const tokenData = getToken(context.regExp, line);
    if (!tokenData) continue;
    switch (tokenData.token) {
      case "if": {
        const block = parseIf(context, warn, file, lines, i, false);
        i = block.end;
        for (const n of block.remove) removed.add(n);
        break;
      }
      case "warning":
      case "warn":
        removed.add(i);
        warn({
          text: tokenData.expression,
          location: {
            line: i + 1,
            lineText: line,
            column: tokenData.column,
            length: tokenData.length,
          },
        });
        break;
      case "error":
      case "err": {
        const err: AnnotatedError = new Error(tokenData.expression);
        err.line = i;
        err.location = {
          line: i + 1,
          lineText: line,
          column: tokenData.column,
          length: tokenData.length,
        };
        throw err;
      }
    }
  }
  return lines
    .map((line, i) => (removed.has(i) ? (context.fillWithSpaces ? " ".repeat(line.length) : "//" + line) : line))
    .join("\n");
};
