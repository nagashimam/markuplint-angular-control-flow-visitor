import { TmplAstElement, TmplAstNode } from "@angular/compiler";
import { Finder } from "../finder/index.js";
export declare abstract class Modifier extends Finder {
    protected findFromChild<T extends TmplAstNode>(element: TmplAstElement): {
        block: T;
        index: number;
    } | undefined;
    protected abstract isInstanceOfBlock(node: TmplAstNode): boolean;
}
