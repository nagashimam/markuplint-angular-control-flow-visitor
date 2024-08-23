import { Finder } from "../finder/index.js";
export declare abstract class Counter extends Finder {
    protected _count: number;
    get count(): number;
}
