import {
  ParsedTemplate,
  TmplAstElement,
  TmplAstIfBlock,
  TmplAstNode,
  tmplAstVisitAll,
} from "@angular/compiler";
import _, { sum } from "lodash";
import { BlockEvaluator, Evaluator } from "../shared/base-evaluator/index.js";
import { Counter } from "../shared/visitor/counter/index.js";
import { Modifier } from "../shared/visitor/modifier/index.js";

export class IfBlockEvaluator extends BlockEvaluator {
  constructor(evaluator: Evaluator) {
    super(evaluator);
  }

  evaluate(): ParsedTemplate[] {
    while (true) {
      const templateToEvaluate = this.templatesToEvaluate.pop();
      if (!templateToEvaluate) {
        return this.evaluatedTemplates;
      }

      const modifier = new IfBlockModifier();
      const topLevelIfPatterns = modifier.getModificationPatterns(
        templateToEvaluate.nodes,
      );
      if (topLevelIfPatterns) {
        topLevelIfPatterns.forEach((pattern) => {
          const workTemplate = _.cloneDeep(templateToEvaluate);
          workTemplate.nodes = pattern;
          this.templatesToEvaluate.push(workTemplate);
        });
      } else {
        const counter = new IfBlockBranchCounter();
        tmplAstVisitAll(counter, templateToEvaluate.nodes);

        const count = counter.count;
        if (count === 0) {
          this.evaluatedTemplates.push(templateToEvaluate);
        }

        for (let i = 0; i < count; i++) {
          const newModifier = new IfBlockModifier();
          const workTemplate = _.cloneDeep(templateToEvaluate);
          newModifier.evaluateAt = i;
          tmplAstVisitAll(newModifier, workTemplate.nodes);
          this.templatesToEvaluate.push(workTemplate);
        }
      }
    }
  }
}

class IfBlockBranchCounter extends Counter {
  visitIfBlock(block: TmplAstIfBlock) {
    if(this._hasFound){
      return;
    }
    this._hasFound = true;
    this._count = block.branches.length;
  }
}

class IfBlockModifier extends Modifier {
  override getModificationPatterns(
    nodes: TmplAstNode[],
  ): TmplAstNode[][] | undefined {
    const ifBlock = this.searchFromNodes<TmplAstIfBlock>(nodes);
    if (!ifBlock) {
      return undefined;
    }

    return ifBlock.block.branches.map((branch) => [
      ...nodes.slice(0, ifBlock.index),
      ...branch.children,
      ...nodes.slice(ifBlock.index + 1),
    ]);
  }
  override isInstanceOfBlock(element: TmplAstElement) {
    return element instanceof TmplAstIfBlock;
  }
}
