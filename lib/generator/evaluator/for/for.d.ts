import { ParsedTemplate } from "@angular/compiler";
import { BlockEvaluator, Evaluator } from "../shared/base-evaluator/index.js";
export declare class ForBlockEvaluator extends BlockEvaluator {
    constructor(evaluator: Evaluator);
    evaluate(): ParsedTemplate[];
    private evaluateLoop;
}
