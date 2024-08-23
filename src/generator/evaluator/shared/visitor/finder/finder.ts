import {
  TmplAstElement,
  TmplAstIfBlock,
  TmplAstRecursiveVisitor,
  TmplAstTemplate,
  TmplAstDeferredBlock,
  TmplAstDeferredBlockPlaceholder,
  TmplAstDeferredBlockError,
  TmplAstDeferredBlockLoading,
  TmplAstSwitchBlock,
  TmplAstSwitchBlockCase,
  TmplAstForLoopBlock,
  TmplAstForLoopBlockEmpty,
  TmplAstIfBlockBranch,
  TmplAstContent,
} from "@angular/compiler";

export abstract class Finder extends TmplAstRecursiveVisitor {
  protected _hasFound = false;
  public get hasFound() {
    return this._hasFound;
  }
  override visitElement(element: TmplAstElement): void {
    if (this.hasFound) return;
    super.visitElement(element);
  }
  override visitTemplate(template: TmplAstTemplate): void {
    if (this.hasFound) return;
    super.visitTemplate(template);
  }
  override visitDeferredBlock(deferred: TmplAstDeferredBlock): void {
    if (this.hasFound) return;
    super.visitDeferredBlock(deferred);
  }
  override visitDeferredBlockPlaceholder(
    block: TmplAstDeferredBlockPlaceholder,
  ): void {
    if (this.hasFound) return;
    super.visitDeferredBlockPlaceholder(block);
  }
  override visitDeferredBlockError(block: TmplAstDeferredBlockError): void {
    if (this.hasFound) return;
    super.visitDeferredBlockError(block);
  }
  override visitDeferredBlockLoading(block: TmplAstDeferredBlockLoading): void {
    if (this.hasFound) return;
    super.visitDeferredBlockLoading(block);
  }
  override visitSwitchBlock(block: TmplAstSwitchBlock): void {
    if (this.hasFound) return;
    super.visitSwitchBlock(block);
  }
  override visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void {
    if (this.hasFound) return;
    super.visitSwitchBlockCase(block);
  }
  override visitForLoopBlock(block: TmplAstForLoopBlock): void {
    if (this.hasFound) return;
    super.visitForLoopBlock(block);
  }
  override visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void {
    if (this.hasFound) return;
    super.visitForLoopBlockEmpty(block);
  }
  override visitIfBlock(block: TmplAstIfBlock): void {
    if (this.hasFound) return;
    super.visitIfBlock(block);
  }
  override visitIfBlockBranch(block: TmplAstIfBlockBranch): void {
    if (this.hasFound) return;
    super.visitIfBlockBranch(block);
  }
  override visitContent(content: TmplAstContent): void {
    if (this.hasFound) return;
    super.visitContent(content);
  }
}
