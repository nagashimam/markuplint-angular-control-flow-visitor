import type {
  TmplAstElement,
  TmplAstTemplate,
  TmplAstDeferredBlock,
  TmplAstDeferredBlockPlaceholder,
  TmplAstDeferredBlockError,
  TmplAstDeferredBlockLoading,
  TmplAstSwitchBlock,
  TmplAstSwitchBlockCase,
  TmplAstForLoopBlock,
  TmplAstForLoopBlockEmpty,
  TmplAstIfBlock,
  TmplAstIfBlockBranch,
  TmplAstContent,
  TmplAstVariable,
  TmplAstReference,
  TmplAstTextAttribute,
  TmplAstBoundAttribute,
  TmplAstBoundEvent,
  TmplAstText,
  TmplAstBoundText,
  TmplAstIcu,
  TmplAstDeferredTrigger,
  TmplAstUnknownBlock,
  TmplAstLetDeclaration,
} from "@angular/compiler";
import { TmplAstRecursiveVisitor } from "@angular/compiler";
export abstract class Finder extends TmplAstRecursiveVisitor {
  protected _hasFound = false;
  public get hasFound() {
    return this._hasFound;
  }
  visitElement(element: TmplAstElement): void {
    if (this._hasFound) {
      return;
    }
    super.visitElement(element);
  }
  visitTemplate(template: TmplAstTemplate): void {
    if (this._hasFound) {
      return;
    }
    super.visitTemplate(template);
  }
  visitDeferredBlock(deferred: TmplAstDeferredBlock): void {
    if (this._hasFound) {
      return;
    }
    super.visitDeferredBlock(deferred);
  }
  visitDeferredBlockPlaceholder(block: TmplAstDeferredBlockPlaceholder): void {
    if (this._hasFound) {
      return;
    }
    super.visitDeferredBlockPlaceholder(block);
  }
  visitDeferredBlockError(block: TmplAstDeferredBlockError): void {
    if (this._hasFound) {
      return;
    }
    super.visitDeferredBlockError(block);
  }
  visitDeferredBlockLoading(block: TmplAstDeferredBlockLoading): void {
    if (this._hasFound) {
      return;
    }
    super.visitDeferredBlockLoading(block);
  }
  visitSwitchBlock(block: TmplAstSwitchBlock): void {
    if (this._hasFound) {
      return;
    }
    super.visitSwitchBlock(block);
  }
  visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void {
    if (this._hasFound) {
      return;
    }
    super.visitSwitchBlockCase(block);
  }
  visitForLoopBlock(block: TmplAstForLoopBlock): void {
    if (this._hasFound) {
      return;
    }
    super.visitForLoopBlock(block);
  }
  visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void {
    if (this._hasFound) {
      return;
    }
    super.visitForLoopBlockEmpty(block);
  }
  visitIfBlock(block: TmplAstIfBlock): void {
    if (this._hasFound) {
      return;
    }
    super.visitIfBlock(block);
  }
  visitIfBlockBranch(block: TmplAstIfBlockBranch): void {
    if (this._hasFound) {
      return;
    }
    super.visitIfBlockBranch(block);
  }
  visitContent(content: TmplAstContent): void {
    if (this._hasFound) {
      return;
    }
    super.visitContent(content);
  }
  visitVariable(variable: TmplAstVariable): void {
    if (this._hasFound) {
      return;
    }
    super.visitVariable(variable);
  }
  visitReference(reference: TmplAstReference): void {
    if (this._hasFound) {
      return;
    }
    super.visitReference(reference);
  }
  visitTextAttribute(attribute: TmplAstTextAttribute): void {
    if (this._hasFound) {
      return;
    }
    super.visitTextAttribute(attribute);
  }
  visitBoundAttribute(attribute: TmplAstBoundAttribute): void {
    if (this._hasFound) {
      return;
    }
    super.visitBoundAttribute(attribute);
  }
  visitBoundEvent(attribute: TmplAstBoundEvent): void {
    if (this._hasFound) {
      return;
    }
    super.visitBoundEvent(attribute);
  }
  visitText(text: TmplAstText): void {
    if (this._hasFound) {
      return;
    }
    super.visitText(text);
  }
  visitBoundText(text: TmplAstBoundText): void {
    if (this._hasFound) {
      return;
    }
    super.visitBoundText(text);
  }
  visitIcu(icu: TmplAstIcu): void {
    if (this._hasFound) {
      return;
    }
    super.visitIcu(icu);
  }
  visitDeferredTrigger(trigger: TmplAstDeferredTrigger): void {
    if (this._hasFound) {
      return;
    }
    super.visitDeferredTrigger(trigger);
  }
  visitUnknownBlock(block: TmplAstUnknownBlock): void {
    if (this._hasFound) {
      return;
    }
    super.visitUnknownBlock(block);
  }
  visitLetDeclaration(decl: TmplAstLetDeclaration): void {
    if (this._hasFound) {
      return;
    }
    super.visitLetDeclaration(decl);
  }
}
