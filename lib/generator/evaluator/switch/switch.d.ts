import { ParsedTemplate } from "@angular/compiler";
import { BlockEvaluator, Evaluator } from "../shared/base-evaluator/index.js";
export declare class SwitchBlockEvaluator extends BlockEvaluator {
    constructor(evaluator: Evaluator);
    evaluate(): ParsedTemplate[];
}
