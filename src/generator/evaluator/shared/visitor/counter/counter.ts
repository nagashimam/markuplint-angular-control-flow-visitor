import { Finder } from "../finder/index.js";

export abstract class Counter extends Finder {
  protected _count = 0;
  get count() {
    return this._count;
  }
}
