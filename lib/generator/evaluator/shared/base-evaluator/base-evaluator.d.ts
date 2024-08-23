import { ParsedTemplate } from "@angular/compiler";
export declare abstract class Evaluator {
    abstract evaluate(): ParsedTemplate[];
}
export declare abstract class BlockEvaluator extends Evaluator {
    private evaluator;
    protected templatesToEvaluate: ParsedTemplate[];
    protected evaluatedTemplates: ParsedTemplate[];
    constructor(evaluator: Evaluator);
}
export declare class BaseEvaluator extends Evaluator {
    private template;
    constructor(template: ParsedTemplate);
    evaluate(): ParsedTemplate[];
}
