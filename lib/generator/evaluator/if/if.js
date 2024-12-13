import { TmplAstIfBlock, tmplAstVisitAll, } from "@angular/compiler";
import _ from "lodash";
import { BlockEvaluator } from "../shared/base-evaluator/index.js";
import { Counter } from "../shared/visitor/counter/index.js";
import { Modifier } from "../shared/visitor/modifier/index.js";
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
class IfBlockBranchCounter extends Counter {
    visitIfBlock(block) {
        if (this._hasFound) {
            return;
        }
        this._hasFound = true;
        this._count = block.branches.length;
    }
}
class IfBlockModifier extends Modifier {
    getModificationPatterns(nodes) {
        const ifBlock = this.searchFromNodes(nodes);
        if (!ifBlock) {
            return undefined;
        }
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
