import {
  Comment,
  ParsedTemplate,
  ParseLocation,
  ParseSourceFile,
  TmplAstBoundAttribute,
  TmplAstBoundText,
  TmplAstElement,
  TmplAstNode,
  TmplAstText,
  TmplAstTextAttribute,
} from "@angular/compiler";
import jsdom from "jsdom";
import { Fragment } from "../../types.js";

export class OriginalLocations {
  private locations = new Map<string, ParseLocation[]>();
  private file: ParseSourceFile | undefined;

  public addToList(
    node: TmplAstElement | TmplAstBoundAttribute | TmplAstTextAttribute,
  ): void {
    this.file = node.sourceSpan.start.file;
    const locations = this.locations.get(node.name) || [];
    this.locations.set(node.name, [...locations, node.sourceSpan.start]);
  }

  public getLocations(name: string): ParseLocation[] | undefined {
    return this.locations.get(name);
  }

  public getFile(): ParseSourceFile | undefined {
    return this.file;
  }
}

export const convertParsedTemplatesToHTMLFragments = (
  parsedTemplates: ParsedTemplate[],
): Fragment[] => parsedTemplates.map(convertParsedTemplateToHTMLFragment);

const convertParsedTemplateToHTMLFragment = (
  parsedTemplate: ParsedTemplate,
): Fragment => {
  const originalLocations = new OriginalLocations();
  const domNodes = parsedTemplate.nodes.map((node) =>
    convertAstNodeToDomNode(node, originalLocations),
  );
  const domDocument = new jsdom.JSDOM().window.document;
  const div = domDocument.createElement("div");
  domNodes.forEach((domNode) => {
    if (domNode) {
      div.appendChild(domNode);
    }
  });
  return { htmlFragment: div.innerHTML, originalLocations };
};

const convertAstNodeToDomNode = (
  astNode: TmplAstNode,
  originalLocations: OriginalLocations,
): Node | undefined => {
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

const convertAstElementToDomNode = (
  astElement: TmplAstElement,
  document: Document,
  originalLocations: OriginalLocations,
): Node => {
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

  const domChildren = astElement.children.map((child) =>
    convertAstNodeToDomNode(child, originalLocations),
  );
  domChildren.forEach((child) => {
    if (child) {
      element.appendChild(child);
    }
  });
  return element;
};

const convertAstBoundTextToDomNode = (document: Document): Node => {
  return document.createTextNode("some random text");
};

const convertAstTextToDomNode = (
  astText: TmplAstText,
  document: Document,
): Node => {
  return document.createTextNode(astText.value);
};

const convertAstCommentToDomNode = (
  astComment: Comment,
  document: Document,
): Node | undefined => {
  if (astComment.value) {
    return document.createComment(astComment.value);
  }
};
