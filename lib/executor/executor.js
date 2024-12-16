import { MLEngine } from "markuplint";
export async function execAgainstEachFragment(fragment, context, config) {
    const { document, report } = context;
    const file = await MLEngine.toMLFile({ sourceCode: fragment.htmlFragment });
    if (!file) {
        report({
            scope: document,
            message: "failed to set up internal object. Please file an issue",
        });
        return;
    }
    const engine = new MLEngine(file, { config, ignoreExt: true });
    const result = await engine.exec();
    result?.violations?.forEach((violation) => {
        let raw = violation.raw;
        if (!violation.raw) {
            // raw値が空きの場合、raw値を手動設定（The "___" attribute must not be empty）
            const attribute = violation.message.match(/"([^"]+)"/i);
            raw = attribute ? attribute[1] : "";
        }
        const { line, col } = estimateOriginalLocation(raw, violation.line, fragment.originalLocations);
        report({
            line,
            col,
            raw,
            message: `${violation.message} (${violation.ruleId})`,
        });
    });
}
const estimateOriginalLocation = (raw, line, originalLocations) => {
    /* TODO: Exclude lines that are not included in evaluation of Angular syntax blocks(if,switch,for,and so on).
     * Current implemantation compares raw returned by MLEngine.exec to each line in source file.
     * Nodes that are excluded by evaluator are also compared, and those lines could accidentally match with raw.
     */
    const candidates = findOriginalLocationCandidates(raw, originalLocations);
    candidates.sort((candidate) => Math.abs(line - candidate.line));
    return candidates[0];
};
const findOriginalLocationCandidates = (raw, originalLocations) => {
    const file = originalLocations.getFile();
    const lines = file?.content?.split("\n");
    if (lines) {
        // raw includes "<" and ">" when it is of HTMLElement.
        // examples of raw例： <ul>, <form>, for, class.selected...
        const isHTMLElement = raw.includes("<");
        const regex = isHTMLElement ? raw : new RegExp(`\\[?${raw}\\]?\\s*=`, "i");
        const matchedLines = lines.filter((str) => str.match(regex));
        if (matchedLines?.length > 0) {
            return matchedLines.map((matchedLine) => {
                const line = lines.indexOf(matchedLine) + 1;
                const col = matchedLine.search(/\S/) + 1;
                return { line, col };
            });
        }
    }
    return [{ line: 1, col: 1 }];
};
