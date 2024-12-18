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
            const modifier = new ForBlockModifier();
            const topLevelForPatterns = modifier.getModificationPatterns(templateToEvaluate.nodes);
            if (topLevelForPatterns) {
                topLevelForPatterns.forEach((pattern) => {
                    const workTemplate = _.cloneDeep(templateToEvaluate);
                    workTemplate.nodes = pattern;
                    this.templatesToEvaluate.push(workTemplate);
                });
            }
            else {
                const finder = new ForBlockFinder();
                tmplAstVisitAll(finder, templateToEvaluate.nodes);
                if (finder.hasFound) {
                    modifier.evaluateAt = 0;
                    this.evaluateLoop(modifier, templateToEvaluate);
                    if (!modifier.hasCheckedEmpty) {
                        const newModifier = new ForBlockModifier();
                        newModifier.evaluateAt = 1;
                        this.evaluateLoop(newModifier, templateToEvaluate);
                    }
                }
                else {
                    this.evaluatedTemplates.push(templateToEvaluate);
                }
            }
        }
    }
    evaluateLoop(modifier, templateToEvaluate) {
        const workTemplate = _.cloneDeep(templateToEvaluate);
        tmplAstVisitAll(modifier, workTemplate.nodes);
        this.templatesToEvaluate.push(workTemplate);
    }
}
class ForBlockFinder extends Finder {
    visitForLoopBlock() {
        this._hasFound = true;
    }
}
class ForBlockModifier extends Modifier {
    _hasCheckedEmpty = false;
    get hasCheckedEmpty() {
        return this._hasCheckedEmpty;
    }
    getModificationPatterns(nodes) {
        const forLoopBlock = this.searchFromNodes(nodes);
        if (!forLoopBlock) {
            return undefined;
        }
        const hasCheckedEmpty = forLoopBlock.block.hasCheckedEmpty;
        this._hasCheckedEmpty = hasCheckedEmpty;
        return hasCheckedEmpty
            ? [this.loopOnce(nodes, forLoopBlock.block, forLoopBlock.index)]
            : [
                this.noLoop(nodes, forLoopBlock.block, forLoopBlock.index),
                this.loopOnce(nodes, forLoopBlock.block, forLoopBlock.index),
            ];
    }
    noLoop(nodes, forLoopBlock, index) {
        const block = forLoopBlock.empty?.children ?? [];
        return [...nodes.slice(0, index), ...block, ...nodes.slice(index + 1)];
    }
    loopOnce(nodes, forLoopBlock, index) {
        return [
            ...nodes.slice(0, index),
            ...forLoopBlock.children,
            ...nodes.slice(index + 1),
        ];
    }
    isInstanceOfBlock(node) {
        return node instanceof TmplAstForLoopBlock;
    }
}
