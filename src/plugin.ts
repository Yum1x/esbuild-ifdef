import { toAnnotatedError } from "./errors";
import { buildVariableScope } from "./evaluator";
import { resolveLoader } from "./loaders";
import { format } from "./parser";
import { DIRECTIVE_REGEXPS } from "./tokenizer";
import type { IfdefContext, IPluginSettings, Warn } from "./types";
import type { PartialMessage, Plugin } from "esbuild";
import { readFile } from "node:fs/promises";

const PLUGIN_NAME = "ifdef";

export const ifdefPlugin = (settings: IPluginSettings = {}): Plugin => {
  const { names, values } = buildVariableScope({ ...(settings.variables ?? process.env) });
  const context = {
    regExp:
      settings.regExp ?? (settings.requireTripleSlash !== false ? DIRECTIVE_REGEXPS.triple : DIRECTIVE_REGEXPS.double),
    verbose: settings.verbose ?? false,
    fillWithSpaces: settings.fillWithSpaces ?? false,
    variableNames: names,
    variableValues: values,
  } satisfies IfdefContext;
  const fileRegExp = settings.filePath ?? /\.[jt]sx?/;

  return {
    name: PLUGIN_NAME,
    setup(build) {
      build.onLoad({ filter: fileRegExp }, async args => {
        const warnings: PartialMessage[] = [];
        const warn: Warn = message => {
          warnings.push({
            ...message,
            location: { ...message.location, file: args.path },
            pluginName: PLUGIN_NAME,
          });
        };

        try {
          const source = await readFile(args.path, "utf8");
          const contents = format(context, source, args.path, warn);
          const extension = args.path.split(".").pop() ?? "";
          return {
            contents,
            warnings,
            loader: resolveLoader(extension),
          };
        } catch (caught) {
          const err = toAnnotatedError(caught);
          if (!err.location) throw err;
          return {
            warnings,
            errors: [
              {
                text: err.message,
                detail: err,
                location: { file: args.path, ...err.location },
                pluginName: PLUGIN_NAME,
              },
            ],
          };
        }
      });
    },
  };
};
