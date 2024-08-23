import { Finder } from "../finder/index.js";
export class Modifier extends Finder {
    findFromChild(element) {
        for (let index = 0; index < element.children.length; index++) {
            const child = element.children[index];
            if (this.isInstanceOfBlock(child)) {
                return { block: child, index };
            }
        }
        return;
    }
}
