export class Evaluator {
}
export class BlockEvaluator extends Evaluator {
    evaluator;
    templatesToEvaluate = [];
    evaluatedTemplates = [];
    constructor(evaluator) {
        super();
        this.evaluator = evaluator;
        this.templatesToEvaluate = this.evaluator.evaluate();
    }
}
export class BaseEvaluator extends Evaluator {
    template;
    constructor(template) {
        super();
        this.template = template;
    }
    evaluate() {
        return [this.template];
    }
}
