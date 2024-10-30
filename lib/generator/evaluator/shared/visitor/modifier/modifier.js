import { Finder } from "../finder/index.js";
export class Modifier extends Finder {
    _evaluateAt = 0;
    set evaluateAt(evaluateAt) {
        this._evaluateAt = evaluateAt;
    }
    visitElement(element) {
        // The number of times getModificationPatterns will be called is equal to element.children.length. If it takes too much time, we have to consider caching the return value of getModificationPatterns
        const patterns = this.getModificationPatterns(element.children);
        if (patterns) {
            this._hasFound = true;
            element.children = patterns[this._evaluateAt];
        }
        else {
            super.visitElement(element);
        }
    }
    visitForLoopBlock(block) {
        const patterns = this.getModificationPatterns(block.children);
        if (patterns) {
            this._hasFound = true;
            block.children = patterns[this._evaluateAt];
        }
        else {
            super.visitForLoopBlock(block);
        }
    }
    visitForLoopBlockEmpty(block) {
        const patterns = this.getModificationPatterns(block.children);
        if (patterns) {
            this._hasFound = true;
            block.children = patterns[this._evaluateAt];
        }
        else {
            super.visitForLoopBlockEmpty(block);
        }
    }
    visitSwitchBlockCase(block) {
        const patterns = this.getModificationPatterns(block.children);
        if (patterns) {
            this._hasFound = true;
            block.children = patterns[this._evaluateAt];
        }
        else {
            super.visitSwitchBlockCase(block);
        }
    }
    visitIfBlockBranch(block) {
        const patterns = this.getModificationPatterns(block.children);
        if (patterns) {
            this._hasFound = true;
            block.children = patterns[this._evaluateAt];
        }
        else {
            super.visitIfBlockBranch(block);
        }
    }
    searchFromNodes(nodes) {
        for (let index = 0; index < nodes.length; index++) {
            const child = nodes[index];
            if (this.isInstanceOfBlock(child)) {
                return { block: child, index };
            }
        }
        return;
    }
}
