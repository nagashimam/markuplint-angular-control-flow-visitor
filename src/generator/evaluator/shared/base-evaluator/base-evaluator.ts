import { ParsedTemplate } from "@angular/compiler";

export abstract class Evaluator {
  public abstract evaluate(): ParsedTemplate[];
}

export abstract class BlockEvaluator extends Evaluator {
  protected templatesToEvaluate: ParsedTemplate[] = [];
  protected evaluatedTemplates: ParsedTemplate[] = [];
  constructor(private evaluator: Evaluator) {
    super();
    this.templatesToEvaluate = this.evaluator.evaluate();
  }
}

export class BaseEvaluator extends Evaluator {
  constructor(private template: ParsedTemplate) {
    super();
  }
  evaluate(): ParsedTemplate[] {
    return [this.template];
  }
}
