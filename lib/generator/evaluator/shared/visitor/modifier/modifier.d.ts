import { TmplAstElement, TmplAstForLoopBlock, TmplAstForLoopBlockEmpty, TmplAstIfBlockBranch, TmplAstNode, TmplAstSwitchBlockCase } from "@angular/compiler";
import { Finder } from "../finder/index.js";
export declare abstract class Modifier extends Finder {
    protected _evaluateAt: number;
    set evaluateAt(evaluateAt: number);
    visitElement(element: TmplAstElement): void;
    visitForLoopBlock(block: TmplAstForLoopBlock): void;
    visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void;
    visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void;
    visitIfBlockBranch(block: TmplAstIfBlockBranch): void;
    protected searchFromNodes<T extends TmplAstNode>(nodes: TmplAstNode[]): {
        block: T;
        index: number;
    } | undefined;
    protected abstract isInstanceOfBlock(node: TmplAstNode): boolean;
    protected abstract getModificationPatterns(nodes: TmplAstNode[]): TmplAstNode[][] | undefined;
}
