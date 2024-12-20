import { TmplAstIfBlock, tmplAstVisitAll, } from "@angular/compiler";
import _ from "lodash";
import { BlockEvaluator } from "../shared/base-evaluator/index.js";
import { Counter } from "../shared/visitor/counter/index.js";
import { Modifier } from "../shared/visitor/modifier/index.js";
import { Finder } from "../shared/visitor/finder/finder.js";
export class IfBlockEvaluator extends BlockEvaluator {
    constructor(evaluator) {
        super(evaluator);
    }
    evaluate() {
        while (true) {
            const templateToEvaluate = this.templatesToEvaluate.pop();
            if (!templateToEvaluate) {
                return this.evaluatedTemplates;
            }
            const modifier = new IfBlockModifier();
            const topLevelIfPatterns = modifier.getModificationPatterns(templateToEvaluate.nodes);
            if (topLevelIfPatterns) {
                topLevelIfPatterns.forEach((pattern) => {
                    const workTemplate = _.cloneDeep(templateToEvaluate);
                    workTemplate.nodes = pattern;
                    this.templatesToEvaluate.push(workTemplate);
                });
            }
            else {
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
const markEmptyCheck = (block) => {
    const firstLine = block.sourceSpan.toString().split("\n")[0];
    const emptyCheckTarget = firstLine
        .replaceAll(" ", "")
        .replaceAll(/@if\((.*)\.length(>[^-]?\d+)?\).*/g, "$1");
    console.log(emptyCheckTarget);
    block.branches.forEach((branch) => {
        tmplAstVisitAll(new ForBlockEmptyCheckFinder(emptyCheckTarget), branch.children);
    });
};
class IfBlockBranchCounter extends Counter {
    visitIfBlock(block) {
        if (this._hasFound) {
            return;
        }
        this._hasFound = true;
        this._count = block.branches.length;
    }
}
class ForBlockEmptyCheckFinder extends Finder {
    emptyCheckTarget;
    constructor(emptyCheckTarget) {
        super();
        this.emptyCheckTarget = emptyCheckTarget;
    }
    visitForLoopBlock(block) {
        if (block.expression.source === this.emptyCheckTarget) {
            block.hasCheckedEmpty = true;
        }
        if (this._hasFound) {
            return;
        }
        super.visitForLoopBlock(block);
    }
}
class IfBlockModifier extends Modifier {
    getModificationPatterns(nodes) {
        const ifBlock = this.searchFromNodes(nodes);
        if (!ifBlock) {
            return undefined;
        }
        markEmptyCheck(ifBlock.block);
        return ifBlock.block.branches.map((branch) => [
            ...nodes.slice(0, ifBlock.index),
            ...branch.children,
            ...nodes.slice(ifBlock.index + 1),
        ]);
    }
    isInstanceOfBlock(element) {
        return element instanceof TmplAstIfBlock;
    }
}
