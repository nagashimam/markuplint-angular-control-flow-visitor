import { TmplAstElement, TmplAstNode } from "@angular/compiler";
import { Finder } from "../finder/index.js";

export abstract class Modifier extends Finder {
  protected _evaluateAt: number = 0;
  set evaluateAt(evaluateAt: number) {
    this._evaluateAt = evaluateAt;
  }

  override visitElement(element: TmplAstElement): void {
    // The number of times getModificationPatterns will be called is equal to element.children.length. If it takes too much time, we have to consider caching the return value of getModificationPatterns
    const patterns = this.getModificationPatterns(element.children);
    if (patterns) {
      this._hasFound = true;
      element.children = patterns[this._evaluateAt];
    } else {
      super.visitElement(element);
    }
  }

  protected searchFromNodes<T extends TmplAstNode>(
    nodes: TmplAstNode[],
  ):
    | {
        block: T;
        index: number;
      }
    | undefined {
    for (let index = 0; index < nodes.length; index++) {
      const child = nodes[index];
      if (this.isInstanceOfBlock(child)) {
        return { block: child as T, index };
      }
    }
    return;
  }

  protected abstract isInstanceOfBlock(node: TmplAstNode): boolean;
  protected abstract getModificationPatterns(
    nodes: TmplAstNode[],
  ): TmplAstNode[][] | undefined;
}
