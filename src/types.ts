import type { PartialMessage } from "esbuild";

/**
 * Configuration options for the `ifdef` esbuild plugin.
 */
export interface IPluginSettings {
  /**
   * Log detailed information about included/excluded lines and the result of
   * every evaluated expression.
   *
   * @defaultValue `false`
   */
  verbose?: boolean;

  /**
   * Custom regular expression used to parse directives. Overrides
   * {@link IPluginSettings.requireTripleSlash}.
   *
   * The expression must expose two named capture groups: `token` and
   * `expression`.
   */
  regExp?: RegExp;

  /**
   * Regular expression matched against the path of every loaded file. Only
   * matching files are processed.
   *
   * @defaultValue `/\.[jt]sx?/`
   */
  filePath?: RegExp;

  /**
   * Require directives to be prefixed with a triple slash (`///`). When set
   * to `false`, a double slash (`//`) is accepted instead.
   *
   * @defaultValue `true`
   */
  requireTripleSlash?: boolean;

  /**
   * Replace removed lines with whitespace instead of commenting them out.
   *
   * @defaultValue `false`
   */
  fillWithSpaces?: boolean;

  /**
   * Variables made available to directive expressions. Names that are not
   * valid JavaScript identifiers are ignored.
   *
   * @defaultValue a copy of `process.env`
   */
  variables?: Record<string, unknown>;
}

/** A directive parsed out of a single source line. */
export interface DirectiveMatch {
  token: string;
  expression: string;
  /** 0-based byte column where the directive starts. */
  column: number;
  /** Length of the matched directive text. */
  length: number;
}

/** Location metadata attached to an error so esbuild can render it. */
export interface DirectiveLocation {
  line: number;
  lineText: string;
  column?: number;
  length?: number;
}

/** Result of parsing a single `#if`/`#endif` block. */
export interface ParseResult {
  /** Index of the matching `#endif` line. */
  end: number;
  /** Indices of every line that should be stripped from the output. */
  remove: number[];
}

/** Callback used to surface a `#warning` directive through esbuild. */
export type Warn = (message: PartialMessage) => void;

/**
 * Resolved, immutable configuration shared by the parsing pipeline. Built once
 * per plugin instance so the parser, tokenizer and evaluator stay pure.
 */
export interface IfdefContext {
  readonly regExp: RegExp;
  readonly verbose: boolean;
  readonly fillWithSpaces: boolean;
  /** Variable names usable as `Function` parameters. */
  readonly variableNames: readonly string[];
  /** Values matching {@link IfdefContext.variableNames} positionally. */
  readonly variableValues: readonly unknown[];
}
