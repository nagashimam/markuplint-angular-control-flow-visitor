import { ParsedTemplate, ParseLocation, ParseSourceFile, TmplAstBoundAttribute, TmplAstElement, TmplAstTextAttribute } from "@angular/compiler";
import { Fragment } from "../../types.js";
export declare class OriginalLocations {
    private locations;
    private file;
    addToList(node: TmplAstElement | TmplAstBoundAttribute | TmplAstTextAttribute): void;
    getLocations(name: string): ParseLocation[] | undefined;
    getFile(): ParseSourceFile | undefined;
}
export declare const convertParsedTemplatesToHTMLFragments: (parsedTemplates: ParsedTemplate[]) => Fragment[];
