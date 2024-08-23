import { TmplAstElement, TmplAstNode } from "@angular/compiler";
import { Finder } from "../finder/index.js";

export abstract class Modifier extends Finder {
  protected findFromChild<T extends TmplAstNode>(
    element: TmplAstElement,
  ):
    | {
        block: T;
        index: number;
      }
    | undefined {
    for (let index = 0; index < element.children.length; index++) {
      const child = element.children[index];
      if (this.isInstanceOfBlock(child)) {
        return { block: child as T, index };
      }
    }
    return;
  }

  protected abstract isInstanceOfBlock(node: TmplAstNode): boolean;
}
