import { TmplAstForLoopBlock, tmplAstVisitAll, } from "@angular/compiler";
import _ from "lodash";
import { Modifier } from "../shared/visitor/modifier/index.js";
import { Finder } from "../shared/visitor/finder/index.js";
import { BlockEvaluator } from "../shared/base-evaluator/index.js";
export class ForBlockEvaluator extends BlockEvaluator {
    constructor(evaluator) {
        super(evaluator);
    }
    evaluate() {
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
            }
            else {
                this.evaluatedTemplates.push(templateToEvaluate);
            }
        }
    }
    evaluateLoop(loopCount, templateToEvaluate) {
        const workTemplate = _.cloneDeep(templateToEvaluate);
        tmplAstVisitAll(new ForBlockModifier(loopCount), workTemplate.nodes);
        this.templatesToEvaluate.push(workTemplate);
    }
}
class ForBlockFinder extends Finder {
    visitForLoopBlock(_block) {
        this._hasFound = true;
    }
}
class ForBlockModifier extends Modifier {
    loopCount;
    constructor(loopCount) {
        super();
        this.loopCount = loopCount;
    }
    visitElement(element) {
        const res = this.findFromChild(element);
        if (res) {
            const { block, index } = res;
            this._hasFound = true;
            switch (this.loopCount) {
                case 0:
                    this.noLoop(element, index);
                case 1:
                    this.loopOnce(element, block, index);
            }
        }
        else {
            super.visitElement(element);
        }
    }
    noLoop(element, index) {
        const oldChildren = element.children;
        const emptyBlock = this.findFromChild(element);
        const block = emptyBlock?.block?.children ?? [];
        const newChildren = [
            ...oldChildren.splice(0, index),
            ...block,
            ...oldChildren.splice(index + 1),
        ];
        element.children = newChildren;
    }
    loopOnce(element, forLoopBlock, index) {
        const oldChildren = element.children;
        const newChildren = [
            ...oldChildren.splice(0, index),
            ...forLoopBlock.children,
            ...oldChildren.splice(index + 1),
        ];
        element.children = newChildren;
    }
    isInstanceOfBlock(element) {
        return element instanceof TmplAstForLoopBlock;
    }
}
