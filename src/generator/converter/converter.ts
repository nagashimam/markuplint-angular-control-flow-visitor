import {
  ASTWithSource,
  Comment,
  ParsedTemplate,
  ParseLocation,
  ParseSourceFile,
  PropertyRead,
  TmplAstBoundAttribute,
  TmplAstBoundText,
  TmplAstElement,
  TmplAstNode,
  TmplAstText,
  TmplAstTextAttribute,
} from "@angular/compiler";
import jsdom from "jsdom";
import { Fragment } from "../../types.js";
import { existsSync, readFileSync } from "node:fs";
import {
  parse,
  AST_NODE_TYPES,
  TSESTree,
} from "@typescript-eslint/typescript-estree";

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
): Fragment[] => {
  return parsedTemplates.map(convertParsedTemplateToHTMLFragment);
};

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
    element.setAttribute(
      attribute.name.replaceAll(/[$@]/g, ""),
      attribute.value,
    );
    originalLocations.addToList(attribute);
  });
  astElement.inputs.forEach((input) => {
    const astValue = input.value as ASTWithSource;
    const boundVariableName = (astValue.ast as PropertyRead | undefined)?.name;
    const boundVariableSource = astValue.source;
    // check keySpan.details first to match [class.___] or [attr.____] input directive.
    const rawAttrName = input?.keySpan?.details || input?.value.toString();
    const attrName: string = rawAttrName
      .replaceAll(/[$@]/g, "") // Markuplint throws error for illegal characters in template
      .replaceAll(/(class)\..*/g, "$1") // evaluate `[class.XXX]="flag"` as `class="flag"`
      .replace("attr.", ""); // evaluate `[attr.XXX]="foo"` as `XXX="foo"`
    const attrValue =
      retrieveBoundValueFromComponentTS(input) ||
      boundVariableName ||
      boundVariableSource ||
      "some random text";

    element.setAttribute(attrName, attrValue);
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

const retrieveBoundValueFromComponentTS = (
  input: TmplAstBoundAttribute,
): string | undefined => {
  const componentFile = input.sourceSpan.start.file.url.replace(".html", ".ts");
  if (existsSync(componentFile)) {
    const code = readFileSync(componentFile, { encoding: "utf8" });
    const ast = parse(code, {
      loc: true,
      range: true,
    });

    const namedExport: TSESTree.ExportNamedDeclaration | undefined =
      ast.body.find(
        (body) =>
          body.type === AST_NODE_TYPES.ExportNamedDeclaration &&
          body.declaration?.type === AST_NODE_TYPES.ClassDeclaration &&
          body.declaration?.id?.name.includes("Component"),
      ) as TSESTree.ExportNamedDeclaration | undefined;
    const classDeclaration: TSESTree.ClassDeclaration | undefined =
      namedExport?.declaration as TSESTree.ClassDeclaration | undefined;
    const classBody = classDeclaration?.body;
    const propertyDefinition = classBody?.body?.find(
      (node) =>
        node.type === AST_NODE_TYPES.PropertyDefinition &&
        node.key.type === AST_NODE_TYPES.Identifier &&
        (node.key as TSESTree.Identifier).name ===
          (
            (input?.value as ASTWithSource | undefined)?.ast as
              | PropertyRead
              | undefined
          )?.name,
    ) as TSESTree.PropertyDefinition | undefined;

    if (propertyDefinition?.value?.type === AST_NODE_TYPES.Literal) {
      return (propertyDefinition.value as TSESTree.Literal | undefined)
        ?.value as string;
    }
  }
};
