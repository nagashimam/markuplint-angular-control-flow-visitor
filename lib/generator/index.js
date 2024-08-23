import { parseTemplate } from "@angular/compiler";
import fs from "fs";
import { convertParsedTemplatesToHTMLFragments } from "./converter/index.js";
import { evaluateParsedTemplate } from "./evaluator/index.js";
export const generateFragmentsFromTemplateFile = (filename) => {
    const sourceCode = fs.readFileSync(filename, "utf8");
    const parsedTemplate = parseTemplate(sourceCode, filename, {
        preserveWhitespaces: true,
        preserveLineEndings: true,
        collectCommentNodes: true,
    });
    const evaluatedTemplates = evaluateParsedTemplate(parsedTemplate);
    return convertParsedTemplatesToHTMLFragments(evaluatedTemplates);
};
