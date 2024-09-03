import type { Config } from "@markuplint/ml-config";
import { Context, Fragment } from "../types.js";
export declare function execAgainstEachFragment(fragment: Fragment, context: Context, config: Config): Promise<void>;
