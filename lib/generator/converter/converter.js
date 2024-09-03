import { Comment, TmplAstBoundText, TmplAstElement, TmplAstText, } from "@angular/compiler";
import jsdom from "jsdom";
export class OriginalLocations {
    locations = new Map();
    file;
    addToList(node) {
        this.file = node.sourceSpan.start.file;
        const locations = this.locations.get(node.name) || [];
        this.locations.set(node.name, [...locations, node.sourceSpan.start]);
    }
    getLocations(name) {
        return this.locations.get(name);
    }
    getFile() {
        return this.file;
    }
}
export const convertParsedTemplatesToHTMLFragments = (parsedTemplates) => parsedTemplates.map(convertParsedTemplateToHTMLFragment);
const convertParsedTemplateToHTMLFragment = (parsedTemplate) => {
    const originalLocations = new OriginalLocations();
    const domNodes = parsedTemplate.nodes.map((node) => convertAstNodeToDomNode(node, originalLocations));
    const domDocument = new jsdom.JSDOM().window.document;
    const div = domDocument.createElement("div");
    domNodes.forEach((domNode) => {
        if (domNode) {
            div.appendChild(domNode);
        }
    });
    return { htmlFragment: div.innerHTML, originalLocations };
};
const convertAstNodeToDomNode = (astNode, originalLocations) => {
    const { JSDOM } = jsdom;
    const { document } = new JSDOM().window;
    if (astNode instanceof TmplAstElement) {
        return convertAstElementToDomNode(astNode, document, originalLocations);
    }
    if (astNode instanceof TmplAstBoundText) {
        return convertAstBoundTextToDomNode(document);
    }
    if (astNode instanceof TmplAstText) {
        return convertAstTextToDomNode(astNode, document);
    }
    if (astNode instanceof Comment) {
        return convertAstCommentToDomNode(astNode, document);
    }
};
const convertAstElementToDomNode = (astElement, document, originalLocations) => {
    const element = document.createElement(astElement.name);
    originalLocations.addToList(astElement);
    astElement.attributes.forEach((attribute) => {
        // Markuplint throws error for illegal characters in template
        element.setAttribute(attribute.name.replaceAll("$", ""), attribute.value);
        originalLocations.addToList(attribute);
    });
    astElement.inputs.forEach((input) => {
        // Markuplint throws error for illegal characters in template
        element.setAttribute(input.name.replaceAll("$", ""), "some random text");
        originalLocations.addToList(input);
    });
    const domChildren = astElement.children.map((child) => convertAstNodeToDomNode(child, originalLocations));
    domChildren.forEach((child) => {
        if (child) {
            element.appendChild(child);
        }
    });
    return element;
};
const convertAstBoundTextToDomNode = (document) => {
    return document.createTextNode("some random text");
};
const convertAstTextToDomNode = (astText, document) => {
    return document.createTextNode(astText.value);
};
const convertAstCommentToDomNode = (astComment, document) => {
    if (astComment.value) {
        return document.createComment(astComment.value);
    }
};
