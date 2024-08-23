import {
  ParsedTemplate,
  TmplAstElement,
  TmplAstSwitchBlock,
  tmplAstVisitAll,
} from "@angular/compiler";
import _ from "lodash";
import { BlockEvaluator, Evaluator } from "../shared/base-evaluator/index.js";
import { Counter } from "../shared/visitor/counter/index.js";
import { Modifier } from "../shared/visitor/modifier/index.js";

export class SwitchBlockEvaluator extends BlockEvaluator {
  constructor(evaluator: Evaluator) {
    super(evaluator);
  }

  evaluate(): ParsedTemplate[] {
    while (true) {
      const templateToEvaluate = this.templatesToEvaluate.pop();
      if (!templateToEvaluate) {
        return this.evaluatedTemplates;
      }

      const counter = new SwitchBlockBranchCounter();
      tmplAstVisitAll(counter, templateToEvaluate.nodes);

      const count = counter.count;
      if (count === 0) {
        this.evaluatedTemplates.push(templateToEvaluate);
      }

      for (let i = 0; i < count; i++) {
        const workTemplate = _.cloneDeep(templateToEvaluate);
        tmplAstVisitAll(new SwitchBlockModifier(i), workTemplate.nodes);
        this.templatesToEvaluate.push(workTemplate);
      }
    }
  }
}

class SwitchBlockBranchCounter extends Counter {
  visitSwitchBlock(block: TmplAstSwitchBlock) {
    this._hasFound = true;
    this._count = block.cases.length;
  }
}

class SwitchBlockModifier extends Modifier {
  private evaluateAt: number;
  constructor(evaluateAt: number) {
    super();
    this.evaluateAt = evaluateAt;
  }
  override visitElement(element: TmplAstElement) {
    const result = this.findFromChild<TmplAstSwitchBlock>(element);
    if (result) {
      const { block, index } = result;
      this._hasFound = true;
      const oldChildren = element.children;
      const newChildren = [
        ...oldChildren.splice(0, index),
        ...block.cases[this.evaluateAt].children,
        ...oldChildren.splice(index + 1),
      ];
      element.children = newChildren;
    } else {
      super.visitElement(element);
    }
  }
  override isInstanceOfBlock(element: TmplAstElement) {
    return element instanceof TmplAstSwitchBlock;
  }
}
