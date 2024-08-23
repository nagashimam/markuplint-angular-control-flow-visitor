import { RuleSeed } from "@markuplint/ml-core";
import { OriginalLocations } from "./generator/converter/converter.js";
export type MainValue = string;
export type Options = {};
export type Verify = RuleSeed<MainValue, Options>["verify"];
export type Context = Parameters<Verify>[0];
export type Fragment = {
    htmlFragment: string;
    originalLocations: OriginalLocations;
};
