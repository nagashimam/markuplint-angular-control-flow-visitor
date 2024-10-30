import { TmplAstElement, TmplAstForLoopBlock, TmplAstForLoopBlockEmpty, TmplAstIfBlock, TmplAstIfBlockBranch, TmplAstNode, TmplAstSwitchBlock, TmplAstSwitchBlockCase } from "@angular/compiler";
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

  override visitForLoopBlock(block: TmplAstForLoopBlock): void {
    const patterns = this.getModificationPatterns(block.children);
    if (patterns) {
      this._hasFound = true;
      block.children = patterns[this._evaluateAt];
    } else {
      super.visitForLoopBlock(block);
    }
  }
  
  override visitForLoopBlockEmpty(block: TmplAstForLoopBlockEmpty): void {
    const patterns = this.getModificationPatterns(block.children);
    if (patterns) {
      this._hasFound = true;
      block.children = patterns[this._evaluateAt];
    } else {
      super.visitForLoopBlockEmpty(block);
    }
  }

  override  visitSwitchBlockCase(block: TmplAstSwitchBlockCase): void {
    const patterns = this.getModificationPatterns(block.children);
    if (patterns) {
      this._hasFound = true;
      block.children = patterns[this._evaluateAt];
    } else {
      super.visitSwitchBlockCase(block);
    }
  }

  override visitIfBlockBranch(block: TmplAstIfBlockBranch): void {
    const patterns = this.getModificationPatterns(block.children);
    if (patterns) {
      this._hasFound = true;
      block.children = patterns[this._evaluateAt];
    } else {
      super.visitIfBlockBranch(block);
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
