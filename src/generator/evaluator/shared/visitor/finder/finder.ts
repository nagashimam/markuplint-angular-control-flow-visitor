import { TmplAstRecursiveVisitor } from "@angular/compiler";

export abstract class Finder extends TmplAstRecursiveVisitor {
  protected _hasFound = false;
  public get hasFound() {
    return this._hasFound;
  }
}
