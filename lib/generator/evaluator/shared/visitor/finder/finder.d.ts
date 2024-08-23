import { TmplAstElement, TmplAstIfBlock, TmplAstRecursiveVisitor, TmplAstTemplate, TmplAstDeferredBlock, TmplAstDeferredBlockPlaceholder, TmplAstDeferredBlockError, TmplAstDeferredBlockLoading, TmplAstSwitchBlock, TmplAstSwitchBlockCase, TmplAstForLoopBlock, TmplAstForLoopBlockEmpty, TmplAstIfBlockBranch, TmplAstContent } from "@angular/compiler";
export declare abstract class Finder extends TmplAstRecursiveVisitor {
    protected _hasFound: boolean;
    get hasFound(): boolean;
    visitElement(element: TmplAstElement): void;
    visitTemplate(template: TmplAstTemplate): void;
    visitDeferredBlock(deferred: TmplAstDeferredBlock): void;
    visitDeferredBlockPlaceholder(block: TmplAstDeferredBlockPlaceholder): void;
    visitDeferredBlockError(block: TmplAstDeferredBlockError): void;
    visitDeferredBlockLoading(block: TmplAstDeferredBlockLoading): void;
    visitSwitchBlock(block: TmplAstSwitchBlock): void;
    visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void;
    visitForLoopBlock(block: TmplAstForLoopBlock): void;
    visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void;
    visitIfBlock(block: TmplAstIfBlock): void;
    visitIfBlockBranch(block: TmplAstIfBlockBranch): void;
    visitContent(content: TmplAstContent): void;
}
