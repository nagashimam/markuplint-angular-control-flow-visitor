import { TmplAstRecursiveVisitor, } from "@angular/compiler";
export class Finder extends TmplAstRecursiveVisitor {
    _hasFound = false;
    get hasFound() {
        return this._hasFound;
    }
}
