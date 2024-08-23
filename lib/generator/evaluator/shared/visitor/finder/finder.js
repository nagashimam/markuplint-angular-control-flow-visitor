import { TmplAstRecursiveVisitor, } from "@angular/compiler";
export class Finder extends TmplAstRecursiveVisitor {
    _hasFound = false;
    get hasFound() {
        return this._hasFound;
    }
    visitElement(element) {
        if (this.hasFound)
            return;
        super.visitElement(element);
    }
    visitTemplate(template) {
        if (this.hasFound)
            return;
        super.visitTemplate(template);
    }
    visitDeferredBlock(deferred) {
        if (this.hasFound)
            return;
        super.visitDeferredBlock(deferred);
    }
    visitDeferredBlockPlaceholder(block) {
        if (this.hasFound)
            return;
        super.visitDeferredBlockPlaceholder(block);
    }
    visitDeferredBlockError(block) {
        if (this.hasFound)
            return;
        super.visitDeferredBlockError(block);
    }
    visitDeferredBlockLoading(block) {
        if (this.hasFound)
            return;
        super.visitDeferredBlockLoading(block);
    }
    visitSwitchBlock(block) {
        if (this.hasFound)
            return;
        super.visitSwitchBlock(block);
    }
    visitSwitchBlockCase(block) {
        if (this.hasFound)
            return;
        super.visitSwitchBlockCase(block);
    }
    visitForLoopBlock(block) {
        if (this.hasFound)
            return;
        super.visitForLoopBlock(block);
    }
    visitForLoopBlockEmpty(block) {
        if (this.hasFound)
            return;
        super.visitForLoopBlockEmpty(block);
    }
    visitIfBlock(block) {
        if (this.hasFound)
            return;
        super.visitIfBlock(block);
    }
    visitIfBlockBranch(block) {
        if (this.hasFound)
            return;
        super.visitIfBlockBranch(block);
    }
    visitContent(content) {
        if (this.hasFound)
            return;
        super.visitContent(content);
    }
}
