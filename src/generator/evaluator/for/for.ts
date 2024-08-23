import {
  ParsedTemplate,
  TmplAstElement,
  TmplAstForLoopBlock,
  TmplAstForLoopBlockEmpty,
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

      const finder = new ForBlockFinder();
      tmplAstVisitAll(finder, templateToEvaluate.nodes);

      if (finder.hasFound) {
        this.evaluateLoop(0, templateToEvaluate);
        this.evaluateLoop(1, templateToEvaluate);
      } else {
        this.evaluatedTemplates.push(templateToEvaluate);
      }
    }
  }

  private evaluateLoop(
    loopCount: 0 | 1,
    templateToEvaluate: ParsedTemplate,
  ): void {
    const workTemplate = _.cloneDeep(templateToEvaluate);
    tmplAstVisitAll(new ForBlockModifier(loopCount), workTemplate.nodes);
    this.templatesToEvaluate.push(workTemplate);
  }
}

class ForBlockFinder extends Finder {
  override visitForLoopBlock(_block: TmplAstForLoopBlock): void {
    this._hasFound = true;
  }
}

class ForBlockModifier extends Modifier {
  constructor(private loopCount: 0 | 1) {
    super();
  }

  override visitElement(element: TmplAstElement): void {
    const res = this.findFromChild<TmplAstForLoopBlock>(element);
    if (res) {
      const { block, index } = res;
      this._hasFound = true;
      switch (this.loopCount) {
        case 0:
          this.noLoop(element, index);
        case 1:
          this.loopOnce(element, block, index);
      }
    } else {
      super.visitElement(element);
    }
  }

  private noLoop(element: TmplAstElement, index: number): void {
    const oldChildren = element.children;
    const emptyBlock = this.findFromChild<TmplAstForLoopBlockEmpty>(element);
    const block = emptyBlock?.block?.children ?? [];

    const newChildren = [
      ...oldChildren.splice(0, index),
      ...block,
      ...oldChildren.splice(index + 1),
    ];
    element.children = newChildren;
  }

  private loopOnce(
    element: TmplAstElement,
    forLoopBlock: TmplAstForLoopBlock,
    index: number,
  ): void {
    const oldChildren = element.children;
    const newChildren = [
      ...oldChildren.splice(0, index),
      ...forLoopBlock.children,
      ...oldChildren.splice(index + 1),
    ];
    element.children = newChildren;
  }

  protected isInstanceOfBlock(element: TmplAstElement): boolean {
    return element instanceof TmplAstForLoopBlock;
  }
}
