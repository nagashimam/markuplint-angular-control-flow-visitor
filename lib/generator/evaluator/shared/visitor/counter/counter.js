import { Finder } from "../finder/index.js";
export class Counter extends Finder {
    _count = 0;
    get count() {
        return this._count;
    }
}
