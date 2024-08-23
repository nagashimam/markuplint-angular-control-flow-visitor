import { parseTemplate, ParsedTemplate } from "@angular/compiler";
import fs from "fs";
import { convertParsedTemplatesToHTMLFragments } from "./converter/index.js";
import { evaluateParsedTemplate } from "./evaluator/index.js";
import { Fragment } from "../types.js";

export const generateFragmentsFromTemplateFile = (
  filename: string,
): Fragment[] => {
  const sourceCode = fs.readFileSync(filename, "utf8");
  const parsedTemplate: ParsedTemplate = parseTemplate(sourceCode, filename, {
    preserveWhitespaces: true,
    preserveLineEndings: true,
    collectCommentNodes: true,
  });
  const evaluatedTemplates = evaluateParsedTemplate(parsedTemplate);
  return convertParsedTemplatesToHTMLFragments(evaluatedTemplates);
};
