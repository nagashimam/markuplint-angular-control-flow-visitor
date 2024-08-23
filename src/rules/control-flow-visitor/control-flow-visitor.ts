import type { CreatePluginSettings } from "@markuplint/ml-core";
import fs from "fs";
import { createRule } from "@markuplint/ml-core";
import { execAgainstEachFragment } from "../../executor/index.js";
import { generateFragmentsFromTemplateFile } from "../../generator/index.js";
import { MainValue, Options, Context, Verify } from "../../types.js";

export const controlFlowVisitor = (_settings: CreatePluginSettings) =>
  createRule<MainValue, Options>({
    defaultSeverity: "error",
    defaultValue: "__DEFAULT_MAIN_VALUE__",
    verify,
  });

const verify: Verify = async (context: Context) => {
  const { document, report } = context;

  if (!document.filename) {
    report({
      line: 1,
      col: 1,
      raw: "",
      message: "file not found. Check the path and try again",
    });
    return;
  }

  // Running exec in verify in turn invokes verify with an anonymous file. In order to avoid infinite loop, skip if document is anonymous
  const isAnonymousFile = !fs.existsSync(document.filename);
  if (isAnonymousFile) {
    return;
  }

  const fragments = generateFragmentsFromTemplateFile(document.filename);
  for (const fragment of fragments) {
    // each invocation has to be awaited for exec to complete normally
    await execAgainstEachFragment(fragment, context);
  }
};
