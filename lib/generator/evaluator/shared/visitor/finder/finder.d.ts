import { TmplAstRecursiveVisitor } from "@angular/compiler";
export declare abstract class Finder extends TmplAstRecursiveVisitor {
    protected _hasFound: boolean;
    get hasFound(): boolean;
}
