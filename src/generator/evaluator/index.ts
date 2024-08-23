import { ParsedTemplate } from "@angular/compiler";
import { IfBlockEvaluator } from "./if/index.js";
import { BaseEvaluator } from "./shared/base-evaluator/index.js";
import { ForBlockEvaluator } from "./for/index.js";
import { SwitchBlockEvaluator } from "./switch/index.js";

export const evaluateParsedTemplate = (
  parsedTemplate: ParsedTemplate,
): ParsedTemplate[] => {
  const base = new BaseEvaluator(parsedTemplate);
  const ifBlock = new IfBlockEvaluator(base);
  const forBlock = new ForBlockEvaluator(ifBlock);
  const switchBlock = new SwitchBlockEvaluator(forBlock);
  return switchBlock.evaluate();
};
