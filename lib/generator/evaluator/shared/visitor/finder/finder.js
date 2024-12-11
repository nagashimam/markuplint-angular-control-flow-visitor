import { TmplAstRecursiveVisitor } from "@angular/compiler";
export class Finder extends TmplAstRecursiveVisitor {
    _hasFound = false;
    get hasFound() {
        return this._hasFound;
    }
    visitElement(element) {
        if (this._hasFound) {
            return;
        }
        super.visitElement(element);
    }
    visitTemplate(template) {
        if (this._hasFound) {
            return;
        }
        super.visitTemplate(template);
    }
    visitDeferredBlock(deferred) {
        if (this._hasFound) {
            return;
        }
        super.visitDeferredBlock(deferred);
    }
    visitDeferredBlockPlaceholder(block) {
        if (this._hasFound) {
            return;
        }
        super.visitDeferredBlockPlaceholder(block);
    }
    visitDeferredBlockError(block) {
        if (this._hasFound) {
            return;
        }
        super.visitDeferredBlockError(block);
    }
    visitDeferredBlockLoading(block) {
        if (this._hasFound) {
            return;
        }
        super.visitDeferredBlockLoading(block);
    }
    visitSwitchBlock(block) {
        if (this._hasFound) {
            return;
        }
        super.visitSwitchBlock(block);
    }
    visitSwitchBlockCase(block) {
        if (this._hasFound) {
            return;
        }
        super.visitSwitchBlockCase(block);
    }
    visitForLoopBlock(block) {
        if (this._hasFound) {
            return;
        }
        super.visitForLoopBlock(block);
    }
    visitForLoopBlockEmpty(block) {
        if (this._hasFound) {
            return;
        }
        super.visitForLoopBlockEmpty(block);
    }
    visitIfBlock(block) {
        if (this._hasFound) {
            return;
        }
        super.visitIfBlock(block);
    }
    visitIfBlockBranch(block) {
        if (this._hasFound) {
            return;
        }
        super.visitIfBlockBranch(block);
    }
    visitContent(content) {
        if (this._hasFound) {
            return;
        }
        super.visitContent(content);
    }
    visitVariable(variable) {
        if (this._hasFound) {
            return;
        }
        super.visitVariable(variable);
    }
    visitReference(reference) {
        if (this._hasFound) {
            return;
        }
        super.visitReference(reference);
    }
    visitTextAttribute(attribute) {
        if (this._hasFound) {
            return;
        }
        super.visitTextAttribute(attribute);
    }
    visitBoundAttribute(attribute) {
        if (this._hasFound) {
            return;
        }
        super.visitBoundAttribute(attribute);
    }
    visitBoundEvent(attribute) {
        if (this._hasFound) {
            return;
        }
        super.visitBoundEvent(attribute);
    }
    visitText(text) {
        if (this._hasFound) {
            return;
        }
        super.visitText(text);
    }
    visitBoundText(text) {
        if (this._hasFound) {
            return;
        }
        super.visitBoundText(text);
    }
    visitIcu(icu) {
        if (this._hasFound) {
            return;
        }
        super.visitIcu(icu);
    }
    visitDeferredTrigger(trigger) {
        if (this._hasFound) {
            return;
        }
        super.visitDeferredTrigger(trigger);
    }
    visitUnknownBlock(block) {
        if (this._hasFound) {
            return;
        }
        super.visitUnknownBlock(block);
    }
    visitLetDeclaration(decl) {
        if (this._hasFound) {
            return;
        }
        super.visitLetDeclaration(decl);
    }
}
