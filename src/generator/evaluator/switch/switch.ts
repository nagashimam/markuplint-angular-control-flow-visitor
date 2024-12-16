import {
  ParsedTemplate,
  TmplAstNode,
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

      const modifier = new SwitchBlockModifier();
      const topLevelSwitchPatterns = modifier.getModificationPatterns(
        templateToEvaluate.nodes,
      );
      if (topLevelSwitchPatterns) {
        topLevelSwitchPatterns.forEach((pattern) => {
          const workTemplate = _.cloneDeep(templateToEvaluate);
          workTemplate.nodes = pattern;
          this.templatesToEvaluate.push(workTemplate);
        });
      } else {
        const counter = new SwitchBlockBranchCounter();
        tmplAstVisitAll(counter, templateToEvaluate.nodes);

        const count = counter.count;
        if (count === 0) {
          this.evaluatedTemplates.push(templateToEvaluate);
        }

        for (let i = 0; i < count; i++) {
          const newModifier = new SwitchBlockModifier();
          newModifier.evaluateAt = i;
          const workTemplate = _.cloneDeep(templateToEvaluate);
          tmplAstVisitAll(newModifier, workTemplate.nodes);
          this.templatesToEvaluate.push(workTemplate);
        }
      }
    }
  }
}

class SwitchBlockBranchCounter extends Counter {
  visitSwitchBlock(block: TmplAstSwitchBlock) {
    if (this._hasFound) {
      return;
    }
    this._hasFound = true;
    this._count = block.cases.length;
  }
}

class SwitchBlockModifier extends Modifier {
  override getModificationPatterns(
    nodes: TmplAstNode[],
  ): TmplAstNode[][] | undefined {
    const switchBlock = this.searchFromNodes<TmplAstSwitchBlock>(nodes);
    if (!switchBlock) {
      return;
    }

    return switchBlock.block.cases.map((eachCase) => [
      ...nodes.slice(0, switchBlock.index),
      ...eachCase.children,
      ...nodes.slice(switchBlock.index + 1),
    ]);
  }

  override isInstanceOfBlock(node: TmplAstNode) {
    return node instanceof TmplAstSwitchBlock;
  }
}
