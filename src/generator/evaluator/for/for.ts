import {
  ParsedTemplate,
  TmplAstElement,
  TmplAstForLoopBlock,
  TmplAstNode,
  tmplAstVisitAll,
} from "@angular/compiler";
import _ from "lodash";
import { Modifier } from "../shared/visitor/modifier/index.js";
import { Finder } from "../shared/visitor/finder/index.js";
import { BlockEvaluator, Evaluator } from "../shared/base-evaluator/index.js";

export class ForBlockEvaluator extends BlockEvaluator {
  constructor(evaluator: Evaluator) {
    super(evaluator);
  }

  evaluate(): ParsedTemplate[] {
    while (true) {
      const templateToEvaluate = this.templatesToEvaluate.pop();
      if (!templateToEvaluate) {
        return this.evaluatedTemplates;
      }

      const modifier = new ForBlockModifier();
      const topLevelForPatterns = modifier.getModificationPatterns(
        templateToEvaluate.nodes,
      );
      if (topLevelForPatterns) {
        topLevelForPatterns.forEach((pattern) => {
          const workTemplate = _.cloneDeep(templateToEvaluate);
          workTemplate.nodes = pattern;
          this.templatesToEvaluate.push(workTemplate);
        });
      } else {
        const finder = new ForBlockFinder();
        tmplAstVisitAll(finder, templateToEvaluate.nodes);
        if (finder.hasFound) {
          modifier.evaluateAt = 0;
          this.evaluateLoop(modifier, templateToEvaluate);
          const newModifier = new ForBlockModifier();
          newModifier.evaluateAt = 1;
          this.evaluateLoop(newModifier, templateToEvaluate);
        } else {
          this.evaluatedTemplates.push(templateToEvaluate);
        }
      }
    }
  }

  private evaluateLoop(
    modifier: ForBlockModifier,
    templateToEvaluate: ParsedTemplate,
  ): void {
    const workTemplate = _.cloneDeep(templateToEvaluate);
    tmplAstVisitAll(modifier, workTemplate.nodes);
    this.templatesToEvaluate.push(workTemplate);
  }
}

class ForBlockFinder extends Finder {
  override visitForLoopBlock(): void {
    this._hasFound = true;
  }
}

class ForBlockModifier extends Modifier {
  override getModificationPatterns(
    nodes: TmplAstNode[],
  ): TmplAstNode[][] | undefined {
    const forLoopBlock = this.searchFromNodes<TmplAstForLoopBlock>(nodes);
    if (!forLoopBlock) {
      return undefined;
    }

    return [
      this.noLoop(nodes, forLoopBlock.block, forLoopBlock.index),
      this.loopOnce(nodes, forLoopBlock.block, forLoopBlock.index),
    ];
  }

  private noLoop(
    nodes: TmplAstNode[],
    forLoopBlock: TmplAstForLoopBlock,
    index: number,
  ): TmplAstNode[] {
    const block = forLoopBlock.empty?.children ?? [];
    return [...nodes.splice(0, index), ...block, ...nodes.splice(index + 1)];
  }

  private loopOnce(
    nodes: TmplAstNode[],
    forLoopBlock: TmplAstForLoopBlock,
    index: number,
  ): TmplAstNode[] {
    return [
      ...nodes.splice(0, index),
      ...forLoopBlock.children,
      ...nodes.splice(index + 1),
    ];
  }

  protected isInstanceOfBlock(node: TmplAstNode): boolean {
    return node instanceof TmplAstForLoopBlock;
  }
}
