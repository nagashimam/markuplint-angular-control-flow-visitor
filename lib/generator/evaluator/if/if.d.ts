import { ParsedTemplate } from "@angular/compiler";
import { BlockEvaluator, Evaluator } from "../shared/base-evaluator/index.js";
export declare class IfBlockEvaluator extends BlockEvaluator {
    constructor(evaluator: Evaluator);
    evaluate(): ParsedTemplate[];
}
