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
            const counter = new IfBlockBranchCounter();
            tmplAstVisitAll(counter, templateToEvaluate.nodes);
            const count = counter.count;
            if (count === 0) {
                this.evaluatedTemplates.push(templateToEvaluate);
            }
            for (let i = 0; i < count; i++) {
                const workTemplate = _.cloneDeep(templateToEvaluate);
                tmplAstVisitAll(new IfBlockModifier(i), workTemplate.nodes);
                this.templatesToEvaluate.push(workTemplate);
            }
        }
    }
}
class IfBlockBranchCounter extends Counter {
    visitIfBlock(block) {
        this._hasFound = true;
        this._count = block.branches.length;
    }
}
class IfBlockModifier extends Modifier {
    evaluateAt;
    constructor(evaluateAt) {
        super();
        this.evaluateAt = evaluateAt;
    }
    visitElement(element) {
        const result = this.findFromChild(element);
        if (result) {
            const { block, index } = result;
            this._hasFound = true;
            const oldChildren = element.children;
            const newChildren = [
                ...oldChildren.splice(0, index),
                ...block.branches[this.evaluateAt].children,
                ...oldChildren.splice(index + 1),
            ];
            element.children = newChildren;
        }
        else {
            super.visitElement(element);
        }
    }
    isInstanceOfBlock(element) {
        return element instanceof TmplAstIfBlock;
    }
}
