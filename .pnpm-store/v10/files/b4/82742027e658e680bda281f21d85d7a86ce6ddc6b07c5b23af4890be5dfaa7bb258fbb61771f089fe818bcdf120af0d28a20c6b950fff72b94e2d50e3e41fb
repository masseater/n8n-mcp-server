import { IProject, Project, Selector, Symbol, SymbolIn, SymbolMeta } from "@hey-api/codegen-core";
import fs from "node:fs";
import ts from "typescript";
import { RangeOptions, SemVer } from "semver";

//#region rolldown:runtime

//#endregion
//#region src/plugins/shared/types/refs.d.ts
/**
 * Ref wrapper which ensures a stable reference for a value.
 *
 * @example
 * ```ts
 * type NumRef = Ref<number>; // { value: number }
 * const num: NumRef = { value: 42 };
 * console.log(num.value); // 42
 * ```
 */
type Ref<T$1> = {
  value: T$1;
};

/**
 * Utility type: wraps a value in a Ref.
 *
 * @example
 * ```ts
 * type R = ToRef<number>; // { value: number }
 * ```
 */

/**
 * Maps every property of `T` to a `Ref` of that property.
 *
 * @example
 * ```ts
 * type Foo = { a: number; b: string };
 * type Refs = ToRefs<Foo>; // { a: Ref<number>; b: Ref<string> }
 * const refs: Refs = { a: { value: 1 }, b: { value: 'x' } };
 * console.log(refs.a.value, refs.b.value); // 1 'x'
 * ```
 */
type ToRefs<T$1> = { [K in keyof T$1]: Ref<T$1[K]> };
//#endregion
//#region src/openApi/shared/types/openapi-spec-extensions.d.ts
interface EnumExtensions {
  /**
   * `x-enum-descriptions` are {@link https://stackoverflow.com/a/66471626 supported} by OpenAPI Generator.
   */
  'x-enum-descriptions'?: ReadonlyArray<string>;
  /**
   * `x-enum-varnames` are {@link https://stackoverflow.com/a/66471626 supported} by OpenAPI Generator.
   */
  'x-enum-varnames'?: ReadonlyArray<string>;
  /**
   * {@link https://github.com/RicoSuter/NSwag NSwag} generates `x-enumNames` field containing custom enum names.
   */
  'x-enumNames'?: ReadonlyArray<string>;
}
declare namespace types_d_exports {
  export { AccessLevel, FunctionParameter, FunctionTypeParameter, ObjectValue, SyntaxKindKeyword, createAnonymousFunction, createArrayLiteralExpression, createArrowFunction, createAsExpression, createAssignment, createAwaitExpression, createBlock, createConditionalExpression, createEnumDeclaration, createForOfStatement, createFunctionTypeNode, createGetAccessorDeclaration, createIndexedAccessTypeNode, createKeywordTypeNode, createLiteralTypeNode, createMappedTypeNode, createNamespaceDeclaration, createNewExpression, createNull, createObjectType, createParameterDeclaration, createPropertyAccessChain, createPropertyAccessExpression, createPropertyAssignment, createRegularExpressionLiteral, createStringLiteral, createTemplateLiteralType, createTypeAliasDeclaration, createTypeNode, createTypeOfExpression, createTypeOperatorNode, createTypeParameterDeclaration, createTypeParenthesizedNode, createTypeReferenceNode, syntaxKindKeyword, toExpression, toParameterDeclarations, toTypeParameters };
}
type AccessLevel = 'private' | 'protected' | 'public';
type FunctionParameter = {
  accessLevel?: AccessLevel;
  default?: any;
  isReadOnly?: boolean;
  isRequired?: boolean;
  name: string;
  type?: any | ts.TypeNode;
} | {
  destructure: ReadonlyArray<FunctionParameter>;
  type?: any | ts.TypeNode;
};
interface FunctionTypeParameter {
  default?: any;
  extends?: string | ts.TypeNode;
  name: string | ts.Identifier;
}
declare const createTypeNode: (base: any | ts.TypeNode, args?: (any | ts.TypeNode)[]) => ts.TypeNode;
declare const createPropertyAccessChain: ({
  expression,
  name
}: {
  expression: ts.Expression;
  name: string | ts.MemberName;
}) => ts.PropertyAccessChain;
declare const createPropertyAccessExpression: ({
  expression,
  isOptional,
  name
}: {
  expression: string | ts.Expression;
  isOptional?: boolean;
  name: string | number | ts.MemberName;
}) => ts.PropertyAccessChain | ts.PropertyAccessExpression | ts.ElementAccessExpression;
declare const createNull: () => ts.NullLiteral;
/**
 * Convert an unknown value to an expression.
 * @param identifiers - list of keys that are treated as identifiers.
 * @param shorthand - if shorthand syntax is allowed.
 * @param unescape - if string should be unescaped.
 * @param value - the unknown value.
 * @returns ts.Expression
 */
declare const toExpression: <T = unknown>({
  identifiers,
  isValueAccess,
  shorthand,
  unescape,
  value
}: {
  identifiers?: string[];
  isValueAccess?: boolean;
  shorthand?: boolean;
  unescape?: boolean;
  value: T;
}) => ts.Expression | undefined;
/**
 * Convert parameters to the declaration array expected by TypeScript
 * Compiler API.
 * @param parameters - the parameters to convert to declarations
 * @returns ts.ParameterDeclaration[]
 */
declare const toParameterDeclarations: (parameters: ReadonlyArray<FunctionParameter>) => ts.ParameterDeclaration[];
type SyntaxKindKeyword = 'any' | 'async' | 'boolean' | 'export' | 'never' | 'number' | 'private' | 'protected' | 'public' | 'readonly' | 'static' | 'string' | 'undefined' | 'unknown' | 'void';
declare const syntaxKindKeyword: <T extends SyntaxKindKeyword>({
  keyword
}: {
  keyword: T;
}) => T extends "protected" ? ts.SyntaxKind.ProtectedKeyword : T extends "public" ? ts.SyntaxKind.PublicKeyword : T extends "private" ? ts.SyntaxKind.PrivateKeyword : T extends "export" ? ts.SyntaxKind.ExportKeyword : T extends "async" ? ts.SyntaxKind.ExportKeyword : T extends "readonly" ? ts.SyntaxKind.ExportKeyword : T extends "static" ? ts.SyntaxKind.ExportKeyword : ts.SyntaxKind.AnyKeyword | ts.SyntaxKind.BooleanKeyword | ts.SyntaxKind.NeverKeyword | ts.SyntaxKind.NumberKeyword | ts.SyntaxKind.StringKeyword | ts.SyntaxKind.UndefinedKeyword | ts.SyntaxKind.UnknownKeyword | ts.SyntaxKind.VoidKeyword;
declare const createKeywordTypeNode: ({
  keyword
}: {
  keyword: Extract<SyntaxKindKeyword, "any" | "boolean" | "never" | "number" | "string" | "undefined" | "unknown" | "void">;
}) => ts.KeywordTypeNode<ts.SyntaxKind.VoidKeyword | ts.SyntaxKind.AnyKeyword | ts.SyntaxKind.BooleanKeyword | ts.SyntaxKind.NeverKeyword | ts.SyntaxKind.NumberKeyword | ts.SyntaxKind.StringKeyword | ts.SyntaxKind.UndefinedKeyword | ts.SyntaxKind.UnknownKeyword>;
declare const toTypeParameters: (types: (FunctionTypeParameter | ts.TypeParameterDeclaration)[]) => ts.TypeParameterDeclaration[];
declare const createTypeOperatorNode: ({
  operator,
  type
}: {
  operator: "keyof" | "readonly" | "unique";
  type: ts.TypeNode;
}) => ts.TypeOperatorNode;
declare const createTypeParameterDeclaration: ({
  constraint,
  defaultType,
  modifiers,
  name
}: {
  constraint?: ts.TypeNode;
  defaultType?: ts.TypeNode;
  modifiers?: Array<ts.Modifier>;
  name: string | ts.Identifier;
}) => ts.TypeParameterDeclaration;
declare const createMappedTypeNode: ({
  members,
  nameType,
  questionToken,
  readonlyToken,
  type,
  typeParameter
}: {
  members?: ts.NodeArray<ts.TypeElement>;
  nameType?: ts.TypeNode;
  questionToken?: ts.QuestionToken | ts.PlusToken | ts.MinusToken;
  readonlyToken?: ts.ReadonlyKeyword | ts.PlusToken | ts.MinusToken;
  type?: ts.TypeNode;
  typeParameter: ts.TypeParameterDeclaration;
}) => ts.MappedTypeNode;
declare const createLiteralTypeNode: ({
  literal
}: {
  literal: ts.LiteralTypeNode["literal"];
}) => ts.LiteralTypeNode;
/**
 * Create arrow function type expression.
 */
declare const createArrowFunction: ({
  async,
  comment,
  multiLine,
  parameters,
  returnType,
  statements,
  types
}: {
  async?: boolean;
  comment?: Comments;
  multiLine?: boolean;
  parameters?: ReadonlyArray<FunctionParameter>;
  returnType?: string | ts.TypeNode;
  statements?: ts.Statement[] | ts.Expression;
  types?: FunctionTypeParameter[];
}) => ts.ArrowFunction;
/**
 * Create anonymous function type expression.
 */
declare const createAnonymousFunction: ({
  async,
  comment,
  multiLine,
  parameters,
  returnType,
  statements,
  types
}: {
  async?: boolean;
  comment?: Comments;
  multiLine?: boolean;
  parameters?: FunctionParameter[];
  returnType?: string | ts.TypeNode;
  statements?: ReadonlyArray<ts.Statement>;
  types?: FunctionTypeParameter[];
}) => ts.FunctionExpression;
/**
 * Create Array type expression.
 */
declare const createArrayLiteralExpression: <T>({
  elements,
  multiLine
}: {
  /**
   * The array to create.
   */
  elements: T[];
  /**
   * Should the array be multi line?
   *
   * @default false
   */
  multiLine?: boolean;
}) => ts.ArrayLiteralExpression;
declare const createAwaitExpression: ({
  expression
}: {
  expression: ts.Expression;
}) => ts.AwaitExpression;
declare const createFunctionTypeNode: ({
  parameters,
  returnType,
  typeParameters
}: {
  parameters?: ts.ParameterDeclaration[];
  returnType: ts.TypeNode;
  typeParameters?: ts.TypeParameterDeclaration[];
}) => ts.FunctionTypeNode;
type ObjectValue = {
  assertion?: 'any' | ts.TypeNode;
  comments?: Comments;
  spread: string;
} | {
  comments?: Comments;
  isValueAccess?: boolean;
  key: string;
  shorthand?: boolean;
  value: any;
};
/**
 * Create Object type expression.
 * @param comments - comments to add to each property.
 * @param identifier - keys that should be treated as identifiers.
 * @param multiLine - if the object should be multiline.
 * @param obj - the object to create expression with.
 * @param shorthand - if shorthand syntax should be used.
 * @param unescape - if properties strings should be unescaped.
 * @returns ts.ObjectLiteralExpression
 */
declare const createObjectType: <T extends Record<string, any> | Array<ObjectValue>>({
  comments,
  identifiers,
  multiLine,
  obj,
  shorthand,
  unescape
}: {
  comments?: Comments;
  identifiers?: string[];
  multiLine?: boolean;
  obj: T;
  shorthand?: boolean;
  unescape?: boolean;
}) => ts.ObjectLiteralExpression;
/**
 * Create enum declaration. Example `export enum T = { X, Y };`
 * @param asConst - whether to use const enums.
 * @param comments - comments to add to each property.
 * @param leadingComment - leading comment to add to enum.
 * @param name - the name of the enum.
 * @param obj - the object representing the enum.
 * @returns ts.EnumDeclaration
 */
declare const createEnumDeclaration: <T extends Record<string, any> | Array<ObjectValue>>({
  asConst,
  comments: enumMemberComments,
  leadingComment: comments,
  name,
  obj
}: {
  asConst: boolean;
  comments?: Record<string | number, Comments>;
  leadingComment?: Comments;
  name: string | ts.TypeReferenceNode;
  obj: T;
}) => ts.EnumDeclaration;
/**
 * Create namespace declaration. Example `export namespace MyNamespace { ... }`
 * @param name - the name of the namespace.
 * @param nodes - the nodes in the namespace.
 * @returns
 */
declare const createNamespaceDeclaration: ({
  name,
  statements
}: {
  name: string;
  statements: Array<ts.Statement>;
}) => ts.ModuleDeclaration;
declare const createIndexedAccessTypeNode: ({
  indexType,
  objectType
}: {
  indexType: ts.TypeNode;
  objectType: ts.TypeNode;
}) => ts.IndexedAccessTypeNode;
declare const createGetAccessorDeclaration: ({
  name,
  returnType,
  statements
}: {
  name: string | ts.PropertyName;
  returnType?: string | ts.Identifier;
  statements: ReadonlyArray<ts.Statement>;
}) => ts.GetAccessorDeclaration;
declare const createStringLiteral: ({
  isSingleQuote,
  text
}: {
  isSingleQuote?: boolean;
  text: string;
}) => ts.StringLiteral;
declare const createConditionalExpression: ({
  condition,
  whenFalse,
  whenTrue
}: {
  condition: ts.Expression;
  whenFalse: ts.Expression;
  whenTrue: ts.Expression;
}) => ts.ConditionalExpression;
declare const createTypeOfExpression: ({
  text
}: {
  text: string | ts.Identifier;
}) => ts.TypeOfExpression;
/**
 * Create a type alias declaration. Example `export type X = Y;`.
 * @param comment (optional) comments to add
 * @param name the name of the type
 * @param type the type
 * @returns ts.TypeAliasDeclaration
 */
declare const createTypeAliasDeclaration: ({
  comment,
  exportType,
  name,
  type,
  typeParameters
}: {
  comment?: Comments;
  exportType?: boolean;
  name: string | ts.TypeReferenceNode;
  type: string | ts.TypeNode | ts.Identifier;
  typeParameters?: FunctionTypeParameter[];
}) => ts.TypeAliasDeclaration;
declare const createTypeReferenceNode: ({
  typeArguments,
  typeName
}: {
  typeArguments?: ts.TypeNode[];
  typeName: string | ts.EntityName;
}) => ts.TypeReferenceNode;
declare const createTypeParenthesizedNode: ({
  type
}: {
  type: ts.TypeNode;
}) => ts.ParenthesizedTypeNode;
declare const createParameterDeclaration: ({
  initializer,
  modifiers,
  name,
  required,
  type
}: {
  initializer?: ts.Expression;
  modifiers?: ReadonlyArray<ts.ModifierLike>;
  name: string | ts.BindingName;
  required?: boolean;
  type?: ts.TypeNode;
}) => ts.ParameterDeclaration;
declare const createNewExpression: ({
  argumentsArray,
  expression,
  typeArguments
}: {
  argumentsArray?: Array<ts.Expression>;
  expression: ts.Expression;
  typeArguments?: Array<ts.TypeNode>;
}) => ts.NewExpression;
declare const createForOfStatement: ({
  awaitModifier,
  expression,
  initializer,
  statement
}: {
  awaitModifier?: ts.AwaitKeyword;
  expression: ts.Expression;
  initializer: ts.ForInitializer;
  statement: ts.Statement;
}) => ts.ForOfStatement;
declare const createAssignment: ({
  left,
  right
}: {
  left: ts.Expression;
  right: ts.Expression;
}) => ts.AssignmentExpression<ts.EqualsToken>;
declare const createBlock: ({
  multiLine,
  statements
}: {
  multiLine?: boolean;
  statements: ReadonlyArray<ts.Statement>;
}) => ts.Block;
declare const createPropertyAssignment: ({
  initializer,
  name
}: {
  initializer: ts.Expression;
  name: string | ts.PropertyName;
}) => ts.PropertyAssignment;
declare const createRegularExpressionLiteral: ({
  flags,
  text
}: {
  flags?: ReadonlyArray<"g" | "i" | "m" | "s" | "u" | "y">;
  text: string;
}) => ts.RegularExpressionLiteral;
declare const createAsExpression: ({
  expression,
  type
}: {
  expression: ts.Expression;
  type: ts.TypeNode;
}) => ts.AsExpression;
declare const createTemplateLiteralType: ({
  value
}: {
  value: ReadonlyArray<string | ts.TypeNode>;
}) => ts.TemplateLiteralTypeNode;
//#endregion
//#region src/tsc/utils.d.ts
interface ImportExportItemObject<Name$1 extends string | undefined = string | undefined, Alias$1 extends string | undefined = undefined> {
  alias?: Alias$1;
  asType?: boolean;
  name: Name$1;
}
/**
 * Print a TypeScript node to a string.
 * @param node the node to print
 * @returns string
 */
declare function tsNodeToString({
  node,
  unescape
}: {
  node: ts.Node;
  unescape?: boolean;
}): string;
type CommentLines = Array<string | null | false | undefined>;
type CommentObject = {
  jsdoc?: boolean;
  lines: CommentLines;
};
type Comments = CommentLines | Array<CommentObject>;
//#endregion
//#region src/generate/file.d.ts
type FileImportResult<Name$1 extends string | undefined = string | undefined, Alias$1 extends string | undefined = undefined> = {
  asType?: boolean;
  name: Alias$1 extends string ? Alias$1 : Name$1;
};
/**
 * TODO: remove, it's used by legacy plugins
 *
 * @deprecated
 */
declare class GeneratedFile {
  /**
   * Should the exports from this file be re-exported in the index barrel file?
   */
  private _exportFromIndex;
  private _headers;
  private _id;
  private _imports;
  private _items;
  private _name;
  private _path;
  constructor({
    dir,
    exportFromIndex,
    header,
    id,
    name
  }: {
    dir: string;
    /**
     * Should the exports from this file be re-exported in the index barrel file?
     */
    exportFromIndex?: boolean;
    header?: boolean;
    /**
     * Unique file ID. Used to generate correct relative paths to the file.
     * This should be refactored later as it's basically the file name unless
     * nested inside another folder.
     */
    id: string;
    name: string;
  });
  add(...nodes: Array<ts.Node | string>): void;
  get exportFromIndex(): boolean;
  get id(): string;
  /**
   * Adds an import to the provided module. Handles duplication, returns added
   * import. Returns the imported name. If we import an aliased export, `name`
   * will be equal to the specified `alias`.
   */
  import<Name extends string | undefined = string | undefined, Alias extends string | undefined = undefined>({
    module,
    ...importedItem
  }: ImportExportItemObject<Name, Alias> & {
    module: string;
  }): FileImportResult<Name, Alias>;
  isEmpty(): boolean;
  nameWithoutExtension(): string;
  remove(options?: Parameters<typeof fs.rmSync>[1]): void;
  /**
   * Removes last node form the stack. Works as undo.
   *
   * @deprecated
   */
  removeNode_LEGACY(): void;
  private _setName;
  private _toString;
  write(separator?: string, tsConfig?: ts.ParsedCommandLine | null): void;
}
//#endregion
//#region src/types/utils.d.ts
/** @deprecated */
type Files = Record<string, GeneratedFile>;
/**
 * Accepts a value, a function returning a value, or a function returning a promise of a value.
 */
type LazyOrAsync<T$1> = T$1 | (() => T$1) | (() => Promise<T$1>);
/**
 * Accepts a value or a readonly array of values of type T.
 */
type MaybeArray<T$1> = T$1 | ReadonlyArray<T$1>;
//#endregion
//#region src/openApi/3.1.x/types/spec.d.ts
/**
 * This is the root object of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-document OpenAPI document}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 */
interface OpenApiV3_1_X {
  /**
   * An element to hold various schemas for the document.
   */
  components?: ComponentsObject$1;
  /**
   * Additional external documentation.
   */
  externalDocs?: ExternalDocumentationObject$2;
  /**
   * **REQUIRED**. Provides metadata about the API. The metadata MAY be used by tooling as required.
   */
  info: InfoObject;
  /**
   * The default value for the `$schema` keyword within {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Objects} contained within this OAS document. This MUST be in the form of a URI.
   */
  jsonSchemaDialect?: string;
  /**
   * **REQUIRED**. This string MUST be the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#versions version number} of the OpenAPI Specification that the OpenAPI document uses. The `openapi` field SHOULD be used by tooling to interpret the OpenAPI document. This is _not_ related to the API {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#infoVersion `info.version`} string.
   */
  openapi: '3.1.0' | '3.1.1' | '3.1.2';
  /**
   * The available paths and operations for the API.
   */
  paths?: PathsObject$2;
  /**
   * A declaration of which security mechanisms can be used across the API. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. Individual operations can override this definition. To make security optional, an empty security requirement (`{}`) can be included in the array.
   */
  security?: ReadonlyArray<SecurityRequirementObject$2>;
  /**
   * An array of Server Objects, which provide connectivity information to a target server. If the `servers` property is not provided, or is an empty array, the default value would be a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-object Server Object} with a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#serverUrl url} value of `/`.
   */
  servers?: ReadonlyArray<ServerObject>;
  /**
   * A list of tags used by the document with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object} must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: ReadonlyArray<TagObject$2>;
  /**
   * The incoming webhooks that MAY be received as part of this API and that the API consumer MAY choose to implement. Closely related to the `callbacks` feature, this section describes requests initiated other than by an API call, for example by an out of band registration. The key name is a unique string to refer to each webhook, while the (optionally referenced) Path Item Object describes a request that may be initiated by the API provider and the expected responses. An {@link https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/webhook-example.yaml example} is available.
   */
  webhooks?: Record<string, PathItemObject$2 | ReferenceObject$1>;
}
/**
 * A map of possible out-of band callbacks related to the parent operation. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object} that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the path item object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
 *
 * To describe incoming requests from the API provider independent from another API call, use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oasWebhooks `webhooks`} field.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Key Expression**
 *
 * The key that identifies the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object} is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions runtime expression} that can be evaluated in the context of a runtime HTTP request/response to identify the URL to be used for the callback request. A simple example might be $request.body#/url. However, using a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions runtime expression} the complete HTTP message can be accessed. This includes accessing any part of a body that a JSON Pointer {@link https://tools.ietf.org/html/rfc6901 RFC6901} can reference.
 *
 * For example, given the following HTTP request:
 *
 * ```http
 * POST /subscribe/myevent?queryUrl=https://clientdomain.com/stillrunning HTTP/1.1
 * Host: example.org
 * Content-Type: application/json
 * Content-Length: 187
 *
 * {
 *   "failedUrl" : "https://clientdomain.com/failed",
 *   "successUrls" : [
 *     "https://clientdomain.com/fast",
 *     "https://clientdomain.com/medium",
 *     "https://clientdomain.com/slow"
 *   ]
 * }
 *
 * 201 Created
 * Location: https://example.org/subscription/1
 * ```
 *
 * The following examples show how the various expressions evaluate, assuming the callback operation has a path parameter named `eventType` and a query parameter named `queryUrl`.
 *
 * | Expression | Value |
 * | -------- | ------- |
 * | $url | https://example.org/subscribe/myevent?queryUrl=https://clientdomain.com/stillrunning |
 * | $method | POST |
 * | $request.path.eventType | myevent |
 * | $request.query.queryUrl | https://clientdomain.com/stillrunning |
 * | $request.header.content-Type | application/json |
 * | $request.body#/failedUrl | https://clientdomain.com/failed |
 * | $request.body#/successUrls/2 | https://clientdomain.com/medium |
 * | $response.header.Location | https://example.org/subscription/1 |
 *
 * **Callback Object Examples**
 *
 * The following example uses the user provided `queryUrl` query string parameter to define the callback URL. This is an example of how to use a callback object to describe a WebHook callback that goes with the subscription operation to enable registering for the WebHook.
 *
 * ```yaml
 * myCallback:
 *   '{$request.query.queryUrl}':
 *     post:
 *       requestBody:
 *         description: Callback payload
 *         content:
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/SomePayload'
 *       responses:
 *         '200':
 *           description: callback successfully processed
 * ```
 *
 * The following example shows a callback where the server is hard-coded, but the query string parameters are populated from the `id` and `email` property in the request body.
 *
 * ```yaml
 * transactionCallback:
 *   'http://notificationServer.com?transactionId={$request.body#/id}&email={$request.body#/email}':
 *     post:
 *       requestBody:
 *         description: Callback payload
 *         content:
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/SomePayload'
 *       responses:
 *         '200':
 *           description: callback successfully processed
 * ```
 */
interface CallbackObject$1 {
  /**
   * A Path Item Object, or a reference to one, used to define a callback request and expected responses. A {@link https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/callback-example.yaml complete example} is available.
   */
  [expression: string]: PathItemObject$2 | ReferenceObject$1;
}
/**
 * Holds a set of reusable objects for different aspects of the OAS. All objects defined within the components object will have no effect on the API unless they are explicitly referenced from properties outside the components object.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * All the fixed fields declared above are objects that MUST use keys that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.
 *
 * Field Name Examples:
 *
 * ```
 * User
 * User_1
 * User_Name
 * user-name
 * my.org.User
 * ```
 *
 * **Components Object Example**
 *
 * ```yaml
 * components:
 *   schemas:
 *     GeneralError:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           format: int32
 *         message:
 *           type: string
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         name:
 *           type: string
 *     Tag:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         name:
 *           type: string
 *   parameters:
 *     skipParam:
 *       name: skip
 *       in: query
 *       description: number of items to skip
 *       required: true
 *       schema:
 *         type: integer
 *         format: int32
 *     limitParam:
 *       name: limit
 *       in: query
 *       description: max records to return
 *       required: true
 *       schema:
 *         type: integer
 *         format: int32
 *   responses:
 *     NotFound:
 *       description: Entity not found.
 *     IllegalInput:
 *       description: Illegal input for operation.
 *     GeneralError:
 *       description: General Error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeneralError'
 *   securitySchemes:
 *     api_key:
 *       type: apiKey
 *       name: api_key
 *       in: header
 *     petstore_auth:
 *       type: oauth2
 *       flows:
 *         implicit:
 *           authorizationUrl: https://example.org/api/oauth/dialog
 *           scopes:
 *             write:pets: modify pets in your account
 *             read:pets: read your pets
 * ```
 */
interface ComponentsObject$1 {
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#callback-object Callback Objects}.
   */
  callbacks?: Record<string, CallbackObject$1 | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#example-object Example Objects}.
   */
  examples?: Record<string, ExampleObject$2 | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#header-object Header Objects}.
   */
  headers?: Record<string, HeaderObject$2 | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#link-object Link Objects}.
   */
  links?: Record<string, LinkObject$1 | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object Parameter Objects}.
   */
  parameters?: Record<string, ParameterObject | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object}.
   */
  pathItems?: Record<string, PathItemObject$2 | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-object Request Body Objects}.
   */
  requestBodies?: Record<string, RequestBodyObject | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#response-object Response Objects}.
   */
  responses?: Record<string, ResponseObject | ReferenceObject$1>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Objects}.
   */
  schemas?: Record<string, SchemaObject>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-scheme-object Security Scheme Objects}.
   */
  securitySchemes?: Record<string, SecuritySchemeObject | ReferenceObject$1>;
}
/**
 * Contact information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * name: API Support
 * url: https://www.example.com/support
 * email: support@example.com
 * ```
 */
interface ContactObject$2 {
  /**
   * The email address of the contact person/organization. This MUST be in the form of an email address.
   */
  email?: string;
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The URL pointing to the contact information. This MUST be in the form of a URL.
   */
  url?: string;
}
/**
 * When request bodies or response payloads may be one of a number of different schemas, a `discriminator` object can be used to aid in serialization, deserialization, and validation. The discriminator is a specific object in a schema which is used to inform the consumer of the document of an alternative schema based on the value associated with it.
 *
 * When using the discriminator, _inline_ schemas will not be considered.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * The discriminator object is legal only when using one of the composite keywords `oneOf`, `anyOf`, `allOf`.
 *
 * In OAS 3.0, a response payload MAY be described to be exactly one of any number of types:
 *
 * ```yaml
 * MyResponseType:
 *   oneOf:
 *   - $ref: '#/components/schemas/Cat'
 *   - $ref: '#/components/schemas/Dog'
 *   - $ref: '#/components/schemas/Lizard'
 * ```
 *
 * which means the payload _MUST_, by validation, match exactly one of the schemas described by `Cat`, `Dog`, or `Lizard`. In this case, a discriminator MAY act as a "hint" to shortcut validation and selection of the matching schema which may be a costly operation, depending on the complexity of the schema. We can then describe exactly which field tells us which schema to use:
 *
 * ```yaml
 * MyResponseType:
 *   oneOf:
 *   - $ref: '#/components/schemas/Cat'
 *   - $ref: '#/components/schemas/Dog'
 *   - $ref: '#/components/schemas/Lizard'
 *   discriminator:
 *     propertyName: petType
 * ```
 *
 * The expectation now is that a property with name `petType` _MUST_ be present in the response payload, and the value will correspond to the name of a schema defined in the OAS document. Thus the response payload:
 *
 * ```json
 * {
 *   "id": 12345,
 *   "petType": "Cat"
 * }
 * ```
 *
 * Will indicate that the `Cat` schema be used in conjunction with this payload.
 *
 * In scenarios where the value of the discriminator field does not match the schema name or implicit mapping is not possible, an optional `mapping` definition MAY be used:
 *
 * ```yaml
 * MyResponseType:
 *   oneOf:
 *   - $ref: '#/components/schemas/Cat'
 *   - $ref: '#/components/schemas/Dog'
 *   - $ref: '#/components/schemas/Lizard'
 *   - $ref: 'https://gigantic-server.com/schemas/Monster/schema.json'
 *   discriminator:
 *     propertyName: petType
 *     mapping:
 *       dog: '#/components/schemas/Dog'
 *       monster: 'https://gigantic-server.com/schemas/Monster/schema.json'
 * ```
 *
 * Here the discriminator _value_ of `dog` will map to the schema `#/components/schemas/Dog`, rather than the default (implicit) value of `Dog`. If the discriminator _value_ does not match an implicit or explicit mapping, no schema can be determined and validation SHOULD fail. Mapping keys MUST be string values, but tooling MAY convert response values to strings for comparison.
 *
 * When used in conjunction with the `anyOf` construct, the use of the discriminator can avoid ambiguity where multiple schemas may satisfy a single payload.
 *
 * In both the `oneOf` and `anyOf` use cases, all possible schemas MUST be listed explicitly. To avoid redundancy, the discriminator MAY be added to a parent schema definition, and all schemas comprising the parent schema in an `allOf` construct may be used as an alternate schema.
 *
 * For example:
 *
 * ```yaml
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *       - petType
 *       properties:
 *         petType:
 *           type: string
 *       discriminator:
 *         propertyName: petType
 *         mapping:
 *           dog: Dog
 *     Cat:
 *       allOf:
 *       - $ref: '#/components/schemas/Pet'
 *       - type: object
 *         # all other properties specific to a `Cat`
 *         properties:
 *           name:
 *             type: string
 *     Dog:
 *       allOf:
 *       - $ref: '#/components/schemas/Pet'
 *       - type: object
 *         # all other properties specific to a `Dog`
 *         properties:
 *           bark:
 *             type: string
 *     Lizard:
 *       allOf:
 *       - $ref: '#/components/schemas/Pet'
 *       - type: object
 *         # all other properties specific to a `Lizard`
 *         properties:
 *           lovesRocks:
 *             type: boolean
 * ```
 *
 * a payload like this:
 *
 * ```json
 * {
 *   "petType": "Cat",
 *   "name": "misty"
 * }
 * ```
 *
 * will indicate that the `Cat` schema be used. Likewise this schema:
 *
 * ```json
 * {
 *   "petType": "dog",
 *   "bark": "soft"
 * }
 * ```
 *
 * will map to `Dog` because of the definition in the `mapping` element.
 */
interface DiscriminatorObject$1 {
  /**
   * An object to hold mappings between payload values and schema names or references.
   */
  mapping?: Record<string, string>;
  /**
   * **REQUIRED**. The name of the property in the payload that will hold the discriminator value.
   */
  propertyName: string;
}
/**
 * A single encoding definition applied to a single schema property.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * requestBody:
 *   content:
 *     multipart/form-data:
 *       schema:
 *         type: object
 *         properties:
 *           id:
 *             # default is text/plain
 *             type: string
 *             format: uuid
 *           address:
 *             # default is application/json
 *             type: object
 *             properties: {}
 *           historyMetadata:
 *             # need to declare XML format!
 *             description: metadata in XML format
 *             type: object
 *             properties: {}
 *           profileImage: {}
 *       encoding:
 *         historyMetadata:
 *           # require XML Content-Type in utf-8 encoding
 *           contentType: application/xml; charset=utf-8
 *         profileImage:
 *           # only accept png/jpeg
 *           contentType: image/png, image/jpeg
 *           headers:
 *             X-Rate-Limit-Limit:
 *               description: The number of allowed requests in the current period
 *               schema:
 *                 type: integer
 * ```
 */
interface EncodingObject$1 {
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by {@link https://tools.ietf.org/html/rfc3986#section-2.2 RFC3986} `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. The default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingContentType `contentType`} (implicit or explicit) SHALL be ignored.
   */
  allowReserved?: boolean;
  /**
   * The Content-Type for encoding a specific property. Default value depends on the property type: for `object` - `application/json`; for `array` – the default is defined based on the inner type; for all other cases the default is `application/octet-stream`. The value can be a specific media type (e.g. `application/json`), a wildcard media type (e.g. `image/*`), or a comma-separated list of the two types.
   */
  contentType?: string;
  /**
   * When this is true, property values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingStyle `style`} is `form`, the default value is `true`. For all other styles, the default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingContentType `contentType`} (implicit or explicit) SHALL be ignored.
   */
  explode?: boolean;
  /**
   * A map allowing additional information to be provided as headers, for example `Content-Disposition`. `Content-Type` is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a `multipart`.
   */
  headers?: Record<string, HeaderObject$2 | ReferenceObject$1>;
  /**
   * Describes how a specific property value will be serialized depending on its type. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object Parameter Object} for details on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} property. The behavior follows the same values as `query` parameters, including default values. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encodingContentType `contentType`} (implicit or explicit) SHALL be ignored.
   */
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited';
}
/**
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * In all cases, the example value is expected to be compatible with the type schema of its associated value. Tooling implementations MAY choose to validate compatibility automatically, and reject the example value(s) if incompatible.
 *
 * Example Object Examples
 *
 * In a request body:
 *
 * @example
 * ```yaml
 * requestBody:
 *   content:
 *     'application/json':
 *       schema:
 *         $ref: '#/components/schemas/Address'
 *       examples:
 *         foo:
 *           summary: A foo example
 *           value: {"foo": "bar"}
 *         bar:
 *           summary: A bar example
 *           value: {"bar": "baz"}
 *     'application/xml':
 *       examples:
 *         xmlExample:
 *           summary: This is an example in XML
 *           externalValue: 'https://example.org/examples/address-example.xml'
 *     'text/plain':
 *       examples:
 *         textExample:
 *           summary: This is a text example
 *           externalValue: 'https://foo.bar/examples/address-example.txt'
 * ```
 *
 * In a parameter:
 *
 * @example
 * ```yaml
 * parameters:
 *   - name: 'zipCode'
 *     in: 'query'
 *     schema:
 *       type: 'string'
 *       format: 'zip-code'
 *     examples:
 *       zip-example:
 *         $ref: '#/components/examples/zip-example'
 * ```
 *
 * In a response:
 *
 * @example
 * ```yaml
 * responses:
 *   '200':
 *     description: your car appointment has been booked
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/SuccessResponse'
 *         examples:
 *           confirmation-success:
 *             $ref: '#/components/examples/confirmation-success'
 * ```
 */
interface ExampleObject$2 {
  /**
   * Long description for the example. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A URI that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The `value` field and `externalValue` field are mutually exclusive. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
   */
  externalValue?: string;
  /**
   * Short description for the example.
   */
  summary?: string;
  /**
   * Embedded literal example. The `value` field and `externalValue` field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.
   */
  value?: unknown;
}
/**
 * Allows referencing an external resource for extended documentation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * description: Find more info here
 * url: https://example.com
 * ```
 */
interface ExternalDocumentationObject$2 {
  /**
   * A description of the target documentation. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * **REQUIRED**. The URL for the target documentation. This MUST be in the form of a URL.
   */
  url: string;
}
/**
 * The Header Object follows the structure of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object Parameter Object} with the following changes:
 *
 * 1. `name` MUST NOT be specified, it is given in the corresponding `headers` map.
 * 1. `in` MUST NOT be specified, it is implicitly in `header`.
 * 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`}).
 *
 * @example
 * ```yaml
 * description: The number of allowed requests in the current period
 * schema:
 *   type: integer
 * ```
 */
type HeaderObject$2 = Omit<ParameterObject, 'in' | 'name'>;
/**
 * The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * title: Sample Pet Store App
 * summary: A pet store manager.
 * description: This is a sample server for a pet store.
 * termsOfService: https://example.com/terms/
 * contact:
 *   name: API Support
 *   url: https://www.example.com/support
 *   email: support@example.com
 * license:
 *   name: Apache 2.0
 *   url: https://www.apache.org/licenses/LICENSE-2.0.html
 * version: 1.0.1
 * ```
 */
interface InfoObject {
  /**
   * The contact information for the exposed API.
   */
  contact?: ContactObject$2;
  /**
   * A description of the API. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * The license information for the exposed API.
   */
  license?: LicenseObject$2;
  /**
   * A short summary of the API.
   */
  summary?: string;
  /**
   * A URL to the Terms of Service for the API. This MUST be in the form of a URL.
   */
  termsOfService?: string;
  /**
   * **REQUIRED**. The title of the API.
   */
  title: string;
  /**
   * **REQUIRED**. The version of the OpenAPI document (which is distinct from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oasVersion OpenAPI Specification version} or the API implementation version).
   */
  version: string;
}
/**
 * License information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * name: Apache 2.0
 * identifier: Apache-2.0
 * ```
 */
interface LicenseObject$2 {
  /**
   * An {@link https://spdx.org/licenses/ SPDX} license expression for the API. The `identifier` field is mutually exclusive of the `url` field.
   */
  identifier?: string;
  /**
   * **REQUIRED**. The license name used for the API.
   */
  name: string;
  /**
   * A URL to the license used for the API. This MUST be in the form of a URL. The `url` field is mutually exclusive of the `identifier` field.
   */
  url?: string;
}
/**
 * The `Link object` represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.
 *
 * Unlike _dynamic_ links (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.
 *
 * For computing links, and providing instructions to execute them, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions runtime expression} is used for accessing values in an operation and using them as parameters while invoking the linked operation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * A linked operation MUST be identified using either an `operationRef` or `operationId`. In the case of an `operationId`, it MUST be unique and resolved in the scope of the OAS document. Because of the potential for name clashes, the `operationRef` syntax is preferred for OpenAPI documents with external references.
 *
 * **Examples**
 *
 * Computing a link from a request operation where the `$request.path.id` is used to pass a request parameter to the linked operation.
 *
 * ```yaml
 * paths:
 *   /users/{id}:
 *     parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: the user identifier, as userId
 *       schema:
 *         type: string
 *     get:
 *       responses:
 *         '200':
 *           description: the user being returned
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   uuid: # the unique user id
 *                     type: string
 *                     format: uuid
 *           links:
 *             address:
 *               # the target link operationId
 *               operationId: getUserAddress
 *               parameters:
 *                 # get the `id` field from the request path parameter named `id`
 *                 userId: $request.path.id
 *   # the path item of the linked operation
 *   /users/{userid}/address:
 *     parameters:
 *     - name: userid
 *       in: path
 *       required: true
 *       description: the user identifier, as userId
 *       schema:
 *         type: string
 *     # linked operation
 *     get:
 *       operationId: getUserAddress
 *       responses:
 *         '200':
 *           description: the user's address
 * ```
 *
 * When a runtime expression fails to evaluate, no parameter value is passed to the target operation.
 *
 * Values from the response body can be used to drive a linked operation.
 *
 * ```yaml
 * links:
 *   address:
 *     operationId: getUserAddressByUUID
 *     parameters:
 *       # get the `uuid` field from the `uuid` field in the response body
 *       userUuid: $response.body#/uuid
 * ```
 *
 * Clients follow all links at their discretion. Neither permissions, nor the capability to make a successful call to that link, is guaranteed solely by the existence of a relationship.
 *
 * **OperationRef Examples**
 *
 * As references to `operationId` MAY NOT be possible (the `operationId` is an optional field in an {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}), references MAY also be made through a relative `operationRef`:
 *
 * ```yaml
 * links:
 *   UserRepositories:
 *     # returns array of '#/components/schemas/repository'
 *     operationRef: '#/paths/~12.0~1repositories~1{username}/get'
 *     parameters:
 *       username: $response.body#/username
 * ```
 *
 * or an absolute `operationRef`:
 *
 * ```yaml
 * links:
 *   UserRepositories:
 *     # returns array of '#/components/schemas/repository'
 *     operationRef: 'https://na2.gigantic-server.com/#/paths/~12.0~1repositories~1{username}/get'
 *     parameters:
 *       username: $response.body#/username
 * ```
 *
 * Note that in the use of `operationRef`, the _escaped forward-slash_ is necessary when using JSON references.
 *
 * **Runtime Expressions**
 *
 * Runtime expressions allow defining values based on information that will only be available within the HTTP message in an actual API call. This mechanism is used by {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#link-object Link Objects} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#callback-object Callback Objects}.
 *
 * The runtime expression is defined by the following {@link https://tools.ietf.org/html/rfc5234 ABNF} syntax
 *
 * ```abnf
 * expression = ( "$url" / "$method" / "$statusCode" / "$request." source / "$response." source )
 * source = ( header-reference / query-reference / path-reference / body-reference )
 * header-reference = "header." token
 * query-reference = "query." name
 * path-reference = "path." name
 * body-reference = "body" ["#" json-pointer ]
 * json-pointer    = *( "/" reference-token )
 * reference-token = *( unescaped / escaped )
 * unescaped       = %x00-2E / %x30-7D / %x7F-10FFFF
 *   ; %x2F ('/') and %x7E ('~') are excluded from 'unescaped'
 * escaped         = "~" ( "0" / "1" )
 *   ; representing '~' and '/', respectively
 * name = *( CHAR )
 * token = 1*tchar
 * tchar = "!" / "#" / "$" / "%" / "&" / "'" / "*" / "+" / "-" / "." /
 *   "^" / "_" / "`" / "|" / "~" / DIGIT / ALPHA
 * ```
 *
 * Here, `json-pointer` is taken from {@link https://tools.ietf.org/html/rfc6901 RFC6901}, `char` from {@link https://tools.ietf.org/html/rfc7159#section-7 RFC7159} and `token` from {@link https://tools.ietf.org/html/rfc7230#section-3.2.6 RFC7230}.
 *
 * The `name` identifier is case-sensitive, whereas `token` is not.
 *
 * The table below provides examples of runtime expressions and examples of their use in a value:
 *
 * **Examples**
 *
 * | Source Location | example expression | notes |
 * | -------- | ------- | ------- |
 * | HTTP Method | `$method` | The allowable values for the `$method` will be those for the HTTP operation. |
 * | Requested media type | `$request.header.accept` | |
 * | Request parameter | `$request.path.id` | Request parameters MUST be declared in the `parameters` section of the parent operation or they cannot be evaluated. This includes request headers. |
 * | Request body property | `$request.body#/user/uuid` | In operations which accept payloads, references may be made to portions of the `requestBody` or the entire body. |
 * | Request URL | `$url` | |
 * | Response value | `$response.body#/status` | In operations which return payloads, references may be made to portions of the response body or the entire body. |
 * | Response header | `$response.header.Server` | Single header values only are available |
 *
 * Runtime expressions preserve the type of the referenced value. Expressions can be embedded into string values by surrounding the expression with `{}` curly braces.
 */
interface LinkObject$1 {
  /**
   * A description of the link. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * The name of an _existing_, resolvable OAS operation, as defined with a unique `operationId`. This field is mutually exclusive of the `operationRef` field.
   */
  operationId?: string;
  /**
   * A relative or absolute URI reference to an OAS operation. This field is mutually exclusive of the `operationId` field, and MUST point to an {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}. Relative `operationRef` values MAY be used to locate an existing {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object} in the OpenAPI definition. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
   */
  operationRef?: string;
  /**
   * A map representing parameters to pass to an operation as specified with `operationId` or identified via `operationRef`. The key is the parameter name to be used, whereas the value can be a constant or an expression to be evaluated and passed to the linked operation. The parameter name can be qualified using the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn parameter location} `[{in}.]{name}` for operations that use the same parameter name in different locations (e.g. path.id).
   */
  parameters?: Record<string, unknown | string>;
  /**
   * A literal value or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#runtime-expressions {expression}} to use as a request body when calling the target operation.
   */
  requestBody?: unknown | string;
  /**
   * A server object to be used by the target operation.
   */
  server?: ServerObject;
}
/**
 * Each Media Type Object provides schema and examples for the media type identified by its key.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Media Type Examples**
 *
 * @example
 * ```yaml
 * application/json:
 *   schema:
 *     $ref: "#/components/schemas/Pet"
 *   examples:
 *     cat:
 *       summary: An example of a cat
 *       value:
 *         name: Fluffy
 *         petType: Cat
 *         color: White
 *         gender: male
 *         breed: Persian
 *     dog:
 *       summary: An example of a dog with a cat's name
 *       value:
 *         name: Puma
 *         petType: Dog
 *         color: Black
 *         gender: Female
 *         breed: Mixed
 *     frog:
 *       $ref: "#/components/examples/frog-example"
 * ```
 */
interface MediaTypeObject$2 {
  /**
   * A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The encoding object SHALL only apply to `requestBody` objects when the media type is `multipart` or `application/x-www-form-urlencoded`.
   */
  encoding?: Record<string, EncodingObject$1>;
  /**
   * Example of the media type. The example object SHOULD be in the correct format as specified by the media type. The `example` field is mutually exclusive of the `examples` field. Furthermore, if referencing a `schema` which contains an example, the `example` value SHALL _override_ the example provided by the schema.
   */
  example?: unknown;
  /**
   * Examples of the media type. Each example object SHOULD match the media type and specified schema if present. The `examples` field is mutually exclusive of the `example` field. Furthermore, if referencing a `schema` which contains an example, the `examples` value SHALL _override_ the example provided by the schema.
   */
  examples?: Record<string, ExampleObject$2 | ReferenceObject$1>;
  /**
   * The schema defining the content of the request, response, or parameter.
   */
  schema?: SchemaObject;
}
/**
 * Configuration details for a supported OAuth Flow
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **OAuth Flow Object Examples**
 *
 * ```yaml
 * type: oauth2
 * flows:
 *   implicit:
 *     authorizationUrl: https://example.com/api/oauth/dialog
 *     scopes:
 *       write:pets: modify pets in your account
 *       read:pets: read your pets
 *   authorizationCode:
 *     authorizationUrl: https://example.com/api/oauth/dialog
 *     tokenUrl: https://example.com/api/oauth/token
 *     scopes:
 *       write:pets: modify pets in your account
 *       read:pets: read your pets
 * ```
 */
interface OAuthFlowObject$1 {
  /**
   * **REQUIRED (`"implicit"`, `"authorizationCode"`)**. The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  authorizationUrl?: string;
  /**
   * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  refreshUrl?: string;
  /**
   * **REQUIRED**. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty.
   */
  scopes: Record<string, string>;
  /**
   * **REQUIRED (`"password"`, `"clientCredentials"`, `"authorizationCode"`)**. The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  tokenUrl?: string;
}
/**
 * Allows configuration of the supported OAuth Flows.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 */
interface OAuthFlowsObject$1 {
  /**
   * Configuration for the OAuth Authorization Code flow. Previously called `accessCode` in OpenAPI 2.0.
   */
  authorizationCode?: OAuthFlowObject$1;
  /**
   * Configuration for the OAuth Client Credentials flow. Previously called `application` in OpenAPI 2.0.
   */
  clientCredentials?: OAuthFlowObject$1;
  /**
   * Configuration for the OAuth Implicit flow
   */
  implicit?: OAuthFlowObject$1;
  /**
   * Configuration for the OAuth Resource Owner Password flow
   */
  password?: OAuthFlowObject$1;
}
/**
 * Describes a single API operation on a path.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * tags:
 * - pet
 * summary: Updates a pet in the store with form data
 * operationId: updatePetWithForm
 * parameters:
 * - name: petId
 *   in: path
 *   description: ID of pet that needs to be updated
 *   required: true
 *   schema:
 *     type: string
 * requestBody:
 *   content:
 *     'application/x-www-form-urlencoded':
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             description: Updated name of the pet
 *             type: string
 *           status:
 *             description: Updated status of the pet
 *             type: string
 *         required:
 *           - status
 * responses:
 *   '200':
 *     description: Pet updated.
 *     content:
 *       'application/json': {}
 *       'application/xml': {}
 *   '405':
 *     description: Method Not Allowed
 *     content:
 *       'application/json': {}
 *       'application/xml': {}
 * security:
 * - petstore_auth:
 *   - write:pets
 *   - read:pets
 * ```
 */
interface OperationObject {
  /**
   * A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#callback-object Callback Object} that describes a request that may be initiated by the API provider and the expected responses.
   */
  callbacks?: Record<string, CallbackObject$1 | ReferenceObject$1>;
  /**
   * Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A verbose explanation of the operation behavior. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: ExternalDocumentationObject$2;
  /**
   * Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is **case-sensitive**. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
   */
  operationId?: string;
  /**
   * A list of parameters that are applicable for this operation. If a parameter is already defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#pathItemParameters Path Item}, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsParameters OpenAPI Object's components/parameters}.
   */
  parameters?: ReadonlyArray<ParameterObject | ReferenceObject$1>;
  /**
   * The request body applicable for this operation. The `requestBody` is fully supported in HTTP methods where the HTTP 1.1 specification {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1 RFC7231} has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.1 GET}, {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.2 HEAD} and {@link https://datatracker.ietf.org/doc/html/rfc7231#section-4.3.5 DELETE}), `requestBody` is permitted but does not have well-defined semantics and SHOULD be avoided if possible.
   */
  requestBody?: RequestBodyObject | ReferenceObject$1;
  /**
   * The list of possible responses as they are returned from executing this operation.
   */
  responses?: ResponsesObject$2;
  /**
   * A declaration of which security mechanisms can be used for this operation. The list of values includes alternative security requirement objects that can be used. Only one of the security requirement objects need to be satisfied to authorize a request. To make security optional, an empty security requirement (`{}`) can be included in the array. This definition overrides any declared top-level {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oasSecurity `security`}. To remove a top-level security declaration, an empty array can be used.
   */
  security?: ReadonlyArray<SecurityRequirementObject$2>;
  /**
   * An alternative `server` array to service this operation. If an alternative `server` object is specified at the Path Item Object or Root level, it will be overridden by this value.
   */
  servers?: ReadonlyArray<ServerObject>;
  /**
   * A short summary of what the operation does.
   */
  summary?: string;
  /**
   * A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
   */
  tags?: ReadonlyArray<string>;
}
/**
 * Describes a single operation parameter.
 *
 * A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn location}.
 *
 * **Parameter Locations**
 *
 * There are four possible parameter locations specified by the `in` field:
 *
 * - path - Used together with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-templating Path Templating}, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is `itemId`.
 * - query - Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is `id`.
 * - header - Custom headers that are expected as part of the request. Note that {@link https://datatracker.ietf.org/doc/html/rfc7230#page-22 RFC7230} states header names are case insensitive.
 * - cookie - Used to pass a specific cookie value to the API.
 *
 * The rules for serialization of the parameter are specified in one of two ways. For simpler scenarios, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterSchema `schema`} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} can describe the structure and syntax of the parameter.
 *
 * For more complex scenarios, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterContent `content`} property can define the media type and schema of the parameter. A parameter MUST contain either a `schema` property, or a `content` property, but not both. When `example` or `examples` are provided in conjunction with the `schema` object, the example MUST follow the prescribed serialization strategy for the parameter.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * A header parameter with an array of 64 bit integer numbers:
 *
 * @example
 * ```yaml
 * name: token
 * in: header
 * description: token to be passed as a header
 * required: true
 * schema:
 *   type: array
 *   items:
 *     type: integer
 *     format: int64
 * style: simple
 * ```
 *
 * A path parameter of a string value:
 *
 * @example
 * ```yaml
 * name: username
 * in: path
 * description: username to fetch
 * required: true
 * schema:
 *   type: string
 * ```
 *
 * An optional query parameter of a string value, allowing multiple values by repeating the query parameter:
 *
 * @example
 * ```yaml
 * name: id
 * in: query
 * description: ID of the object to fetch
 * required: false
 * schema:
 *   type: array
 *   items:
 *     type: string
 * style: form
 * explode: true
 * ```
 *
 * A free-form query parameter, allowing undefined parameters of a specific type:
 *
 * @example
 * ```yaml
 * in: query
 * name: freeForm
 * schema:
 *   type: object
 *   additionalProperties:
 *     type: integer
 * style: form
 * ```
 *
 * A complex parameter using `content` to define serialization:
 *
 * @example
 * ```yaml
 * in: query
 * name: coordinates
 * content:
 *   application/json:
 *     schema:
 *       type: object
 *       required:
 *         - lat
 *         - long
 *       properties:
 *         lat:
 *           type: number
 *         long:
 *           type: number
 * ```
 */
interface ParameterObject {
  /**
   * Sets the ability to pass empty-valued parameters. This is valid only for `query` parameters and allows sending a parameter with an empty value. Default value is `false`. If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} is used, and if behavior is `n/a` (cannot be serialized), the value of `allowEmptyValue` SHALL be ignored. Use of this property is NOT RECOMMENDED, as it is likely to be removed in a later revision.
   */
  allowEmptyValue?: boolean;
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by {@link https://datatracker.ietf.org/doc/html/rfc3986#section-2.2 RFC3986} `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. This property only applies to parameters with an `in` value of `query`. The default value is `false`.
   */
  allowReserved?: boolean;
  /**
   * A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.
   */
  content?: Record<string, MediaTypeObject$2>;
  /**
   * Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A brief description of the parameter. This could contain examples of use. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Example of the parameter's potential value. The example SHOULD match the specified schema and encoding properties if present. The `example` field is mutually exclusive of the `examples` field. Furthermore, if referencing a `schema` that contains an example, the `example` value SHALL _override_ the example provided by the schema. To represent examples of media types that cannot naturally be represented in JSON or YAML, a string value can contain the example with escaping where necessary.
   */
  example?: unknown;
  /**
   * Examples of the parameter's potential value. Each example SHOULD contain a value in the correct format as specified in the parameter encoding. The `examples` field is mutually exclusive of the `example` field. Furthermore, if referencing a `schema` that contains an example, the `examples` value SHALL _override_ the example provided by the schema.
   */
  examples?: Record<string, ExampleObject$2 | ReferenceObject$1>;
  /**
   * When this is true, parameter values of type `array` or `object` generate separate parameters for each value of the array or key-value pair of the map. For other types of parameters this property has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterStyle `style`} is `form`, the default value is `true`. For all other styles, the default value is `false`.
   */
  explode?: boolean;
  /**
   * **REQUIRED**. The location of the parameter. Possible values are `"query"`, `"header"`, `"path"` or `"cookie"`.
   */
  in: 'cookie' | 'header' | 'path' | 'query';
  /**
   * **REQUIRED**. The name of the parameter. Parameter names are _case sensitive_.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn `in`} is `"path"`, the `name` field MUST correspond to a template expression occurring within the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#pathsPath path} field in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#paths-object Paths Object}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-templating Path Templating} for further information.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn `in`} is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored.
   * - For all other cases, the `name` corresponds to the parameter name used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn `in`} property.
   */
  name: string;
  /**
   * Determines whether this parameter is mandatory. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn parameter location} is `"path"`, this property is **REQUIRED** and its value MUST be `true`. Otherwise, the property MAY be included and its default value is `false`.
   */
  required?: boolean;
  /**
   * The schema defining the type used for the parameter.
   */
  schema?: SchemaObject;
  /**
   * Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of `in`): for `query` - `form`; for `path` - `simple`; for `header` - `simple`; for `cookie` - `form`.
   */
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited';
}
/**
 * Describes the operations available on a single path. A Path Item MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-filtering ACL constraints}. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * get:
 *   description: Returns pets based on ID
 *   summary: Find pets by ID
 *   operationId: getPetsById
 *   responses:
 *     '200':
 *       description: pet response
 *       content:
 *         '*\/*':
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Pet'
 *     default:
 *       description: error payload
 *       content:
 *         'text/html':
 *           schema:
 *             $ref: '#/components/schemas/ErrorModel'
 * parameters:
 * - name: id
 *   in: path
 *   description: ID of pet to use
 *   required: true
 *   schema:
 *     type: array
 *     items:
 *       type: string
 *   style: simple
 * ```
 */
interface PathItemObject$2 {
  /**
   * Allows for a referenced definition of this path item. The referenced structure MUST be in the form of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object Path Item Object}. In case a Path Item Object field appears both in the defined object and the referenced object, the behavior is undefined. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
   */
  $ref?: string;
  /**
   * A definition of a DELETE operation on this path.
   */
  delete?: OperationObject;
  /**
   * An optional, string description, intended to apply to all operations in this path. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A definition of a GET operation on this path.
   */
  get?: OperationObject;
  /**
   * A definition of a HEAD operation on this path.
   */
  head?: OperationObject;
  /**
   * A definition of a OPTIONS operation on this path.
   */
  options?: OperationObject;
  /**
   * A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsParameters OpenAPI Object's components/parameters}.
   */
  parameters?: ReadonlyArray<ParameterObject | ReferenceObject$1>;
  /**
   * A definition of a PATCH operation on this path.
   */
  patch?: OperationObject;
  /**
   * A definition of a POST operation on this path.
   */
  post?: OperationObject;
  /**
   * A definition of a PUT operation on this path.
   */
  put?: OperationObject;
  /**
   * An alternative `server` array to service all operations in this path.
   */
  servers?: ReadonlyArray<ServerObject>;
  /**
   * An optional, string summary, intended to apply to all operations in this path.
   */
  summary?: string;
  /**
   * A definition of a TRACE operation on this path.
   */
  trace?: OperationObject;
}
/**
 * Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-object `Server Object`} in order to construct the full URL. The Paths MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-filtering Access Control List (ACL) constraints}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Path Templating Matching**
 *
 * Assuming the following paths, the concrete definition, `/pets/mine`, will be matched first if used:
 *
 * ```
 * /pets/{petId}
 * /pets/mine
 * ```
 *
 * The following paths are considered identical and invalid:
 *
 * ```
 * /pets/{petId}
 * /pets/{name}
 * ```
 *
 * The following may lead to ambiguous resolution:
 *
 * ```
 * /{entity}/me
 * /books/{id}
 * ```
 *
 * **Paths Object Example**
 *
 * ```yaml
 * /pets:
 *   get:
 *     description: Returns all pets from the system that the user has access to
 *     responses:
 *       '200':
 *         description: A list of pets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pet'
 * ```
 */
interface PathsObject$2 {
  /**
   * A relative path to an individual endpoint. The field name MUST begin with a forward slash (`/`). The path is **appended** (no relative URL resolution) to the expanded URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-object `Server Object`}'s `url` field in order to construct the full URL. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-templating Path templating} is allowed. When matching URLs, concrete (non-templated) paths would be matched before their templated counterparts. Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical. In case of ambiguous matching, it's up to the tooling to decide which one to use.
   */
  [path: `/${string}`]: PathItemObject$2;
}
/**
 * A simple object to allow referencing other components in the OpenAPI document, internally and externally.
 *
 * The `$ref` string value contains a URI {@link https://datatracker.ietf.org/doc/html/rfc3986 RFC3986}, which identifies the location of the value being referenced.
 *
 * See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#relative-references-in-uris Relative References}.
 *
 * This object cannot be extended with additional properties and any properties added SHALL be ignored.
 *
 * Note that this restriction on additional properties is a difference between Reference Objects and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object `Schema Objects`} that contain a `$ref` keyword.
 *
 * Reference Object Example
 *
 * @example
 * ```yaml
 * $ref: '#/components/schemas/Pet'
 * ```
 *
 * Relative Schema Document Example
 *
 * @example
 * ```yaml
 * $ref: Pet.yaml
 * ```
 *
 * Relative Documents With Embedded Schema Example
 *
 * @example
 * ```yaml
 * $ref: definitions.yaml#/Pet
 * ```
 */
interface ReferenceObject$1 {
  /**
   * **REQUIRED**. The reference identifier. This MUST be in the form of a URI.
   */
  $ref: string;
  /**
   * A description which by default SHOULD override that of the referenced component. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation. If the referenced object-type does not allow a `description` field, then this field has no effect.
   */
  description?: string;
  /**
   * A short summary which by default SHOULD override that of the referenced component. If the referenced object-type does not allow a `summary` field, then this field has no effect.
   */
  summary?: string;
}
/**
 * Describes a single request body.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Request Body Examples**
 *
 * A request body with a referenced model definition.
 *
 * ```yaml
 * description: user to add to the system
 * content:
 *   'application/json':
 *     schema:
 *       $ref: '#/components/schemas/User'
 *     examples:
 *       user:
 *         summary: User Example
 *         externalValue: 'https://foo.bar/examples/user-example.json'
 *   'application/xml':
 *     schema:
 *       $ref: '#/components/schemas/User'
 *     examples:
 *       user:
 *         summary: User example in XML
 *         externalValue: 'https://foo.bar/examples/user-example.xml'
 *   'text/plain':
 *     examples:
 *       user:
 *         summary: User example in Plain text
 *         externalValue: 'https://foo.bar/examples/user-example.txt'
 *   '*\/*':
 *     examples:
 *       user:
 *         summary: User example in other format
 *         externalValue: 'https://foo.bar/examples/user-example.whatever'
 * ```
 *
 * A body parameter that is an array of string values:
 *
 * ```yaml
 * description: user to add to the system
 * required: true
 * content:
 *   text/plain:
 *     schema:
 *       type: array
 *       items:
 *         type: string
 * ```
 */
interface RequestBodyObject {
  /**
   * **REQUIRED**. The content of the request body. The key is a media type or {@link https://tools.ietf.org/html/rfc7231#appendix-D media type range} and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
   */
  content: Record<string, MediaTypeObject$2>;
  /**
   * A brief description of the request body. This could contain examples of use. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Determines if the request body is required in the request. Defaults to `false`.
   */
  required?: boolean;
}
/**
 * Describes a single response from an API Operation, including design-time, static `links` to operations based on the response.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * Response of an array of a complex type:
 *
 * @example
 * ```yaml
 * description: A complex object array response
 * content:
 *   application/json:
 *     schema:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/VeryComplexType'
 * ```
 *
 * Response with a string type:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * content:
 *   text/plain:
 *     schema:
 *       type: string
 * ```
 *
 * Plain text response with headers:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * content:
 *   text/plain:
 *     schema:
 *       type: string
 *     example: 'whoa!'
 * headers:
 *   X-Rate-Limit-Limit:
 *     description: The number of allowed requests in the current period
 *     schema:
 *       type: integer
 *   X-Rate-Limit-Remaining:
 *     description: The number of remaining requests in the current period
 *     schema:
 *       type: integer
 *   X-Rate-Limit-Reset:
 *     description: The number of seconds left in the current period
 *     schema:
 *       type: integer
 * ```
 *
 * Response with no return value:
 *
 * @example
 * ```yaml
 * description: object created
 * ```
 */
interface ResponseObject {
  /**
   * A map containing descriptions of potential response payloads. The key is a media type or {@link https://datatracker.ietf.org/doc/html/rfc7231#appendix-D media type range} and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
   */
  content?: Record<string, MediaTypeObject$2>;
  /**
   * **REQUIRED**. A description of the response. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description: string;
  /**
   * Maps a header name to its definition. {@link https://datatracker.ietf.org/doc/html/rfc7230#page-22 RFC7230} states header names are case insensitive. If a response header is defined with the name `"Content-Type"`, it SHALL be ignored.
   */
  headers?: Record<string, HeaderObject$2 | ReferenceObject$1>;
  /**
   * A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object Component Objects}.
   */
  links?: Record<string, LinkObject$1 | ReferenceObject$1>;
}
/**
 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.
 *
 * The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance. However, documentation is expected to cover a successful operation response and any known errors.
 *
 * The `default` MAY be used as a default response object for all HTTP codes that are not covered individually by the `Responses Object`.
 *
 * The `Responses Object` MUST contain at least one response code, and if only one response code is provided it SHOULD be the response for a successful operation call.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * A 200 response for a successful operation and a default response for others (implying an error):
 *
 * @example
 * ```yaml
 * '200':
 *   description: a pet to be returned
 *   content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/Pet'
 * default:
 *   description: Unexpected error
 *   content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/ErrorModel'
 * ```
 */
interface ResponsesObject$2 {
  /**
   * Any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#http-status-codes HTTP status code} can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character `X`. For example, `2XX` represents all response codes between `[200-299]`. Only the following range definitions are allowed: `1XX`, `2XX`, `3XX`, `4XX`, and `5XX`. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
   */
  [httpStatusCode: string]: ResponseObject | ReferenceObject$1 | undefined;
  /**
   * The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses.
   */
  default?: ResponseObject | ReferenceObject$1;
}
/**
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is a superset of the {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00 JSON Schema Specification Draft 2020-12}.
 *
 * For more information about the properties, see {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00 JSON Schema Core} and {@link https://tools.ietf.org/html/draft-bhutton-json-schema-validation-00 JSON Schema Validation}.
 *
 * Unless stated otherwise, the property definitions follow those of JSON Schema and do not add any additional semantics. Where JSON Schema indicates that behavior is defined by the application (e.g. for annotations), OAS also defers the definition of semantics to the application consuming the OpenAPI document.
 *
 * **Properties**
 *
 * The OpenAPI Schema Object {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00#section-4.3.3 dialect} is defined as requiring the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#fixed-fields-20 OAS base vocabulary}, in addition to the vocabularies as specified in the JSON Schema draft 2020-12 {@link https://tools.ietf.org/html/draft-bhutton-json-schema-00#section-8 general purpose meta-schema}.
 *
 * The OpenAPI Schema Object dialect for this version of the specification is identified by the URI `https://spec.openapis.org/oas/3.1/dialect/base` (the "OAS dialect schema id").
 *
 * The following properties are taken from the JSON Schema specification but their definitions have been extended by the OAS:
 *
 * - description - {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
 * - format - See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#dataTypeFormat Data Type Formats} for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
 *
 * In addition to the JSON Schema properties comprising the OAS dialect, the Schema Object supports keywords from any other vocabularies, or entirely arbitrary properties.
 *
 * The OpenAPI Specification's base vocabulary is comprised of the following keywords:
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}, though as noted, additional properties MAY omit the `x-` prefix within this object.
 */
type SchemaObject = JsonSchemaDraft2020_12;
/**
 * Lists the required security schemes to execute this operation. The name used for each property MUST correspond to a security scheme declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsSecuritySchemes Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object Components Object}.
 *
 * Security Requirement Objects that contain multiple schemes require that all schemes MUST be satisfied for a request to be authorized. This enables support for scenarios where multiple query parameters or HTTP headers are required to convey security information.
 *
 * When a list of Security Requirement Objects is defined on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-object OpenAPI Object} or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}, only one of the Security Requirement Objects in the list needs to be satisfied to authorize the request.
 *
 * Non-OAuth2 Security Requirement
 *
 * @example
 * ```yaml
 * api_key: []
 * ```
 *
 * OAuth2 Security Requirement
 *
 * @example
 * ```yaml
 * petstore_auth:
 * - write:pets
 * - read:pets
 * ```
 *
 * Optional OAuth2 Security
 *
 * @example
 * ```yaml
 * security:
 * - {}
 * - petstore_auth:
 *   - write:pets
 *   - read:pets
 * ```
 */
interface SecurityRequirementObject$2 {
  /**
   * Each name MUST correspond to a security scheme which is declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#componentsSecuritySchemes Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object Components Object}. If the security scheme is of type `"oauth2"` or `"openIdConnect"`, then the value is a list of scope names required for the execution, and the list MAY be empty if authorization does not require a specified scope. For other security scheme types, the array MAY contain a list of role names which are required for the execution, but are not otherwise defined or exchanged in-band.
   */
  [name: string]: ReadonlyArray<string>;
}
/**
 * Defines a security scheme that can be used by the operations.
 *
 * Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter or as a query parameter), mutual TLS (use of a client certificate), OAuth2's common flows (implicit, password, client credentials and authorization code) as defined in {@link https://tools.ietf.org/html/rfc6749 RFC6749}, and {@link https://tools.ietf.org/html/draft-ietf-oauth-discovery-06 OpenID Connect Discovery}. Please note that as of 2020, the implicit flow is about to be deprecated by {@link https://tools.ietf.org/html/draft-ietf-oauth-security-topics OAuth 2.0 Security Best Current Practice}. Recommended for most use case is Authorization Code Grant flow with PKCE.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **Security Scheme Object Example**
 *
 * **Basic Authentication Sample**
 *
 * ```yaml
 * type: http
 * scheme: basic
 * ```
 *
 * **API Key Sample**
 *
 * ```yaml
 * type: apiKey
 * name: api_key
 * in: header
 * ```
 *
 * **JWT Bearer Sample**
 *
 * ```yaml
 * type: http
 * scheme: bearer
 * bearerFormat: JWT
 * ```
 *
 * **Implicit OAuth2 Sample**
 *
 * ```yaml
 * type: oauth2
 * flows:
 *   implicit:
 *     authorizationUrl: https://example.com/api/oauth/dialog
 *     scopes:
 *       write:pets: modify pets in your account
 *       read:pets: read your pets
 * ```
 */
type SecuritySchemeObject = {
  /**
   * A description for security scheme. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
} & ({
  /**
   * **REQUIRED**. The location of the API key. Valid values are "query", "header" or "cookie".
   */
  in: 'cookie' | 'header' | 'query';
  /**
   * **REQUIRED**. The name of the header, query or cookie parameter to be used.
   */
  name: string;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'apiKey';
} | {
  /**
   * A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
   */
  bearerFormat?: string;
  /**
   * **REQUIRED**. The name of the HTTP Authorization scheme to be used in the {@link https://tools.ietf.org/html/rfc7235#section-5.1 Authorization header as defined in RFC7235}. The values used SHOULD be registered in the {@link https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml IANA Authentication Scheme registry}.
   */
  scheme: string;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'http';
} | {
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'mutualTLS';
} | {
  /**
   * **REQUIRED**. An object containing configuration information for the flow types supported.
   */
  flows: OAuthFlowsObject$1;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'oauth2';
} | {
  /**
   * **REQUIRED**. OpenId Connect URL to discover OAuth2 configuration values. This MUST be in the form of a URL. The OpenID Connect standard requires the use of TLS.
   */
  openIdConnectUrl: string;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"mutualTLS"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'openIdConnect';
});
/**
 * An object representing a Server.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * url: https://development.gigantic-server.com/v1
 * description: Development server
 * ```
 */
interface ServerObject {
  /**
   * An optional string describing the host designated by the URL. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * **REQUIRED**. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in `{`brackets`}`.
   */
  url: string;
  /**
   * A map between a variable name and its value. The value is used for substitution in the server's URL template.
   */
  variables?: Record<string, ServerVariableObject$1>;
}
/**
 * An object representing a Server Variable for server URL template substitution.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 */
interface ServerVariableObject$1 {
  /**
   * **REQUIRED**. The default value to use for substitution, which SHALL be sent if an alternate value is _not_ supplied. Note this behavior is different than the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Object's} treatment of default values, because in those cases parameter values are optional. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#serverVariableEnum `enum`} is defined, the value MUST exist in the enum's values.
   */
  default: string;
  /**
   * An optional description for the server variable. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * An enumeration of string values to be used if the substitution options are from a limited set. The array MUST NOT be empty.
   */
  enum?: ReadonlyArray<string>;
}
/**
 * Adds metadata to a single tag that is used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object Operation Object}. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * @example
 * ```yaml
 * name: pet
 * description: Pets operations
 * ```
 */
interface TagObject$2 {
  /**
   * A description for the tag. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this tag.
   */
  externalDocs?: ExternalDocumentationObject$2;
  /**
   * **REQUIRED**. The name of the tag.
   */
  name: string;
}
/**
 * A metadata object that allows for more fine-tuned XML model definitions.
 *
 * When using arrays, XML element names are _not_ inferred (for singular/plural forms) and the `name` property SHOULD be used to add that information. See examples for expected behavior.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#specification-extensions Specification Extensions}.
 *
 * **XML Object Examples**
 *
 * The examples of the XML object definitions are included inside a property definition of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object Schema Object} with a sample of the XML representation of it.
 *
 * **No XML Element**
 *
 * Basic string property:
 *
 * ```yaml
 * animals:
 *   type: string
 * ```
 *
 * ```xml
 * <animals>...</animals>
 * ```
 *
 * Basic string array property ({@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#xmlWrapped `wrapped`} is `false` by default):
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 * ```
 *
 * ```xml
 * <animals>...</animals>
 * <animals>...</animals>
 * <animals>...</animals>
 * ```
 *
 * **XML Name Replacement**
 *
 * ```yaml
 * animals:
 *   type: string
 *   xml:
 *     name: animal
 * ```
 *
 * ```xml
 * <animal>...</animal>
 * ```
 *
 * **XML Attribute, Prefix and Namespace**
 *
 * In this example, a full model definition is shown.
 *
 * ```yaml
 * Person:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       format: int32
 *       xml:
 *         attribute: true
 *     name:
 *       type: string
 *       xml:
 *         namespace: https://example.com/schema/sample
 *         prefix: sample
 * ```
 *
 * ```xml
 * <Person id="123">
 *   <sample:name xmlns:sample="https://example.com/schema/sample">example</sample:name>
 * </Person>
 * ```
 *
 * **XML Arrays**
 *
 * Changing the element names:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 * ```
 *
 * ```xml
 * <animal>value</animal>
 * <animal>value</animal>
 * ```
 *
 * The external `name` property has no effect on the XML:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 *   xml:
 *     name: aliens
 * ```
 *
 * ```xml
 * <animal>value</animal>
 * <animal>value</animal>
 * ```
 *
 * Even when the array is wrapped, if a name is not explicitly defined, the same name will be used both internally and externally:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *   xml:
 *     wrapped: true
 * ```
 *
 * ```xml
 * <animals>
 *   <animals>value</animals>
 *   <animals>value</animals>
 * </animals>
 * ```
 *
 * To overcome the naming problem in the example above, the following definition can be used:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 *   xml:
 *     wrapped: true
 * ```
 *
 * ```xml
 * <animals>
 *   <animal>value</animal>
 *   <animal>value</animal>
 * </animals>
 * ```
 *
 * Affecting both internal and external names:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *     xml:
 *       name: animal
 *   xml:
 *     name: aliens
 *     wrapped: true
 * ```
 *
 * ```xml
 * <aliens>
 *   <animal>value</animal>
 *   <animal>value</animal>
 * </aliens>
 * ```
 *
 * If we change the external element but not the internal ones:
 *
 * ```yaml
 * animals:
 *   type: array
 *   items:
 *     type: string
 *   xml:
 *     name: aliens
 *     wrapped: true
 * ```
 *
 * ```xml
 * <aliens>
 *   <aliens>value</aliens>
 *   <aliens>value</aliens>
 * </aliens>
 * ```
 */
interface XMLObject$2 {
  /**
   * Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
   */
  attribute?: boolean;
  /**
   * Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
   */
  name?: string;
  /**
   * The URI of the namespace definition. This MUST be in the form of an absolute URI.
   */
  namespace?: string;
  /**
   * The prefix to be used for the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#xmlName name}.
   */
  prefix?: string;
  /**
   * MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`).
   */
  wrapped?: boolean;
}
//#endregion
//#region src/openApi/3.1.x/types/spec-extensions.d.ts
interface OpenApiSchemaExtensions {
  /**
   * Adds support for polymorphism. The discriminator is an object name that is used to differentiate between other schemas which may satisfy the payload description. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#composition-and-inheritance-polymorphism Composition and Inheritance} for more details.
   */
  discriminator?: DiscriminatorObject$1;
  /**
   * A free-form property to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
   *
   * **Deprecated**: The `example` property has been deprecated in favor of the JSON Schema `examples` keyword. Use of `example` is discouraged, and later versions of this specification may remove it.
   */
  example?: unknown;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: ExternalDocumentationObject$2;
  /**
   * This MAY be used only on properties schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property.
   */
  xml?: XMLObject$2;
}
//#endregion
//#region src/openApi/3.1.x/types/json-schema-draft-2020-12.d.ts
// TODO: left out some keywords related to structuring a complex schema and declaring a dialect
interface JsonSchemaDraft2020_12 extends ArrayKeywords, NumberKeywords, ObjectKeywords, StringKeywords, EnumExtensions, OpenApiSchemaExtensions {
  /**
   * The `$comment` {@link https://json-schema.org/learn/glossary#keyword keyword} is strictly intended for adding comments to a schema. Its value must always be a string. Unlike the annotations `title`, `description`, and `examples`, JSON schema {@link https://json-schema.org/learn/glossary#implementation implementations} aren't allowed to attach any meaning or behavior to it whatsoever, and may even strip them at any time. Therefore, they are useful for leaving notes to future editors of a JSON schema, but should not be used to communicate to users of the schema.
   */
  $comment?: string;
  /**
   * A schema can reference another schema using the `$ref` keyword. The value of `$ref` is a URI-reference that is resolved against the schema's {@link https://json-schema.org/understanding-json-schema/structuring#base-uri Base URI}. When evaluating a `$ref`, an implementation uses the resolved identifier to retrieve the referenced schema and applies that schema to the {@link https://json-schema.org/learn/glossary#instance instance}.
   *
   * The `$ref` keyword may be used to create recursive schemas that refer to themselves.
   */
  $ref?: string;
  /**
   * `allOf`: (AND) Must be valid against _all_ of the {@link https://json-schema.org/learn/glossary#subschema subschemas}
   *
   * To validate against `allOf`, the given data must be valid against all of the given subschemas.
   *
   * {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf} can not be used to "extend" a schema to add more details to it in the sense of object-oriented inheritance. {@link https://json-schema.org/learn/glossary#instance Instances} must independently be valid against "all of" the schemas in the `allOf`. See the section on {@link https://json-schema.org/understanding-json-schema/reference/object#extending Extending Closed Schemas} for more information.
   */
  allOf?: ReadonlyArray<JsonSchemaDraft2020_12>;
  /**
   * `anyOf`: (OR) Must be valid against _any_ of the subschemas
   *
   * To validate against `anyOf`, the given data must be valid against any (one or more) of the given subschemas.
   */
  anyOf?: ReadonlyArray<JsonSchemaDraft2020_12>;
  /**
   * The `const` keyword is used to restrict a value to a single value.
   */
  const?: unknown;
  /**
   * The `contentEncoding` keyword specifies the encoding used to store the contents, as specified in {@link https://tools.ietf.org/html/rfc2045 RFC 2054, part 6.1} and {@link https://datatracker.ietf.org/doc/html/rfc4648 RFC 4648}.
   *
   * The acceptable values are `quoted-printable`, `base16`, `base32`, and `base64`. If not specified, the encoding is the same as the containing JSON document.
   *
   * Without getting into the low-level details of each of these encodings, there are really only two options useful for modern usage:
   * - If the content is encoded in the same encoding as the enclosing JSON document (which for practical purposes, is almost always UTF-8), leave `contentEncoding` unspecified, and include the content in a string as-is. This includes text-based content types, such as `text/html` or `application/xml`.
   * - If the content is binary data, set `contentEncoding` to `base64` and encode the contents using {@link https://tools.ietf.org/html/rfc4648 Base64}. This would include many image types, such as `image/png` or audio types, such as `audio/mpeg`.
   */
  contentEncoding?: 'base16' | 'base32' | 'base64' | 'quoted-printable';
  /**
   * The `contentMediaType` keyword specifies the MIME type of the contents of a string, as described in {@link https://tools.ietf.org/html/rfc2046 RFC 2046}. There is a list of {@link http://www.iana.org/assignments/media-types/media-types.xhtml MIME types officially registered by the IANA}, but the set of types supported will be application and operating system dependent. Mozilla Developer Network also maintains a {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types shorter list of MIME types that are important for the web}
   */
  contentMediaType?: string;
  /**
   * The `default` keyword specifies a default value. This value is not used to fill in missing values during the validation process. Non-validation tools such as documentation generators or form generators may use this value to give hints to users about how to use a value. However, `default` is typically used to express that if a value is missing, then the value is semantically the same as if the value was present with the default value. The value of `default` should validate against the schema in which it resides, but that isn't required.
   */
  default?: unknown;
  /**
   * The `dependentRequired` {@link https://json-schema.org/learn/glossary#keyword keyword} conditionally requires that certain properties must be present if a given property is present in an object. For example, suppose we have a {@link https://json-schema.org/learn/glossary#schema schema} representing a customer. If you have their credit card number, you also want to ensure you have a billing address. If you don't have their credit card number, a billing address would not be required. We represent this dependency of one property on another using the `dependentRequired` keyword. The value of the `dependentRequired` keyword is an object. Each entry in the object maps from the name of a property, _p_, to an array of strings listing properties that are required if _p_ is present.
   */
  dependentRequired?: Record<string, ReadonlyArray<string>>;
  /**
   * The `dependentSchemas` keyword conditionally applies a {@link https://json-schema.org/learn/glossary#subschema subschema} when a given property is present. This schema is applied in the same way {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf} applies schemas. Nothing is merged or extended. Both schemas apply independently.
   */
  dependentSchemas?: Record<string, JsonSchemaDraft2020_12>;
  /**
   * The `deprecated` keyword is a boolean that indicates that the {@link https://json-schema.org/learn/glossary#instance instance} value the keyword applies to should not be used and may be removed in the future.
   */
  deprecated?: boolean;
  /**
   * The `title` and `description` keywords must be strings. A "title" will preferably be short, whereas a "description" will provide a more lengthy explanation about the purpose of the data described by the schema.
   */
  description?: string;
  /**
   * The `if`, `then` and `else` keywords allow the application of a subschema based on the outcome of another schema, much like the `if`/`then`/`else` constructs you've probably seen in traditional programming languages.
   *
   * If `if` is valid, `then` must also be valid (and `else` is ignored.) If `if` is invalid, `else` must also be valid (and `then` is ignored).
   *
   * If `then` or `else` is not defined, `if` behaves as if they have a value of `true`.
   *
   * If `then` and/or `else` appear in a schema without `if`, `then` and `else` are ignored.
   */
  else?: JsonSchemaDraft2020_12;
  /**
   * The `enum` {@link https://json-schema.org/learn/glossary#keyword keyword} is used to restrict a value to a fixed set of values. It must be an array with at least one element, where each element is unique.
   *
   * You can use `enum` even without a type, to accept values of different types.
   */
  enum?: ReadonlyArray<unknown>;
  /**
   * The `examples` keyword is a place to provide an array of examples that validate against the schema. This isn't used for validation, but may help with explaining the effect and purpose of the schema to a reader. Each entry should validate against the schema in which it resides, but that isn't strictly required. There is no need to duplicate the `default` value in the `examples` array, since `default` will be treated as another example.
   */
  examples?: ReadonlyArray<unknown>;
  /**
   * The `format` keyword allows for basic semantic identification of certain kinds of string values that are commonly used. For example, because JSON doesn't have a "DateTime" type, dates need to be encoded as strings. `format` allows the schema author to indicate that the string value should be interpreted as a date. By default, `format` is just an annotation and does not effect validation.
   *
   * Optionally, validator {@link https://json-schema.org/learn/glossary#implementation implementations} can provide a configuration option to enable `format` to function as an assertion rather than just an annotation. That means that validation will fail if, for example, a value with a `date` format isn't in a form that can be parsed as a date. This can allow values to be constrained beyond what the other tools in JSON Schema, including {@link https://json-schema.org/understanding-json-schema/reference/regular_expressions Regular Expressions} can do.
   *
   * There is a bias toward networking-related formats in the JSON Schema specification, most likely due to its heritage in web technologies. However, custom formats may also be used, as long as the parties exchanging the JSON documents also exchange information about the custom format types. A JSON Schema validator will ignore any format type that it does not understand.
   */
  format?: JsonSchemaFormats$2;
  /**
   * The `if`, `then` and `else` keywords allow the application of a subschema based on the outcome of another schema, much like the `if`/`then`/`else` constructs you've probably seen in traditional programming languages.
   *
   * If `if` is valid, `then` must also be valid (and `else` is ignored.) If `if` is invalid, `else` must also be valid (and `then` is ignored).
   *
   * If `then` or `else` is not defined, `if` behaves as if they have a value of `true`.
   *
   * If `then` and/or `else` appear in a schema without `if`, `then` and `else` are ignored.
   */
  if?: JsonSchemaDraft2020_12;
  /**
   * `not`: (NOT) Must _not_ be valid against the given schema
   *
   * The `not` keyword declares that an instance validates if it doesn't validate against the given subschema.
   */
  not?: JsonSchemaDraft2020_12;
  /**
   * `oneOf`: (XOR) Must be valid against _exactly one_ of the subschemas
   *
   * To validate against `oneOf`, the given data must be valid against exactly one of the given subschemas.
   *
   * Careful consideration should be taken when using `oneOf` entries as the nature of it requires verification of _every_ sub-schema which can lead to increased processing times. Prefer `anyOf` where possible.
   */
  oneOf?: ReadonlyArray<JsonSchemaDraft2020_12>;
  /**
   * The boolean keywords `readOnly` and `writeOnly` are typically used in an API context. `readOnly` indicates that a value should not be modified. It could be used to indicate that a `PUT` request that changes a value would result in a `400 Bad Request` response. `writeOnly` indicates that a value may be set, but will remain hidden. In could be used to indicate you can set a value with a `PUT` request, but it would not be included when retrieving that record with a `GET` request.
   */
  readOnly?: boolean;
  /**
   * The `if`, `then` and `else` keywords allow the application of a subschema based on the outcome of another schema, much like the `if`/`then`/`else` constructs you've probably seen in traditional programming languages.
   *
   * If `if` is valid, `then` must also be valid (and `else` is ignored.) If `if` is invalid, `else` must also be valid (and `then` is ignored).
   *
   * If `then` or `else` is not defined, `if` behaves as if they have a value of `true`.
   *
   * If `then` and/or `else` appear in a schema without `if`, `then` and `else` are ignored.
   */
  then?: JsonSchemaDraft2020_12;
  /**
   * The `title` and `description` keywords must be strings. A "title" will preferably be short, whereas a "description" will provide a more lengthy explanation about the purpose of the data described by the schema.
   */
  title?: string;
  /**
   * If it is an array, it must be an array of strings, where each string is the name of one of the basic types, and each element is unique. In this case, the JSON snippet is valid if it matches any of the given types.
   */
  type?: MaybeArray<JsonSchemaTypes$1>;
  /**
   * The boolean keywords `readOnly` and `writeOnly` are typically used in an API context. `readOnly` indicates that a value should not be modified. It could be used to indicate that a `PUT` request that changes a value would result in a `400 Bad Request` response. `writeOnly` indicates that a value may be set, but will remain hidden. In could be used to indicate you can set a value with a `PUT` request, but it would not be included when retrieving that record with a `GET` request.
   */
  writeOnly?: boolean;
}
interface ArrayKeywords {
  /**
   * While the `items` schema must be valid for every item in the array, the `contains` schema only needs to validate against one or more items in the array.
   */
  contains?: JsonSchemaDraft2020_12;
  /**
   * List validation is useful for arrays of arbitrary length where each item matches the same schema. For this kind of array, set the `items` {@link https://json-schema.org/learn/glossary#keyword keyword} to a single schema that will be used to validate all of the items in the array.
   *
   * The `items` keyword can be used to control whether it's valid to have additional items in a tuple beyond what is defined in `prefixItems`. The value of the `items` keyword is a schema that all additional items must pass in order for the keyword to validate.
   *
   * Note that `items` doesn't "see inside" any {@link https://json-schema.org/learn/glossary#instance instances} of `allOf`, `anyOf`, or `oneOf` in the same {@link https://json-schema.org/learn/glossary#subschema subschema}.
   */
  items?: JsonSchemaDraft2020_12 | false;
  /**
   * `minContains` and `maxContains` can be used with `contains` to further specify how many times a schema matches a `contains` constraint. These keywords can be any non-negative number including zero.
   */
  maxContains?: number;
  /**
   * The length of the array can be specified using the `minItems` and `maxItems` keywords. The value of each keyword must be a non-negative number. These keywords work whether doing {@link https://json-schema.org/understanding-json-schema/reference/array#items list validation} or {@link https://json-schema.org/understanding-json-schema/reference/array#tupleValidation tuple-validation}.
   */
  maxItems?: number;
  /**
   * `minContains` and `maxContains` can be used with `contains` to further specify how many times a schema matches a `contains` constraint. These keywords can be any non-negative number including zero.
   */
  minContains?: number;
  /**
   * The length of the array can be specified using the `minItems` and `maxItems` keywords. The value of each keyword must be a non-negative number. These keywords work whether doing {@link https://json-schema.org/understanding-json-schema/reference/array#items list validation} or {@link https://json-schema.org/understanding-json-schema/reference/array#tupleValidation tuple-validation}.
   */
  minItems?: number;
  /**
   * `prefixItems` is an array, where each item is a schema that corresponds to each index of the document's array. That is, an array where the first element validates the first element of the input array, the second element validates the second element of the input array, etc.
   */
  prefixItems?: ReadonlyArray<JsonSchemaDraft2020_12>;
  /**
   * The `unevaluatedItems` keyword is useful mainly when you want to add or disallow extra items to an array.
   *
   * `unevaluatedItems` applies to any values not evaluated by an `items`, `prefixItems`, or `contains` keyword. Just as `unevaluatedProperties` affects only properties in an object, `unevaluatedItems` affects only items in an array.
   *
   * Watch out! The word "unevaluated" _does not mean_ "not evaluated by `items`, `prefixItems`, or `contains`." "Unevaluated" means "not successfully evaluated", or "does not evaluate to true".
   *
   * Like with `items`, if you set `unevaluatedItems` to false, you can disallow extra items in the array.
   */
  unevaluatedItems?: JsonSchemaDraft2020_12 | false;
  /**
   * A schema can ensure that each of the items in an array is unique. Simply set the `uniqueItems` keyword to `true`.
   */
  uniqueItems?: boolean;
}
interface NumberKeywords {
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  exclusiveMaximum?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  exclusiveMinimum?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  maximum?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  minimum?: number;
  /**
   * Numbers can be restricted to a multiple of a given number, using the `multipleOf` keyword. It may be set to any positive number. The multiple can be a floating point number.
   */
  multipleOf?: number;
}
interface ObjectKeywords {
  /**
   * The `additionalProperties` keyword is used to control the handling of extra stuff, that is, properties whose names are not listed in the `properties` keyword or match any of the regular expressions in the `patternProperties` keyword. By default any additional properties are allowed.
   *
   * The value of the `additionalProperties` keyword is a schema that will be used to validate any properties in the {@link https://json-schema.org/learn/glossary#instance instance} that are not matched by `properties` or `patternProperties`. Setting the `additionalProperties` schema to `false` means no additional properties will be allowed.
   *
   * It's important to note that `additionalProperties` only recognizes properties declared in the same {@link https://json-schema.org/learn/glossary#subschema subschema} as itself. So, `additionalProperties` can restrict you from "extending" a schema using {@link https://json-schema.org/understanding-json-schema/reference/combining combining} keywords such as {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf}.
   */
  additionalProperties?: JsonSchemaDraft2020_12 | false;
  /**
   * The number of properties on an object can be restricted using the `minProperties` and `maxProperties` keywords. Each of these must be a non-negative integer.
   */
  maxProperties?: number;
  /**
   * The number of properties on an object can be restricted using the `minProperties` and `maxProperties` keywords. Each of these must be a non-negative integer.
   */
  minProperties?: number;
  /**
   * Sometimes you want to say that, given a particular kind of property name, the value should match a particular schema. That's where `patternProperties` comes in: it maps regular expressions to schemas. If a property name matches the given regular expression, the property value must validate against the corresponding schema.
   */
  patternProperties?: Record<string, JsonSchemaDraft2020_12>;
  /**
   * The properties (key-value pairs) on an object are defined using the `properties` {@link https://json-schema.org/learn/glossary#keyword keyword}. The value of `properties` is an object, where each key is the name of a property and each value is a {@link https://json-schema.org/learn/glossary#schema schema} used to validate that property. Any property that doesn't match any of the property names in the `properties` keyword is ignored by this keyword.
   */
  properties?: Record<string, JsonSchemaDraft2020_12 | true>;
  /**
   * The names of properties can be validated against a schema, irrespective of their values. This can be useful if you don't want to enforce specific properties, but you want to make sure that the names of those properties follow a specific convention. You might, for example, want to enforce that all names are valid ASCII tokens so they can be used as attributes in a particular programming language.
   *
   * Since object keys must always be strings anyway, it is implied that the schema given to `propertyNames` is always at least:
   *
   * ```json
   * { "type": "string" }
   * ```
   */
  propertyNames?: JsonSchemaDraft2020_12;
  /**
   * By default, the properties defined by the `properties` keyword are not required. However, one can provide a list of required properties using the `required` keyword.
   *
   * The `required` keyword takes an array of zero or more strings. Each of these strings must be unique.
   */
  required?: ReadonlyArray<string>;
  /**
   * The `unevaluatedProperties` keyword is similar to `additionalProperties` except that it can recognize properties declared in subschemas. So, the example from the previous section can be rewritten without the need to redeclare properties.
   *
   * `unevaluatedProperties` works by collecting any properties that are successfully validated when processing the schemas and using those as the allowed list of properties. This allows you to do more complex things like conditionally adding properties.
   */
  unevaluatedProperties?: JsonSchemaDraft2020_12 | false;
}
interface StringKeywords {
  /**
   * The length of a string can be constrained using the `minLength` and `maxLength` {@link https://json-schema.org/learn/glossary#keyword keywords}. For both keywords, the value must be a non-negative number.
   */
  maxLength?: number;
  /**
   * The length of a string can be constrained using the `minLength` and `maxLength` {@link https://json-schema.org/learn/glossary#keyword keywords}. For both keywords, the value must be a non-negative number.
   */
  minLength?: number;
  /**
   * The `pattern` keyword is used to restrict a string to a particular regular expression. The regular expression syntax is the one defined in JavaScript ({@link https://www.ecma-international.org/publications-and-standards/standards/ecma-262/ ECMA 262} specifically) with Unicode support. See {@link https://json-schema.org/understanding-json-schema/reference/regular_expressions Regular Expressions} for more information.
   */
  pattern?: string;
}
type JsonSchemaFormats$2 = 'date' | 'date-time' | 'duration' | 'email' | 'hostname' | 'idn-email' | 'idn-hostname' | 'ipv4' | 'ipv6' | 'iri' | 'iri-reference' | 'json-pointer' | 'regex' | 'relative-json-pointer' | 'time' | 'uri' | 'uri-reference' | 'uri-template' | 'uuid' | (string & {});
type JsonSchemaTypes$1 = 'array' | 'boolean' | 'integer' | 'null' | 'number' | 'object' | 'string';
//#endregion
//#region src/config/utils/package.d.ts
type Package = {
  /**
   * Get the installed version of a package.
   * @param name The name of the package to get the version for.
   * @returns A SemVer object containing version information, or undefined if the package is not installed
   *         or the version string is invalid.
   */
  getVersion: (name: string) => SemVer | undefined;
  /**
   * Check if a given package is installed in the project.
   * @param name The name of the package to check.
   */
  isInstalled: (name: string) => boolean;
  /**
   * Check if the installed version of a package or a given SemVer object satisfies a semver range.
   * @param nameOrVersion The name of the package to check, or a SemVer object.
   * @param range The semver range to check against.
   * @returns True if the version satisfies the range, false otherwise.
   */
  satisfies: (nameOrVersion: string | SemVer, range: string, optionsOrLoose?: boolean | RangeOptions) => boolean;
};
//#endregion
//#region src/graph/types/graph.d.ts
/**
 * The main graph structure for OpenAPI node analysis.
 *
 * @property nodeDependencies - For each node with at least one dependency, the set of normalized JSON Pointers it references via $ref. Nodes with no dependencies are omitted.
 * @property nodes - Map from normalized JSON Pointer to NodeInfo for every node in the spec.
 * @property reverseNodeDependencies - For each node with at least one dependent, the set of nodes that reference it via $ref. Nodes with no dependents are omitted.
 */
type Graph = {
  /**
   * For each node with at least one dependency, the set of normalized JSON Pointers it references via $ref.
   * Nodes with no dependencies are omitted from this map.
   */
  nodeDependencies: Map<string, Set<string>>;
  /**
   * Map from normalized JSON Pointer to NodeInfo for every node in the spec.
   */
  nodes: Map<string, NodeInfo>;
  /**
   * For each node with at least one dependent, the set of nodes that reference it via $ref.
   * Nodes with no dependents are omitted from this map.
   */
  reverseNodeDependencies: Map<string, Set<string>>;
  /**
   * For each node, the set of direct $ref targets that appear anywhere inside the node's
   * subtree (the node itself and its children). This is populated during graph construction
   * and is used to compute top-level dependency relationships where $ref may be attached to
   * child pointers instead of the parent.
   */
  subtreeDependencies: Map<string, Set<string>>;
  /**
   * For each node, the set of all (transitive) normalized JSON Pointers it references via $ref anywhere in its subtree.
   * This includes both direct and indirect dependencies, making it useful for filtering, codegen, and tree-shaking.
   */
  transitiveDependencies: Map<string, Set<string>>;
};
/**
 * Information about a node in the OpenAPI graph.
 *
 * @property deprecated - Whether the node is deprecated. Optional.
 * @property key - The property name or array index in the parent, or null for root.
 * @property node - The actual object at this pointer in the spec.
 * @property parentPointer - The JSON Pointer of the parent node, or null for root.
 * @property scopes - The set of access scopes for this node, if any. Optional.
 * @property tags - The set of tags for this node, if any. Optional.
 */
type NodeInfo = {
  /** Whether the node is deprecated. Optional. */
  deprecated?: boolean;
  /** The property name or array index in the parent, or null for root. */
  key: string | number | null;
  /** The actual object at this pointer in the spec.  */
  node: unknown;
  /** The JSON Pointer of the parent node, or null for root. */
  parentPointer: string | null;
  /** The set of access scopes for this node, if any. Optional. */
  scopes?: Set<Scope>;
  /** The set of tags for this node, if any. Optional. */
  tags?: Set<string>;
};
//#endregion
//#region src/graph/types/walk.d.ts
type GetPointerPriorityFn = (pointer: string) => number;
type MatchPointerToGroupFn<T$1 extends string = string> = (pointer: string, kind?: T$1) => PointerGroupMatch<T$1>;
type PointerGroupMatch<T$1 extends string = string> = {
  kind: T$1;
  matched: true;
} | {
  kind?: undefined;
  matched: false;
};
type WalkOptions<T$1 extends string = string> = {
  /**
   * Optional priority function used to compute a numeric priority for each
   * pointer. Lower values are emitted earlier. Useful to customize ordering
   * beyond the built-in group preferences.
   */
  getPointerPriority?: GetPointerPriorityFn;
  /**
   * Optional function to match a pointer to a group name.
   *
   * @param pointer The pointer string
   * @returns The group name, or undefined if no match
   */
  matchPointerToGroup?: MatchPointerToGroupFn<T$1>;
  /**
   * Order of walking schemas.
   *
   * The "declarations" option ensures that schemas are walked in the order
   * they are declared in the input document. This is useful for scenarios where
   * the order of declaration matters, such as when generating code that relies
   * on the sequence of schema definitions.
   *
   * The "topological" option ensures that schemas are walked in an order
   * where dependencies are visited before the schemas that depend on them.
   * This is useful for scenarios where you need to process or generate
   * schemas in a way that respects their interdependencies.
   *
   * @default 'topological'
   */
  order?: 'declarations' | 'topological';
  /**
   * Optional grouping preference for walking. When provided, walk function
   * will prefer emitting kinds listed earlier in this array when it is safe
   * to do so (it will only apply the preference when doing so does not
   * violate dependency ordering).
   */
  preferGroups?: ReadonlyArray<T$1>;
};
//#endregion
//#region src/types/case.d.ts
type StringCase = 'camelCase' | 'PascalCase' | 'preserve' | 'snake_case' | 'SCREAMING_SNAKE_CASE';
type StringName = string | ((name: string) => string);
//#endregion
//#region src/plugins/@angular/common/api.d.ts
type SelectorType$20 = 'class' | 'httpRequest' | 'httpResource' | 'HttpRequest' | 'inject' | 'Injectable';
type IApi$20 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `class`: raw string entry from path
   *  - `httpRequest`: `operation.id` string
   *  - `httpResource`: never
   *  - `HttpRequest`: never
   *  - `inject`: never
   *  - `Injectable`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$20, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@angular/common/types.d.ts
type UserConfig$27 = Plugin.Name<'@angular/common'> & Plugin.Hooks & {
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Options for generating HTTP Request instances.
   *
   * @default true
   */
  httpRequests?: boolean | {
    /**
     * Whether to generate the resource as a class.
     *
     * @default false
     */
    asClass?: boolean;
    /**
     * Builds the class name for the generated resource.
     * By default, the class name is suffixed with "Resources".
     */
    classNameBuilder?: StringName;
    /**
     * Whether or not to create HTTP Request instances.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Builds the method name for the generated resource.
     *
     * By default, the operation id is used, if `asClass` is false, the method is also suffixed with "Resource".
     */
    methodNameBuilder?: (operation: IR.OperationObject) => string;
  };
  /**
   * Options for generating HTTP resource APIs.
   *
   * @default true
   */
  httpResources?: boolean | {
    /**
     * Whether to generate the resource as a class.
     * @default false
     */
    asClass?: boolean;
    /**
     * Builds the class name for the generated resource.
     * By default, the class name is suffixed with "Resources".
     */
    classNameBuilder?: StringName;
    /**
     * Whether or not to create HTTP resource APIs.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Builds the method name for the generated resource.
     *
     * By default, the operation id is used, if `asClass` is false, the method is also suffixed with "Resource".
     */
    methodNameBuilder?: (operation: IR.OperationObject) => string;
  };
};
type Config$14 = Plugin.Name<'@angular/common'> & Plugin.Hooks & {
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Options for generating HTTP Request instances.
   */
  httpRequests: {
    /**
     * Whether to generate the resource as a class.
     *
     * @default false
     */
    asClass: boolean;
    /**
     * Builds the class name for the generated resource.
     * By default, the class name is suffixed with "Resources".
     */
    classNameBuilder: StringName;
    /**
     * Whether or not to create HTTP Request instances.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Builds the method name for the generated resource.
     * By default, the operation id is used, if `asClass` is false, the method is also suffixed with "Resource".
     */
    methodNameBuilder: (operation: IR.OperationObject) => string;
  };
  /**
   * Options for generating HTTP resource APIs.
   */
  httpResources: {
    /**
     * Whether to generate the resource as a class.
     *
     * @default false
     */
    asClass: boolean;
    /**
     * Builds the class name for the generated resource.
     * By default, the class name is suffixed with "Resources".
     */
    classNameBuilder: StringName;
    /**
     * Whether or not to create HTTP resource APIs.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Builds the method name for the generated resource.
     * By default, the operation id is used, if `asClass` is false, the method is also suffixed with "Resource".
     */
    methodNameBuilder: (operation: IR.OperationObject) => string;
  };
};
type AngularCommonPlugin = DefinePlugin<UserConfig$27, Config$14, IApi$20>;
//#endregion
//#region src/plugins/@hey-api/client-axios/api.d.ts
type SelectorType$19 = 'client';
type IApi$19 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `client`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$19, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/client-axios/types.d.ts
type UserConfig$26 = Plugin.Name<'@hey-api/client-axios'> & Client$2.Config & {
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: boolean;
};
type HeyApiClientAxiosPlugin = DefinePlugin<UserConfig$26, UserConfig$26, IApi$19>;
//#endregion
//#region src/plugins/@hey-api/client-fetch/api.d.ts
type SelectorType$18 = 'client';
type IApi$18 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `client`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$18, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/client-fetch/types.d.ts
type UserConfig$25 = Plugin.Name<'@hey-api/client-fetch'> & Client$2.Config & {
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: boolean;
};
type HeyApiClientFetchPlugin = DefinePlugin<UserConfig$25, UserConfig$25, IApi$18>;
//#endregion
//#region src/plugins/@hey-api/client-next/api.d.ts
type SelectorType$17 = 'client';
type IApi$17 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `client`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$17, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/client-next/types.d.ts
type UserConfig$24 = Plugin.Name<'@hey-api/client-next'> & Client$2.Config & {
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: boolean;
};
type HeyApiClientNextPlugin = DefinePlugin<UserConfig$24, UserConfig$24, IApi$17>;
//#endregion
//#region src/plugins/@hey-api/client-nuxt/api.d.ts
type SelectorType$16 = 'client';
type IApi$16 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `client`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$16, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/client-nuxt/types.d.ts
type UserConfig$23 = Plugin.Name<'@hey-api/client-nuxt'> & Client$2.Config;
type HeyApiClientNuxtPlugin = DefinePlugin<UserConfig$23, UserConfig$23, IApi$16>;
//#endregion
//#region src/plugins/@hey-api/client-ofetch/api.d.ts
type SelectorType$15 = 'client';
type IApi$15 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `client`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$15, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/client-ofetch/types.d.ts
type UserConfig$22 = Plugin.Name<'@hey-api/client-ofetch'> & Client$2.Config & {
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: boolean;
};
type HeyApiClientOfetchPlugin = DefinePlugin<UserConfig$22, UserConfig$22, IApi$15>;
//#endregion
//#region src/plugins/@hey-api/client-core/types.d.ts
interface PluginHandler {
  (...args: Parameters<HeyApiClientAngularPlugin['Handler']>): void;
  (...args: Parameters<HeyApiClientAxiosPlugin['Handler']>): void;
  (...args: Parameters<HeyApiClientFetchPlugin['Handler']>): void;
  (...args: Parameters<HeyApiClientNextPlugin['Handler']>): void;
  (...args: Parameters<HeyApiClientNuxtPlugin['Handler']>): void;
  (...args: Parameters<HeyApiClientOfetchPlugin['Handler']>): void;
}
/**
 * Public Client API.
 */
declare namespace Client$2 {
  export type Config = Plugin.Hooks & {
    /**
     * Set a default base URL when creating the client? You can set `baseUrl`
     * to a string which will be used as the base URL. If your input defines
     * server(s), you can set `baseUrl` to a number to pick a specific server
     * to use as the base URL. You can disable setting the base URL by setting
     * `baseUrl` to `false`. By default, `baseUrl` is `true` and it will try to
     * use the first defined server value. If there's none, we won't set a
     * base URL.
     *
     * If the matched URL contains template literals, it will be ignored.
     *
     * @default true
     */
    baseUrl?: string | number | boolean;
    /**
     * Bundle the client module? When `true`, the client module will be copied
     * from the client plugin and bundled with the generated output.
     *
     * @default true
     */
    bundle?: boolean;
    /**
     * Should the exports from the generated files be re-exported in the index
     * barrel file?
     *
     * @default false
     */
    exportFromIndex?: boolean;
    /**
     * Relative path to the runtime configuration file. This file must export
     * a `createClientConfig()` function. The `createClientConfig()` function
     * will be called on client initialization and the returned object will
     * become the client's initial configuration.
     *
     * You may want to initialize your client this way instead of calling
     * `setConfig()`. This is useful for example if you're using Next.js
     * to ensure your client always has the correct values.
     */
    runtimeConfigPath?: string;
    /**
     * Should the type helper for base URL allow only values matching the
     * server(s) defined in the input? By default, `strictBaseUrl` is `false`
     * which will provide type hints and allow you to pass any string.
     *
     * Note that setting `strictBaseUrl` to `true` can produce an invalid
     * build if you specify `baseUrl` which doesn't conform to the type helper.
     *
     * @default false
     */
    strictBaseUrl?: boolean;
  };
}
//#endregion
//#region src/plugins/@hey-api/client-angular/api.d.ts
type SelectorType$14 = 'client';
type IApi$14 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `client`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$14, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/client-angular/types.d.ts
type UserConfig$21 = Plugin.Name<'@hey-api/client-angular'> & Client$2.Config & {
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: boolean;
};
type HeyApiClientAngularPlugin = DefinePlugin<UserConfig$21, UserConfig$21, IApi$14>;
//#endregion
//#region src/plugins/@hey-api/legacy-angular/types.d.ts
type UserConfig$20 = Plugin.Name<'legacy/angular'> & Pick<Client$2.Config, 'output'>;
type HeyApiClientLegacyAngularPlugin = DefinePlugin<UserConfig$20>;
//#endregion
//#region src/plugins/@hey-api/legacy-axios/types.d.ts
type UserConfig$19 = Plugin.Name<'legacy/axios'> & Pick<Client$2.Config, 'output'>;
type HeyApiClientLegacyAxiosPlugin = DefinePlugin<UserConfig$19>;
//#endregion
//#region src/plugins/@hey-api/legacy-fetch/types.d.ts
type UserConfig$18 = Plugin.Name<'legacy/fetch'> & Pick<Client$2.Config, 'output'>;
type HeyApiClientLegacyFetchPlugin = DefinePlugin<UserConfig$18>;
//#endregion
//#region src/plugins/@hey-api/legacy-node/types.d.ts
type UserConfig$17 = Plugin.Name<'legacy/node'> & Pick<Client$2.Config, 'output'>;
type HeyApiClientLegacyNodePlugin = DefinePlugin<UserConfig$17>;
//#endregion
//#region src/plugins/@hey-api/legacy-xhr/types.d.ts
type UserConfig$16 = Plugin.Name<'legacy/xhr'> & Pick<Client$2.Config, 'output'>;
type HeyApiClientLegacyXhrPlugin = DefinePlugin<UserConfig$16>;
//#endregion
//#region src/openApi/common/interfaces/Dictionary.d.ts
interface Dictionary<T$1 = unknown> {
  [key: string]: T$1;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiReference.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object
 */
interface OpenApiReference {
  $ref?: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiExample.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#example-object
 */
interface OpenApiExample extends OpenApiReference {
  description?: string;
  externalValue?: string;
  summary?: string;
  value?: unknown;
}
//#endregion
//#region src/openApi/common/interfaces/WithEnumExtension.d.ts
interface WithEnumExtension {
  'x-enum-descriptions'?: ReadonlyArray<string>;
  'x-enum-varnames'?: ReadonlyArray<string>;
  'x-enumNames'?: ReadonlyArray<string>;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiDiscriminator.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#discriminator-object
 */
interface OpenApiDiscriminator {
  mapping?: Dictionary<string>;
  propertyName: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiExternalDocs.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#external-documentation-object
 */
interface OpenApiExternalDocs {
  description?: string;
  url: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiXml.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#xml-object
 */
interface OpenApiXml$1 {
  attribute?: boolean;
  name?: string;
  namespace?: string;
  prefix?: string;
  wrapped?: boolean;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiSchema.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object
 */
interface OpenApiSchema$1 extends OpenApiReference, WithEnumExtension {
  additionalProperties?: boolean | OpenApiSchema$1;
  allOf?: OpenApiSchema$1[];
  anyOf?: OpenApiSchema$1[];
  const?: string | number | boolean | null;
  default?: unknown;
  deprecated?: boolean;
  description?: string;
  discriminator?: OpenApiDiscriminator;
  enum?: (string | number)[];
  example?: unknown;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  externalDocs?: OpenApiExternalDocs;
  format?: 'binary' | 'boolean' | 'byte' | 'date-time' | 'date' | 'double' | 'float' | 'int32' | 'int64' | 'password' | 'string';
  items?: OpenApiSchema$1;
  maxItems?: number;
  maxLength?: number;
  maxProperties?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minProperties?: number;
  minimum?: number;
  multipleOf?: number;
  not?: OpenApiSchema$1[];
  nullable?: boolean;
  oneOf?: OpenApiSchema$1[];
  pattern?: string;
  prefixItems?: OpenApiSchema$1[];
  properties?: Dictionary<OpenApiSchema$1>;
  readOnly?: boolean;
  required?: string[];
  title?: string;
  type?: string | string[];
  uniqueItems?: boolean;
  writeOnly?: boolean;
  xml?: OpenApiXml$1;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiParameter.d.ts
/**
 * add only one type for now as that's needed to resolve the reported issue,
 * more types should be added though
 * {@link https://github.com/hey-api/openapi-ts/issues/612}
 */
type MediaType = 'application/json';
/**
 * encoding interface should be added, not adding it for now as it's not needed
 * to resolve the issue reported
 * {@link https://github.com/hey-api/openapi-ts/issues/612}
 */
interface MediaTypeObject$1 {
  example?: unknown;
  examples?: Dictionary<OpenApiExample>;
  schema: OpenApiSchema$1;
}
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object
 */
interface OpenApiParameter extends OpenApiReference {
  allowEmptyValue?: boolean;
  allowReserved?: boolean;
  content?: Record<MediaType, MediaTypeObject$1>;
  deprecated?: boolean;
  description?: string;
  example?: unknown;
  examples?: Dictionary<OpenApiExample>;
  explode?: boolean;
  in: 'cookie' | 'formData' | 'header' | 'path' | 'query';
  name: string;
  nullable?: boolean;
  required?: boolean;
  schema?: OpenApiSchema$1;
  style?: string;
}
//#endregion
//#region src/openApi/common/interfaces/client.d.ts
interface Enum {
  customDescription?: string;
  customName?: string;
  description?: string;
  value: string | number;
}
interface OperationParameter extends Model {
  in: 'body' | 'cookie' | 'formData' | 'header' | 'path' | 'query';
  mediaType: string | null;
  prop: string;
}
interface OperationParameters extends Pick<Model, '$refs' | 'imports'> {
  parameters: OperationParameter[];
  parametersBody: OperationParameter | null;
  parametersCookie: OperationParameter[];
  parametersForm: OperationParameter[];
  parametersHeader: OperationParameter[];
  parametersPath: OperationParameter[];
  parametersQuery: OperationParameter[];
}
interface OperationResponse extends Model {
  code: number | 'default' | '1XX' | '2XX' | '3XX' | '4XX' | '5XX';
  in: 'header' | 'response';
  responseTypes: Array<'error' | 'success'>;
}
type Method = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE';
interface Operation$1 extends OperationParameters {
  deprecated: boolean;
  description: string | null;
  /**
   * The operationId from OpenAPI specification.
   */
  id: string | null;
  method: Method;
  name: string;
  path: string;
  responseHeader: string | null;
  /**
   * All operation responses defined in OpenAPI specification.
   * Sorted by status code.
   */
  responses: OperationResponse[];
  summary: string | null;
  tags: string[] | null;
}
interface Schema {
  default?: unknown;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  format?: 'binary' | 'boolean' | 'byte' | 'date-time' | 'date' | 'double' | 'float' | 'int32' | 'int64' | 'password' | 'string';
  isDefinition: boolean;
  isNullable: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  maxItems?: number;
  maxLength?: number;
  maxProperties?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minProperties?: number;
  minimum?: number;
  multipleOf?: number;
  pattern?: string;
  uniqueItems?: boolean;
}
interface ModelMeta {
  /**
   * Ref to the type in OpenAPI specification.
   */
  $ref: string;
  /**
   * Name passed to the initial `getModel()` call.
   */
  name: string;
}
interface Model extends Schema {
  /**
   * **Experimental.** Contains list of original refs so they can be used
   * to access the schema from anywhere instead of relying on string name.
   * This allows us to do things like detect type of ref.
   */
  $refs: string[];
  base: string;
  deprecated?: boolean;
  description: string | null;
  enum: Enum[];
  enums: Model[];
  export: 'all-of' | 'any-of' | 'array' | 'const' | 'dictionary' | 'enum' | 'generic' | 'interface' | 'one-of' | 'reference';
  imports: string[];
  in: OperationParameter['in'] | OpenApiParameter['in'] | OperationResponse['in'] | '';
  link: Model | Model[] | null;
  meta?: ModelMeta;
  /**
   * @deprecated use `meta.name` instead
   */
  name: string;
  properties: Model[];
  template: string | null;
  type: string;
}
interface Client$1 {
  /**
   * Configuration for parsing and generating the output. This
   * is a mix of user-provided and default values.
   */
  config: Config$1;
  models: Model[];
  operations: Operation$1[];
  server: string;
  /**
   * Map of generated types where type names are keys. This is used to track
   * uniquely generated types as we may want to deduplicate if there are
   * multiple definitions with the same name but different value, or if we
   * want to transform names.
   */
  types: Record<string, ModelMeta>;
  version: string;
}
//#endregion
//#region src/utils/logger.d.ts
declare class Logger {
  private events;
  private end;
  report(print?: boolean): PerformanceMeasure | undefined;
  private reportEvent;
  private start;
  private storeEvent;
  timeEvent(name: string): {
    mark: PerformanceMark;
    timeEnd: () => void;
  };
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiExternalDocs.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#external-documentation-object
 */
interface OpenApiExternalDocs$1 {
  description?: string;
  url: string;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiContact.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#contact-object
 */
interface OpenApiContact$1 {
  email?: string;
  name?: string;
  url?: string;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiLicense.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#license-object
 */
interface OpenApiLicense$1 {
  name: string;
  url?: string;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiInfo.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#info-object
 */
interface OpenApiInfo$1 {
  contact?: OpenApiContact$1;
  description?: string;
  license?: OpenApiLicense$1;
  termsOfService?: string;
  title: string;
  version: string;
}
//#endregion
//#region src/openApi/v2/interfaces/Extensions/WithNullableExtension.d.ts
interface WithNullableExtension {
  'x-nullable'?: boolean;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiItems.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#items-object)
 */
interface OpenApiItems extends WithEnumExtension {
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes';
  default?: unknown;
  enum?: (string | number)[];
  exclusiveMaximum?: number;
  exclusiveMinimum?: number;
  format?: 'int32' | 'int64' | 'float' | 'double' | 'string' | 'boolean' | 'byte' | 'binary' | 'date' | 'date-time' | 'password';
  items?: OpenApiItems;
  maxItems?: number;
  maxLength?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minimum?: number;
  multipleOf?: number;
  pattern?: string;
  type?: string;
  uniqueItems?: boolean;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiReference.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object
 */
interface OpenApiReference$1 {
  $ref?: string;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiXml.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#xml-object
 */
interface OpenApiXml {
  attribute?: boolean;
  name?: string;
  namespace?: string;
  prefix?: string;
  wrapped?: boolean;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiSchema.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schema-object
 */
interface OpenApiSchema extends OpenApiReference$1, WithEnumExtension, WithNullableExtension {
  additionalProperties?: boolean | OpenApiSchema;
  allOf?: OpenApiSchema[];
  default?: unknown;
  description?: string;
  discriminator?: string;
  enum?: (string | number)[];
  example?: unknown;
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  externalDocs?: OpenApiExternalDocs$1;
  format?: 'int32' | 'int64' | 'float' | 'double' | 'string' | 'boolean' | 'byte' | 'binary' | 'date' | 'date-time' | 'password';
  items?: OpenApiSchema;
  maxItems?: number;
  maxLength?: number;
  maxProperties?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minProperties?: number;
  minimum?: number;
  multipleOf?: number;
  pattern?: string;
  properties?: Dictionary<OpenApiSchema>;
  readOnly?: boolean;
  required?: string[];
  title?: string;
  type?: string;
  uniqueItems?: boolean;
  xml?: OpenApiXml;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiParameter.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameter-object
 */
interface OpenApiParameter$1 extends OpenApiReference$1, WithEnumExtension, WithNullableExtension {
  allowEmptyValue?: boolean;
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';
  default?: unknown;
  description?: string;
  enum?: (string | number)[];
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  format?: 'int32' | 'int64' | 'float' | 'double' | 'string' | 'boolean' | 'byte' | 'binary' | 'date' | 'date-time' | 'password';
  in: 'path' | 'query' | 'header' | 'formData' | 'body';
  items?: OpenApiItems;
  maxItems?: number;
  maxLength?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minimum?: number;
  multipleOf?: number;
  name: string;
  pattern?: string;
  required?: boolean;
  schema?: OpenApiSchema;
  type?: string;
  uniqueItems?: boolean;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiExample.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#example-object
 */
interface OpenApiExample$1 {
  [mimetype: string]: unknown;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiHeader.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#header-object
 */
interface OpenApiHeader$1 {
  collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes';
  default?: unknown;
  description?: string;
  enum?: (string | number)[];
  exclusiveMaximum?: boolean;
  exclusiveMinimum?: boolean;
  format?: 'int32' | 'int64' | 'float' | 'double' | 'string' | 'boolean' | 'byte' | 'binary' | 'date' | 'date-time' | 'password';
  items?: Dictionary<OpenApiItems>;
  maxItems?: number;
  maxLength?: number;
  maximum?: number;
  minItems?: number;
  minLength?: number;
  minimum?: number;
  multipleOf?: number;
  pattern?: string;
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array';
  uniqueItems?: boolean;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiResponse.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#response-object
 */
interface OpenApiResponse$1 extends OpenApiReference$1 {
  description: string;
  examples?: OpenApiExample$1;
  headers?: Dictionary<OpenApiHeader$1>;
  schema?: OpenApiSchema & OpenApiReference$1;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiResponses.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#responses-object
 */
interface Response$1 {
  [httpcode: string]: OpenApiResponse$1;
}
type OpenApiResponses$1 = Response$1 & {
  default?: OpenApiResponse$1;
};
//#endregion
//#region src/openApi/v2/interfaces/OpenApiSecurityRequirement.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-requirement-object
 */
interface OpenApiSecurityRequirement$1 {
  [key: string]: string;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiOperation.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operation-object
 */
interface OpenApiOperation$1 {
  consumes?: string[];
  deprecated?: boolean;
  description?: string;
  externalDocs?: OpenApiExternalDocs$1;
  operationId?: string;
  parameters?: OpenApiParameter$1[];
  produces?: string[];
  responses: OpenApiResponses$1;
  schemes?: ('http' | 'https' | 'ws' | 'wss')[];
  security?: OpenApiSecurityRequirement$1[];
  summary?: string;
  tags?: string[];
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiPath.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-item-object
 */
interface OpenApiPath$1 extends OpenApiReference$1 {
  connect?: OpenApiOperation$1;
  delete?: OpenApiOperation$1;
  get?: OpenApiOperation$1;
  head?: OpenApiOperation$1;
  options?: OpenApiOperation$1;
  parameters?: OpenApiParameter$1[];
  patch?: OpenApiOperation$1;
  post?: OpenApiOperation$1;
  put?: OpenApiOperation$1;
  trace?: OpenApiOperation$1;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiSecurityScheme.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-scheme-object
 */
interface OpenApiSecurityScheme$1 {
  authorizationUrl?: string;
  description?: string;
  flow?: 'implicit' | 'password' | 'application' | 'accessCode';
  in?: 'query' | 'header';
  name?: string;
  scopes: Dictionary<string>;
  tokenUrl?: string;
  type: 'basic' | 'apiKey' | 'oauth2';
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApiTag.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#tag-object
 */
interface OpenApiTag$1 {
  description?: string;
  externalDocs?: OpenApiExternalDocs$1;
  name: string;
}
//#endregion
//#region src/openApi/v2/interfaces/OpenApi.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md
 */
interface OpenApi$2 {
  basePath?: string;
  consumes?: string[];
  definitions?: Dictionary<OpenApiSchema>;
  externalDocs?: OpenApiExternalDocs$1;
  host?: string;
  info: OpenApiInfo$1;
  parameters?: Dictionary<OpenApiParameter$1>;
  paths: Dictionary<OpenApiPath$1>;
  produces?: string[];
  responses?: Dictionary<OpenApiResponse$1>;
  schemes?: string[];
  security?: OpenApiSecurityRequirement$1[];
  securityDefinitions?: Dictionary<OpenApiSecurityScheme$1>;
  swagger: string;
  tags?: OpenApiTag$1[];
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiHeader.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#header-object
 */
interface OpenApiHeader extends OpenApiReference {
  allowEmptyValue?: boolean;
  allowReserved?: boolean;
  deprecated?: boolean;
  description?: string;
  example?: unknown;
  examples?: Dictionary<OpenApiExample>;
  explode?: boolean;
  required?: boolean;
  schema?: OpenApiSchema$1;
  style?: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiEncoding.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#encoding-object
 */
interface OpenApiEncoding {
  allowReserved?: boolean;
  contentType?: string;
  explode?: boolean;
  headers?: Dictionary<OpenApiHeader>;
  style?: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiMediaType.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#media-type-object
 */
interface OpenApiMediaType extends OpenApiReference {
  encoding?: Dictionary<OpenApiEncoding>;
  example?: unknown;
  examples?: Dictionary<OpenApiExample>;
  schema?: OpenApiSchema$1;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiRequestBody.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-object
 */
interface OpenApiRequestBody extends OpenApiReference {
  content: Dictionary<OpenApiMediaType>;
  description?: string;
  nullable?: boolean;
  required?: boolean;
  'x-body-name'?: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiServerVariable.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-variable-object
 */
interface OpenApiServerVariable extends WithEnumExtension {
  default: string;
  description?: string;
  enum?: (string | number)[];
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiServer.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#server-object
 */
interface OpenApiServer {
  description?: string;
  url: string;
  variables?: Dictionary<OpenApiServerVariable>;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiLink.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#link-object
 */
interface OpenApiLink extends OpenApiReference {
  description?: string;
  operationId?: string;
  operationRef?: string;
  parameters?: Dictionary<unknown>;
  requestBody?: unknown;
  server?: OpenApiServer;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiResponse.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#response-object
 */
interface OpenApiResponse extends OpenApiReference {
  content?: Dictionary<OpenApiMediaType>;
  description: string;
  headers?: Dictionary<OpenApiHeader>;
  links?: Dictionary<OpenApiLink>;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiResponses.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#responses-object
 */
interface Response {
  [httpcode: string]: OpenApiResponse;
}
type OpenApiResponses = OpenApiReference & Response & {
  default: OpenApiResponse;
};
//#endregion
//#region src/openApi/v3/interfaces/OpenApiSecurityRequirement.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-requirement-object
 */
interface OpenApiSecurityRequirement {
  [name: string]: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiOperation.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object
 */
interface OpenApiOperation {
  callbacks?: Dictionary<OpenApiCallback>;
  deprecated?: boolean;
  description?: string;
  externalDocs?: OpenApiExternalDocs;
  operationId?: string;
  parameters?: OpenApiParameter[];
  requestBody?: OpenApiRequestBody;
  responses: OpenApiResponses;
  security?: OpenApiSecurityRequirement[];
  servers?: OpenApiServer[];
  summary?: string;
  tags?: string[];
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiPath.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object
 */
interface OpenApiPath {
  connect?: OpenApiOperation;
  delete?: OpenApiOperation;
  description?: string;
  get?: OpenApiOperation;
  head?: OpenApiOperation;
  options?: OpenApiOperation;
  parameters?: OpenApiParameter[];
  patch?: OpenApiOperation;
  post?: OpenApiOperation;
  put?: OpenApiOperation;
  servers?: OpenApiServer[];
  summary?: string;
  trace?: OpenApiOperation;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiCallback.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#callback-object
 */
interface Callback {
  [key: string]: OpenApiPath;
}
type OpenApiCallback = OpenApiReference & Callback;
//#endregion
//#region src/openApi/v3/interfaces/OpenApiOAuthFlow.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oauth-flow-object
 */
interface OpenApiOAuthFlow {
  authorizationUrl: string;
  refreshUrl?: string;
  scopes: Dictionary<string>;
  tokenUrl: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiOAuthFlows.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#oauth-flows-object
 */
interface OpenApiOAuthFlows {
  authorizationCode?: OpenApiOAuthFlow;
  clientCredentials?: OpenApiOAuthFlow;
  implicit?: OpenApiOAuthFlow;
  password?: OpenApiOAuthFlow;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiSecurityScheme.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#security-scheme-object
 */
interface OpenApiSecurityScheme extends OpenApiReference {
  bearerFormat?: string;
  description?: string;
  flows?: OpenApiOAuthFlows;
  in?: 'query' | 'header' | 'cookie';
  name?: string;
  openIdConnectUrl?: string;
  scheme?: string;
  type: 'apiKey' | 'http' | 'oauth2' | 'openIdConnect';
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiComponents.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object
 */
interface OpenApiComponents {
  callbacks?: Dictionary<OpenApiCallback>;
  examples?: Dictionary<OpenApiExample>;
  headers?: Dictionary<OpenApiHeader>;
  links?: Dictionary<OpenApiLink>;
  parameters?: Dictionary<OpenApiParameter>;
  requestBodies?: Dictionary<OpenApiRequestBody>;
  responses?: Dictionary<OpenApiResponses>;
  schemas?: Dictionary<OpenApiSchema$1>;
  securitySchemes?: Dictionary<OpenApiSecurityScheme>;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiContact.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#contact-object
 */
interface OpenApiContact {
  email?: string;
  name?: string;
  url?: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiLicense.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#license-object
 */
interface OpenApiLicense {
  name: string;
  url?: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiInfo.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#info-object
 */
interface OpenApiInfo {
  contact?: OpenApiContact;
  description?: string;
  license?: OpenApiLicense;
  termsOfService?: string;
  title: string;
  version: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiPaths.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#paths-object
 */
interface OpenApiPaths {
  [path: string]: OpenApiPath;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApiTag.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#tag-object
 */
interface OpenApiTag {
  description?: string;
  externalDocs?: OpenApiExternalDocs;
  name: string;
}
//#endregion
//#region src/openApi/v3/interfaces/OpenApi.d.ts
/**
 * {@link} https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md
 */
interface OpenApi$3 {
  components?: OpenApiComponents;
  externalDocs?: OpenApiExternalDocs;
  info: OpenApiInfo;
  openapi: string;
  paths: OpenApiPaths;
  security?: OpenApiSecurityRequirement[];
  servers?: OpenApiServer[];
  tags?: OpenApiTag[];
}
//#endregion
//#region src/openApi/common/interfaces/OpenApi.d.ts
type OpenApi = OpenApi$2 | OpenApi$3;
//#endregion
//#region src/openApi/index.d.ts
/**
 * @internal
 * Parse the resolved OpenAPI specification. This will populate and return
 * `context` with intermediate representation obtained from the parsed spec.
 */
declare const parseOpenApiSpec: ({
  config,
  dependencies,
  logger,
  spec
}: {
  config: Config$1;
  dependencies: Record<string, string>;
  logger: Logger;
  spec: unknown;
}) => IR$1.Context | undefined;
//#endregion
//#region src/openApi/2.0.x/types/json-schema-draft-4.d.ts
interface JsonSchemaDraft4 extends EnumExtensions {
  /**
   * A schema can reference another schema using the `$ref` keyword. The value of `$ref` is a URI-reference that is resolved against the schema's {@link https://json-schema.org/understanding-json-schema/structuring#base-uri Base URI}. When evaluating a `$ref`, an implementation uses the resolved identifier to retrieve the referenced schema and applies that schema to the {@link https://json-schema.org/learn/glossary#instance instance}.
   *
   * The `$ref` keyword may be used to create recursive schemas that refer to themselves.
   */
  $ref?: string;
  /**
   * The `default` keyword specifies a default value. This value is not used to fill in missing values during the validation process. Non-validation tools such as documentation generators or form generators may use this value to give hints to users about how to use a value. However, `default` is typically used to express that if a value is missing, then the value is semantically the same as if the value was present with the default value. The value of `default` should validate against the schema in which it resides, but that isn't required.
   */
  default?: unknown;
  /**
   * The `title` and `description` keywords must be strings. A "title" will preferably be short, whereas a "description" will provide a more lengthy explanation about the purpose of the data described by the schema.
   */
  description?: string;
  /**
   * The `enum` {@link https://json-schema.org/learn/glossary#keyword keyword} is used to restrict a value to a fixed set of values. It must be an array with at least one element, where each element is unique.
   *
   * You can use `enum` even without a type, to accept values of different types.
   */
  enum?: ReadonlyArray<unknown>;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  exclusiveMaximum?: boolean;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  exclusiveMinimum?: boolean;
  /**
   * The `format` keyword allows for basic semantic identification of certain kinds of string values that are commonly used. For example, because JSON doesn't have a "DateTime" type, dates need to be encoded as strings. `format` allows the schema author to indicate that the string value should be interpreted as a date. By default, `format` is just an annotation and does not effect validation.
   *
   * Optionally, validator {@link https://json-schema.org/learn/glossary#implementation implementations} can provide a configuration option to enable `format` to function as an assertion rather than just an annotation. That means that validation will fail if, for example, a value with a `date` format isn't in a form that can be parsed as a date. This can allow values to be constrained beyond what the other tools in JSON Schema, including {@link https://json-schema.org/understanding-json-schema/reference/regular_expressions Regular Expressions} can do.
   *
   * There is a bias toward networking-related formats in the JSON Schema specification, most likely due to its heritage in web technologies. However, custom formats may also be used, as long as the parties exchanging the JSON documents also exchange information about the custom format types. A JSON Schema validator will ignore any format type that it does not understand.
   */
  format?: JsonSchemaFormats$1;
  /**
   * The length of the array can be specified using the `minItems` and `maxItems` keywords. The value of each keyword must be a non-negative number. These keywords work whether doing {@link https://json-schema.org/understanding-json-schema/reference/array#items list validation} or {@link https://json-schema.org/understanding-json-schema/reference/array#tupleValidation tuple-validation}.
   */
  maxItems?: number;
  /**
   * The length of a string can be constrained using the `minLength` and `maxLength` {@link https://json-schema.org/learn/glossary#keyword keywords}. For both keywords, the value must be a non-negative number.
   */
  maxLength?: number;
  /**
   * The number of properties on an object can be restricted using the `minProperties` and `maxProperties` keywords. Each of these must be a non-negative integer.
   */
  maxProperties?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  maximum?: number;
  /**
   * The length of the array can be specified using the `minItems` and `maxItems` keywords. The value of each keyword must be a non-negative number. These keywords work whether doing {@link https://json-schema.org/understanding-json-schema/reference/array#items list validation} or {@link https://json-schema.org/understanding-json-schema/reference/array#tupleValidation tuple-validation}.
   */
  minItems?: number;
  /**
   * The length of a string can be constrained using the `minLength` and `maxLength` {@link https://json-schema.org/learn/glossary#keyword keywords}. For both keywords, the value must be a non-negative number.
   */
  minLength?: number;
  /**
   * The number of properties on an object can be restricted using the `minProperties` and `maxProperties` keywords. Each of these must be a non-negative integer.
   */
  minProperties?: number;
  /**
   * Ranges of numbers are specified using a combination of the `minimum` and `maximum` keywords, (or `exclusiveMinimum` and `exclusiveMaximum` for expressing exclusive range).
   *
   * If _x_ is the value being validated, the following must hold true:
   *
   * ```
   * x ≥ minimum
   * x > exclusiveMinimum
   * x ≤ maximum
   * x < exclusiveMaximum
   * ```
   *
   * While you can specify both of `minimum` and `exclusiveMinimum` or both of `maximum` and `exclusiveMaximum`, it doesn't really make sense to do so.
   */
  minimum?: number;
  /**
   * Numbers can be restricted to a multiple of a given number, using the `multipleOf` keyword. It may be set to any positive number. The multiple can be a floating point number.
   */
  multipleOf?: number;
  /**
   * The `pattern` keyword is used to restrict a string to a particular regular expression. The regular expression syntax is the one defined in JavaScript ({@link https://www.ecma-international.org/publications-and-standards/standards/ecma-262/ ECMA 262} specifically) with Unicode support. See {@link https://json-schema.org/understanding-json-schema/reference/regular_expressions Regular Expressions} for more information.
   */
  pattern?: string;
  /**
   * By default, the properties defined by the `properties` keyword are not required. However, one can provide a list of required properties using the `required` keyword.
   *
   * The `required` keyword takes an array of zero or more strings. Each of these strings must be unique.
   */
  required?: ReadonlyArray<string>;
  /**
   * The `title` and `description` keywords must be strings. A "title" will preferably be short, whereas a "description" will provide a more lengthy explanation about the purpose of the data described by the schema.
   */
  title?: string;
  /**
   * Primitive data types in the Swagger Specification are based on the types supported by the {@link https://tools.ietf.org/html/draft-zyp-json-schema-04#section-3.5 JSON-Schema Draft 4}. Models are described using the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schema-object Schema Object} which is a subset of JSON Schema Draft 4.
   */
  type?: JsonSchemaTypes;
  /**
   * A schema can ensure that each of the items in an array is unique. Simply set the `uniqueItems` keyword to `true`.
   */
  uniqueItems?: boolean;
}
type JsonSchemaFormats$1 = 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' | (string & {});
type JsonSchemaTypes = 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string';
//#endregion
//#region src/openApi/2.0.x/types/openapi-spec-extensions.d.ts
interface OpenApiV2_0_X_Nullable_Extensions {
  /**
   * OpenAPI 2.0 does not natively support null as a type, but you can use
   * `x-nullable` to polyfill this functionality.
   */
  'x-nullable'?: boolean;
}
//#endregion
//#region src/openApi/2.0.x/types/spec.d.ts
/**
 * This is the root document object for the API specification. It combines what previously was the Resource Listing and API Declaration (version 1.2 and earlier) together into one document.
 */
interface OpenApiV2_0_X {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The base path on which the API is served, which is relative to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerHost `host`}. If it is not included, the API is served directly under the `host`. The value MUST start with a leading slash (`/`). The `basePath` does not support {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating path templating}.
   */
  basePath?: string;
  /**
   * A list of MIME types the APIs can consume. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  consumes?: ReadonlyArray<string>;
  /**
   * An object to hold data types produced and consumed by operations.
   */
  definitions?: DefinitionsObject;
  /**
   * Additional external documentation.
   */
  externalDocs?: ExternalDocumentationObject$1;
  /**
   * The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths. It MAY include a port. If the `host` is not included, the host serving the documentation is to be used (including the port). The `host` does not support {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating path templating}.
   */
  host?: string;
  /**
   * **Required**. Provides metadata about the API. The metadata can be used by the clients if needed.
   */
  info: InfoObject$2;
  /**
   * An object to hold parameters that can be used across operations. This property _does not_ define global parameters for all operations.
   */
  parameters?: ParametersDefinitionsObject;
  /**
   * **Required**. The available paths and operations for the API.
   */
  paths: PathsObject$1;
  /**
   * A list of MIME types the APIs can produce. This is global to all APIs but can be overridden on specific API calls. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  produces?: ReadonlyArray<string>;
  /**
   * An object to hold responses that can be used across operations. This property _does not_ define global responses for all operations.
   */
  responses?: ResponsesDefinitionsObject;
  /**
   * The transfer protocol of the API. Values MUST be from the list: `"http"`, `"https"`, `"ws"`, `"wss"`. If the `schemes` is not included, the default scheme to be used is the one used to access the Swagger definition itself.
   */
  schemes?: ReadonlyArray<'http' | 'https' | 'ws' | 'wss'>;
  /**
   * A declaration of which security schemes are applied for the API as a whole. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). Individual operations can override this definition.
   */
  security?: ReadonlyArray<SecurityRequirementObject$1>;
  /**
   * Security scheme definitions that can be used across the specification.
   */
  securityDefinitions?: SecurityDefinitionsObject;
  /**
   * **Required**. Specifies the Swagger Specification version being used. It can be used by the Swagger UI and other clients to interpret the API listing. The value MUST be `"2.0"`.
   */
  swagger: string;
  /**
   * A list of tags used by the specification with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operation-object Operation Object} must be declared. The tags that are not declared may be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: ReadonlyArray<TagObject$1>;
}
/**
 * Contact information for the exposed API.
 *
 * @example
 * ```yaml
 * name: API Support
 * url: http://www.swagger.io/support
 * email: support@swagger.io
 * ```
 */
interface ContactObject$1 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The email address of the contact person/organization. MUST be in the format of an email address.
   */
  email?: string;
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The URL pointing to the contact information. MUST be in the format of a URL.
   */
  url?: string;
}
/**
 * An object to hold data types that can be consumed and produced by operations. These data types can be primitives, arrays or models.
 *
 * **Definitions Object Example**
 *
 * @example
 * ```yaml
 * Category:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       format: int64
 *     name:
 *       type: string
 * Tag:
 *   type: object
 *   properties:
 *     id:
 *       type: integer
 *       format: int64
 *     name:
 *       type: string
 * ```
 */
interface DefinitionsObject {
  /**
   * A single definition, mapping a "name" to the schema it defines.
   */
  [name: string]: SchemaObject$2;
}
/**
 * Allows sharing examples for operation responses.
 *
 * **Example Object Example**
 *
 * Example response for application/json mimetype of a Pet data type:
 *
 * @example
 * ```yaml
 * application/json:
 *   name: Puma
 *   type: Dog
 *   color: Black
 *   gender: Female
 *   breed: Mixed
 * ```
 */
interface ExampleObject$1 {
  /**
   * The name of the property MUST be one of the Operation `produces` values (either implicit or inherited). The value SHOULD be an example of what such a response would look like.
   */
  [mimeType: string]: unknown;
}
/**
 * Allows referencing an external resource for extended documentation.
 *
 * @example
 * ```yaml
 * description: Find more info here
 * url: https://swagger.io
 * ```
 */
interface ExternalDocumentationObject$1 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A short description of the target documentation. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * **Required**. The URL for the target documentation. Value MUST be in the format of a URL.
   */
  url: string;
}
/**
 * **Header Object Example**
 *
 * A simple header with of an integer type:
 *
 * @example
 * ```yaml
 * description: The number of allowed requests in the current period
 * type: integer
 * ```
 */
interface HeaderObject$1 extends EnumExtensions, OpenApiV2_0_X_Nullable_Extensions {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Determines the format of the array if type array is used. Possible values are:
   *
   * - `csv` - comma separated values `foo,bar`.
   * - `ssv` - space separated values `foo bar`.
   * - `tsv` - tab separated values `foo\tbar`.
   * - `pipes` - pipe separated values `foo|bar`.
   *
   * Default value is `csv`.
   */
  collectionFormat?: 'csv' | 'pipes' | 'ssv' | 'tsv';
  /**
   * Declares the value of the item that the server will use if none is provided. (Note: "default" has no meaning for required items.) See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2}. Unlike JSON Schema this value MUST conform to the defined {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#itemsType `type`} for the data type.
   */
  default?: unknown;
  /**
   * A short description of the header.
   */
  description?: string;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1}.
   */
  enum?: ReadonlyArray<unknown>;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  exclusiveMaximum?: boolean;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  exclusiveMinimum?: boolean;
  /**
   * The extending format for the previously mentioned {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#stType `type`}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details.
   */
  format?: string;
  /**
   * **Required if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} is "array"**. Describes the type of items in the array.
   */
  items?: ItemsObject;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2}.
   */
  maxItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1}.
   */
  maxLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  maximum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3}.
   */
  minItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2}.
   */
  minLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  minimum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1}.
   */
  multipleOf?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3}.
   */
  pattern?: string;
  /**
   * Required. The type of the object. The value MUST be one of `"string"`, `"number"`, `"integer"`, `"boolean"`, or `"array"`.
   */
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string';
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4}.
   */
  uniqueItems?: boolean;
}
/**
 * Lists the headers that can be sent as part of a response.
 *
 * **Headers Object Example**
 *
 * Rate-limit headers:
 *
 * @example
 * ```yaml
 * X-Rate-Limit-Limit:
 *   description: The number of allowed requests in the current period
 *   type: integer
 * X-Rate-Limit-Remaining:
 *   description: The number of remaining requests in the current period
 *   type: integer
 * X-Rate-Limit-Reset:
 *   description: The number of seconds left in the current period
 *   type: integer
 * ```
 */
interface HeadersObject {
  /**
   * The name of the property corresponds to the name of the header. The value describes the type of the header.
   */
  [name: string]: HeaderObject$1;
}
/**
 * The object provides metadata about the API. The metadata can be used by the clients if needed, and can be presented in the Swagger-UI for convenience.
 *
 * @example
 * ```yaml
 * title: Swagger Sample App
 * description: This is a sample server Petstore server.
 * termsOfService: http://swagger.io/terms/
 * contact:
 *   name: API Support
 *   url: http://www.swagger.io/support
 *   email: support@swagger.io
 * license:
 *   name: Apache 2.0
 *   url: http://www.apache.org/licenses/LICENSE-2.0.html
 * version: 1.0.1
 * ```
 */
interface InfoObject$2 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The contact information for the exposed API.
   */
  contact?: ContactObject$1;
  /**
   * A short description of the application. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * The license information for the exposed API.
   */
  license?: LicenseObject$1;
  /**
   * The Terms of Service for the API.
   */
  termsOfService?: string;
  /**
   * **Required**. The title of the application.
   */
  title: string;
  /**
   * **Required** Provides the version of the application API (not to be confused with the specification version).
   */
  version: string;
}
/**
 * A limited subset of JSON-Schema's items object. It is used by parameter definitions that are not located {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} `"body"`.
 *
 * **Items Object Examples**
 *
 * Items must be of type string and have the minimum length of 2 characters:
 *
 * @example
 * ```yaml
 * type: string
 * minLength: 2
 * ```
 *
 * An array of arrays, the internal array being of type integer, numbers must be between 0 and 63 (inclusive):
 *
 * @example
 * ```yaml
 * type: array
 * items:
 *   type: integer
 *   minimum: 0
 *   maximum: 63
 * ```
 */
interface ItemsObject extends EnumExtensions, OpenApiV2_0_X_Nullable_Extensions {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Determines the format of the array if type array is used. Possible values are:
   *
   * - `csv` - comma separated values `foo,bar`.
   * - `ssv` - space separated values `foo bar`.
   * - `tsv` - tab separated values `foo\tbar`.
   * - `pipes` - pipe separated values `foo|bar`.
   *
   * Default value is `csv`.
   */
  collectionFormat?: 'csv' | 'pipes' | 'ssv' | 'tsv';
  /**
   * Declares the value of the item that the server will use if none is provided. (Note: "default" has no meaning for required items.) See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2}. Unlike JSON Schema this value MUST conform to the defined {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#itemsType `type`} for the data type.
   */
  default?: unknown;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1}.
   */
  enum?: ReadonlyArray<unknown>;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  exclusiveMaximum?: boolean;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  exclusiveMinimum?: boolean;
  /**
   * The extending format for the previously mentioned {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details.
   */
  format?: string;
  /**
   * **Required if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} is "array"**. Describes the type of items in the array.
   */
  items?: ItemsObject;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2}.
   */
  maxItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1}.
   */
  maxLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  maximum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3}.
   */
  minItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2}.
   */
  minLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  minimum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1}.
   */
  multipleOf?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3}.
   */
  pattern?: string;
  /**
   * **Required**. The internal type of the array. The value MUST be one of `"string"`, `"number"`, `"integer"`, `"boolean"`, or `"array"`. Files and models are not allowed.
   */
  type: 'array' | 'boolean' | 'integer' | 'number' | 'string';
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4}.
   */
  uniqueItems?: boolean;
}
/**
 * License information for the exposed API.
 *
 * @example
 * ```yaml
 * name: Apache 2.0
 * url: http://www.apache.org/licenses/LICENSE-2.0.html
 * ```
 */
interface LicenseObject$1 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * **Required**. The license name used for the API.
   */
  name: string;
  /**
   * A URL to the license used for the API. MUST be in the format of a URL.
   */
  url?: string;
}
/**
 * Describes a single API operation on a path.
 *
 * @example
 * ```yaml
 * tags:
 * - pet
 * summary: Updates a pet in the store with form data
 * description: ""
 * operationId: updatePetWithForm
 * consumes:
 * - application/x-www-form-urlencoded
 * produces:
 * - application/json
 * - application/xml
 * parameters:
 * - name: petId
 *   in: path
 *   description: ID of pet that needs to be updated
 *   required: true
 *   type: string
 * - name: name
 *   in: formData
 *   description: Updated name of the pet
 *   required: false
 *   type: string
 * - name: status
 *   in: formData
 *   description: Updated status of the pet
 *   required: false
 *   type: string
 * responses:
 *   '200':
 *     description: Pet updated.
 *   '405':
 *     description: Invalid input
 * security:
 * - petstore_auth:
 *   - write:pets
 *   - read:pets
 * ```
 */
interface OperationObject$2 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A list of MIME types the operation can consume. This overrides the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerConsumes `consumes`} definition at the Swagger Object. An empty value MAY be used to clear the global definition. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  consumes?: ReadonlyArray<string>;
  /**
   * Declares this operation to be deprecated. Usage of the declared operation should be refrained. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A verbose explanation of the operation behavior. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: ExternalDocumentationObject$1;
  /**
   * Unique string used to identify the operation. The id MUST be unique among all operations described in the API. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is recommended to follow common programming naming conventions.
   */
  operationId?: string;
  /**
   * A list of parameters that are applicable for this operation. If a parameter is already defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathItemParameters Path Item}, the new definition will override it, but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerParameters Swagger Object's parameters}. There can be one "body" parameter at most.
   */
  parameters?: ReadonlyArray<ParameterObject$2 | ReferenceObject$3>;
  /**
   * A list of MIME types the operation can produce. This overrides the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerProduces `produces`} definition at the Swagger Object. An empty value MAY be used to clear the global definition. Value MUST be as described under {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#mime-types Mime Types}.
   */
  produces?: ReadonlyArray<string>;
  /**
   * **Required**. The list of possible responses as they are returned from executing this operation.
   */
  responses: ResponsesObject$1;
  /**
   * The transfer protocol for the operation. Values MUST be from the list: `"http"`, `"https"`, `"ws"`, `"wss"`. The value overrides the Swagger Object {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerSchemes `schemes`} definition.
   */
  schemes?: ReadonlyArray<'http' | 'https' | 'ws' | 'wss'>;
  /**
   * A declaration of which security schemes are applied for this operation. The list of values describes alternative security schemes that can be used (that is, there is a logical OR between the security requirements). This definition overrides any declared top-level {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerSecurity `security`}. To remove a top-level security declaration, an empty array can be used.
   */
  security?: ReadonlyArray<SecurityRequirementObject$1>;
  /**
   * A short summary of what the operation does. For maximum readability in the swagger-ui, this field SHOULD be less than 120 characters.
   */
  summary?: string;
  /**
   * A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
   */
  tags?: ReadonlyArray<string>;
}
/**
 * Describes a single operation parameter.
 *
 * A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn location}.
 *
 * There are five possible parameter types.
 *
 * - Path - Used together with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating Path Templating}, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is `itemId`.
 * - Query - Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is `id`.
 * - Header - Custom headers that are expected as part of the request.
 * - Body - The payload that's appended to the HTTP request. Since there can only be one payload, there can only be _one_ body parameter. The name of the body parameter has no effect on the parameter itself and is used for documentation purposes only. Since Form parameters are also in the payload, body and form parameters cannot exist together for the same operation.
 * - Form - Used to describe the payload of an HTTP request when either `application/x-www-form-urlencoded`, `multipart/form-data` or both are used as the content type of the request (in Swagger's definition, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operationConsumes `consumes`} property of an operation). This is the only parameter type that can be used to send files, thus supporting the `file` type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult {@link http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4 http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4}):
 *   - `application/x-www-form-urlencoded` - Similar to the format of Query parameters but as a payload. For example, `foo=1&bar=swagger` - both `foo` and `bar` are form parameters. This is normally used for simple parameters that are being transferred.
 *   - `multipart/form-data` - each parameter takes a section in the payload with an internal header. For example, for the header `Content-Disposition: form-data; name="submit-name"` the name of the parameter is `submit-name`. This type of form parameters is more commonly used for file transfers.
 *
 * **Parameter Object Examples**
 *
 * Body Parameters
 *
 * A body parameter with a referenced schema definition (normally for a model definition):
 *
 * @example
 * ```yaml
 * name: user
 * in: body
 * description: user to add to the system
 * required: true
 * schema:
 *   $ref: '#/definitions/User'
 * ```
 *
 * A body parameter that is an array of string values:
 *
 * @example
 * ```yaml
 * name: user
 * in: body
 * description: user to add to the system
 * required: true
 * schema:
 *   type: array
 *   items:
 *     type: string
 * ```
 *
 * Other Parameters
 *
 * A header parameter with an array of 64 bit integer numbers:
 *
 * @example
 * ```yaml
 * name: token
 * in: header
 * description: token to be passed as a header
 * required: true
 * type: array
 * items:
 *   type: integer
 *   format: int64
 * collectionFormat: csv
 * ```
 *
 * A path parameter of a string value:
 *
 * @example
 * ```yaml
 * name: username
 * in: path
 * description: username to fetch
 * required: true
 * type: string
 * ```
 *
 * An optional query parameter of a string value, allowing multiple values by repeating the query parameter:
 *
 * @example
 * ```yaml
 * name: id
 * in: query
 * description: ID of the object to fetch
 * required: false
 * type: array
 * items:
 *   type: string
 * collectionFormat: multi
 * ```
 *
 * A form data with file type for a file upload:
 *
 * @example
 * ```yaml
 * name: avatar
 * in: formData
 * description: The avatar of the user
 * required: true
 * type: file
 * ```
 */
type ParameterObject$2 = EnumExtensions & OpenApiV2_0_X_Nullable_Extensions & {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A brief description of the parameter. This could contain examples of use. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * **Required**. The name of the parameter. Parameter names are _case sensitive_.
   *
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} is `"path"`, the `name` field MUST correspond to the associated path segment from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#pathsPath path} field in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#paths-object Paths Object}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating Path Templating} for further information.
   * - For all other cases, the `name` corresponds to the parameter name used based on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} property.
   */
  name: string;
  /**
   * Determines whether this parameter is mandatory. If the parameter is {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} "path", this property is **required** and its value MUST be `true`. Otherwise, the property MAY be included and its default value is `false`.
   */
  required?: boolean;
} & ({
  /**
   * **Required**. The location of the parameter. Possible values are "query", "header", "path", "formData" or "body".
   */
  in: 'body';
  /**
   * **Required**. The schema defining the type used for the body parameter.
   */
  schema: SchemaObject$2;
} | {
  /**
   * Sets the ability to pass empty-valued parameters. This is valid only for either `query` or `formData` parameters and allows you to send a parameter with a name only or an empty value. Default value is `false`.
   */
  allowEmptyValue?: boolean;
  /**
   * Determines the format of the array if type array is used. Possible values are:
   *
   * - `csv` - comma separated values `foo,bar`.
   * - `ssv` - space separated values `foo bar`.
   * - `tsv` - tab separated values `foo\tbar`.
   * - `pipes` - pipe separated values `foo|bar`.
   * - `multi` - corresponds to multiple parameter instances instead of multiple values for a single instance `foo=bar&foo=baz`. This is valid only for parameters {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} "query" or "formData".
   *
   * Default value is `csv`.
   */
  collectionFormat?: 'csv' | 'multi' | 'pipes' | 'ssv' | 'tsv';
  /**
   * Declares the value of the parameter that the server will use if none is provided, for example a "count" to control the number of results per page might default to 100 if not supplied by the client in the request. (Note: "default" has no meaning for required parameters.) See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-6.2}. Unlike JSON Schema this value MUST conform to the defined {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} for this parameter.
   */
  default?: unknown;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.5.1}.
   */
  enum?: ReadonlyArray<unknown>;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  exclusiveMaximum?: boolean;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  exclusiveMinimum?: boolean;
  /**
   * The extending format for the previously mentioned {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details.
   */
  format?: string;
  /**
   * **Required**. The location of the parameter. Possible values are "query", "header", "path", "formData" or "body".
   */
  in: 'formData' | 'header' | 'path' | 'query';
  /**
   * **Required if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterType `type`} is "array"**. Describes the type of items in the array.
   */
  items?: ItemsObject;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.2}.
   */
  maxItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.1}.
   */
  maxLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.2}.
   */
  maximum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.3}.
   */
  minItems?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.2}.
   */
  minLength?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.3}.
   */
  minimum?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.1.1}.
   */
  multipleOf?: number;
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.2.3}.
   */
  pattern?: string;
  /**
   * **Required**. The type of the parameter. Since the parameter is not located at the request body, it is limited to simple types (that is, not an object). The value MUST be one of `"string"`, `"number"`, `"integer"`, `"boolean"`, `"array"` or `"file"`. If `type` is `"file"`, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operationConsumes `consumes`} MUST be either `"multipart/form-data"`, `"application/x-www-form-urlencoded"` or both and the parameter MUST be {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn `in`} `"formData"`.
   */
  type: 'array' | 'boolean' | 'file' | 'integer' | 'number' | 'string';
  /**
   * See {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4 https://tools.ietf.org/html/draft-fge-json-schema-validation-00#section-5.3.4}.
   */
  uniqueItems?: boolean;
});
/**
 * An object to hold parameters to be reused across operations. Parameter definitions can be referenced to the ones defined here.
 *
 * This does _not_ define global operation parameters.
 *
 * **Parameters Definition Object Example**
 *
 * @example
 * ```yaml
 * skipParam:
 *   name: skip
 *   in: query
 *   description: number of items to skip
 *   required: true
 *   type: integer
 *   format: int32
 * limitParam:
 *   name: limit
 *   in: query
 *   description: max records to return
 *   required: true
 *   type: integer
 *   format: int32
 * ```
 */
interface ParametersDefinitionsObject {
  /**
   * A single parameter definition, mapping a "name" to the parameter it defines.
   */
  [name: string]: ParameterObject$2;
}
/**
 * Describes the operations available on a single path. A Path Item may be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-filtering ACL constraints}. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 *
 * @example
 * ```yaml
 * get:
 *   description: Returns pets based on ID
 *   summary: Find pets by ID
 *   operationId: getPetsById
 *   produces:
 *   - application/json
 *   - text/html
 *   responses:
 *     '200':
 *       description: pet response
 *       schema:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Pet'
 *     default:
 *       description: error payload
 *       schema:
 *         $ref: '#/definitions/ErrorModel'
 * parameters:
 * - name: id
 *   in: path
 *   description: ID of pet to use
 *   required: true
 *   type: array
 *   items:
 *     type: string
 *   collectionFormat: csv
 * ```
 */
interface PathItemObject$1 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Allows for an external definition of this path item. The referenced structure MUST be in the format of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-item-object Path Item Object}. If there are conflicts between the referenced definition and this Path Item's definition, the behavior is _undefined_.
   */
  $ref?: string;
  /**
   * A definition of a DELETE operation on this path.
   */
  delete?: OperationObject$2;
  /**
   * A definition of a GET operation on this path.
   */
  get?: OperationObject$2;
  /**
   * A definition of a HEAD operation on this path.
   */
  head?: OperationObject$2;
  /**
   * A definition of a OPTIONS operation on this path.
   */
  options?: OperationObject$2;
  /**
   * A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterName name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#parameterIn location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} to link to parameters that are defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerParameters Swagger Object's parameters}. There can be one "body" parameter at most.
   */
  parameters?: ReadonlyArray<ParameterObject$2 | ReferenceObject$3>;
  /**
   * A definition of a PATCH operation on this path.
   */
  patch?: OperationObject$2;
  /**
   * A definition of a POST operation on this path.
   */
  post?: OperationObject$2;
  /**
   * A definition of a PUT operation on this path.
   */
  put?: OperationObject$2;
}
/**
 * Holds the relative paths to the individual endpoints. The path is appended to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerBasePath `basePath`} in order to construct the full URL. The Paths may be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-filtering ACL constraints}.
 *
 * @example
 * ```yaml
 * /pets:
 *   get:
 *     description: Returns all pets from the system that the user has access to
 *     produces:
 *     - application/json
 *     responses:
 *       '200':
 *         description: A list of pets.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/pet'
 * ```
 */
interface PathsObject$1 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A relative path to an individual endpoint. The field name MUST begin with a slash. The path is appended to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerBasePath `basePath`} in order to construct the full URL. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#path-templating Path templating} is allowed.
   */
  [path: `/${string}`]: PathItemObject$1;
}
/**
 * A simple object to allow referencing other definitions in the specification. It can be used to reference parameters and responses that are defined at the top level for reuse.
 *
 * The Reference Object is a {@link http://tools.ietf.org/html/draft-pbryan-zyp-json-ref-02 JSON Reference} that uses a {@link http://tools.ietf.org/html/rfc6901 JSON Pointer} as its value. For this specification, only {@link https://tools.ietf.org/html/draft-zyp-json-schema-04#section-7.2.3 canonical dereferencing} is supported.
 *
 * **Reference Object Example**
 *
 * @example
 * ```yaml
 * $ref: '#/definitions/Pet'
 * ```
 *
 * **Relative Schema File Example**
 *
 * @example
 * ```yaml
 * $ref: 'Pet.yaml'
 * ```
 *
 * **Relative Files With Embedded Schema Example**
 *
 * @example
 * ```yaml
 * $ref: 'definitions.yaml#/Pet'
 * ```
 */
interface ReferenceObject$3 {
  /**
   * **Required**. The reference string.
   */
  $ref: string;
}
/**
 * Describes a single response from an API Operation.
 *
 * **Response Object Examples**
 *
 * Response of an array of a complex type:
 *
 * @example
 * ```yaml
 * description: A complex object array response
 * schema:
 *   type: array
 *   items:
 *     $ref: '#/definitions/VeryComplexType'
 * ```
 *
 * Response with a string type:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * schema:
 *   type: string
 * ```
 *
 * Response with headers:
 *
 * @example
 * ```yaml
 * description: A simple string response
 * schema:
 *   type: string
 * headers:
 *   X-Rate-Limit-Limit:
 *     description: The number of allowed requests in the current period
 *     type: integer
 *   X-Rate-Limit-Remaining:
 *     description: The number of remaining requests in the current period
 *     type: integer
 *   X-Rate-Limit-Reset:
 *     description: The number of seconds left in the current period
 *     type: integer
 * ```
 *
 * Response with no return value:
 *
 * @example
 * ```yaml
 * description: object created
 * ```
 */
interface ResponseObject$2 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * **Required**. A short description of the response. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description: string;
  /**
   * An example of the response message.
   */
  examples?: ExampleObject$1;
  /**
   * A list of headers that are sent with the response.
   */
  headers?: HeadersObject;
  /**
   * A definition of the response structure. It can be a primitive, an array or an object. If this field does not exist, it means no content is returned as part of the response. As an extension to the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schema-object Schema Object}, its root `type` value may also be `"file"`. This SHOULD be accompanied by a relevant `produces` mime-type.
   */
  schema?: SchemaObject$2;
}
/**
 * An object to hold responses to be reused across operations. Response definitions can be referenced to the ones defined here.
 *
 * This does _not_ define global operation responses.
 *
 * **Responses Definitions Object Example**
 *
 * @example
 * ```yaml
 * NotFound:
 *   description: Entity not found.
 * IllegalInput:
 *   description: Illegal input for operation.
 * GeneralError:
 *   description: General Error
 *   schema:
 *     $ref: '#/definitions/GeneralError'
 * ```
 */
interface ResponsesDefinitionsObject {
  /**
   * A single response definition, mapping a "name" to the response it defines.
   */
  [name: string]: ResponseObject$2;
}
/**
 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response. It is not expected from the documentation to necessarily cover all possible HTTP response codes, since they may not be known in advance. However, it is expected from the documentation to cover a successful operation response and any known errors.
 *
 * The `default` can be used as the default response object for all HTTP codes that are not covered individually by the specification.
 *
 * The `Responses Object` MUST contain at least one response code, and it SHOULD be the response for a successful operation call.
 *
 * **Responses Object Example**
 *
 * A 200 response for successful operation and a default response for others (implying an error):
 *
 * @example
 * ```yaml
 * '200':
 *   description: a pet to be returned
 *   schema:
 *     $ref: '#/definitions/Pet'
 * default:
 *   description: Unexpected error
 *   schema:
 *     $ref: '#/definitions/ErrorModel'
 * ```
 */
interface ResponsesObject$1 {
  /**
   * Any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#http-status-codes HTTP status code} can be used as the property name (one property per HTTP status code). Describes the expected response for that HTTP status code. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} can be used to link to a response that is defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerResponses Swagger Object's responses} section.
   */
  [httpStatusCode: string]: ResponseObject$2 | ReferenceObject$3 | undefined;
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: any;
  /**
   * The documentation of responses other than the ones declared for specific HTTP response codes. It can be used to cover undeclared responses. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#reference-object Reference Object} can be used to link to a response that is defined at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#swaggerResponses Swagger Object's responses} section.
   */
  default?: ResponseObject$2 | ReferenceObject$3;
}
/**
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is based on the {@link http://json-schema.org/ JSON Schema Specification Draft 4} and uses a predefined subset of it. On top of this subset, there are extensions provided by this specification to allow for more complete documentation.
 *
 * Further information about the properties can be found in {@link https://tools.ietf.org/html/draft-zyp-json-schema-04 JSON Schema Core} and {@link https://tools.ietf.org/html/draft-fge-json-schema-validation-00 JSON Schema Validation}. Unless stated otherwise, the property definitions follow the JSON Schema specification as referenced here.
 *
 * The following properties are taken directly from the JSON Schema definition and follow the same specifications:
 *
 * - $ref - As a {@link https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03 JSON Reference}
 * - format (See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#dataTypeFormat Data Type Formats} for further details)
 * - title
 * - description ({@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation)
 * - default (Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object)
 * - multipleOf
 * - maximum
 * - exclusiveMaximum
 * - minimum
 * - exclusiveMinimum
 * - maxLength
 * - minLength
 * - pattern
 * - maxItems
 * - minItems
 * - uniqueItems
 * - maxProperties
 * - minProperties
 * - required
 * - enum
 * - type
 *
 * The following properties are taken from the JSON Schema definition but their definitions were adjusted to the Swagger Specification. Their definition is the same as the one from JSON Schema, only where the original definition references the JSON Schema definition, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schema-object Schema Object} definition is used instead.
 *
 * - items
 * - allOf
 * - properties
 * - additionalProperties
 *
 * Other than the JSON Schema subset fields, the following fields may be used for further schema documentation.
 *
 * **Composition and Inheritance (Polymorphism)**
 *
 * Swagger allows combining and extending model definitions using the `allOf` property of JSON Schema, in effect offering model composition. `allOf` takes in an array of object definitions that are validated _independently_ but together compose a single object.
 *
 * While composition offers model extensibility, it does not imply a hierarchy between the models. To support polymorphism, Swagger adds the support of the `discriminator` field. When used, the `discriminator` will be the name of the property used to decide which schema definition is used to validate the structure of the model. As such, the `discriminator` field MUST be a required field. The value of the chosen property has to be the friendly name given to the model under the `definitions` property. As such, inline schema definitions, which do not have a given id, _cannot_ be used in polymorphism.
 *
 * **XML Modeling**
 *
 * The {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#schemaXml xml} property allows extra definitions when translating the JSON definition to XML. The {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#xml-object XML Object} contains additional information about the available options.
 *
 * **Schema Object Examples**
 *
 * Primitive Sample
 *
 * Unlike previous versions of Swagger, Schema definitions can be used to describe primitive and arrays as well.
 *
 * @example
 * ```yaml
 * type: string
 * format: email
 * ```
 *
 * Simple Model
 *
 * @example
 * ```yaml
 * type: object
 * required:
 * - name
 * properties:
 *   name:
 *     type: string
 *   address:
 *     $ref: '#/definitions/Address'
 *   age:
 *     type: integer
 *     format: int32
 *     minimum: 0
 * ```
 *
 * Model with Map/Dictionary Properties
 *
 * For a simple string to string mapping:
 *
 * @example
 * ```yaml
 * type: object
 * additionalProperties:
 *   type: string
 * ```
 *
 * For a string to model mapping:
 *
 * @example
 * ```yaml
 * type: object
 * additionalProperties:
 *   $ref: '#/definitions/ComplexModel'
 * ```
 *
 * Model with Example
 *
 * @example
 * ```yaml
 * type: object
 * properties:
 *   id:
 *     type: integer
 *     format: int64
 *   name:
 *     type: string
 * required:
 * - name
 * example:
 *   name: Puma
 *   id: 1
 * ```
 *
 * Models with Composition
 *
 * @example
 * ```yaml
 * definitions:
 *   ErrorModel:
 *     type: object
 *     required:
 *     - message
 *     - code
 *     properties:
 *       message:
 *         type: string
 *       code:
 *         type: integer
 *         minimum: 100
 *         maximum: 600
 *   ExtendedErrorModel:
 *     allOf:
 *     - $ref: '#/definitions/ErrorModel'
 *     - type: object
 *       required:
 *       - rootCause
 *       properties:
 *         rootCause:
 *           type: string
 * ```
 *
 * Models with Polymorphism Support
 *
 * @example
 * ```yaml
 * definitions:
 *   Pet:
 *     type: object
 *     discriminator: petType
 *     properties:
 *       name:
 *         type: string
 *       petType:
 *         type: string
 *     required:
 *     - name
 *     - petType
 *   Cat:
 *     description: A representation of a cat
 *     allOf:
 *     - $ref: '#/definitions/Pet'
 *     - type: object
 *       properties:
 *         huntingSkill:
 *           type: string
 *           description: The measured skill for hunting
 *           default: lazy
 *           enum:
 *           - clueless
 *           - lazy
 *           - adventurous
 *           - aggressive
 *       required:
 *       - huntingSkill
 *   Dog:
 *     description: A representation of a dog
 *     allOf:
 *     - $ref: '#/definitions/Pet'
 *     - type: object
 *       properties:
 *         packSize:
 *           type: integer
 *           format: int32
 *           description: the size of the pack the dog is from
 *           default: 0
 *           minimum: 0
 *       required:
 *       - packSize
 * ```
 */
interface SchemaObject$2 extends JsonSchemaDraft4, OpenApiV2_0_X_Nullable_Extensions {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * The `additionalProperties` keyword is used to control the handling of extra stuff, that is, properties whose names are not listed in the `properties` keyword or match any of the regular expressions in the `patternProperties` keyword. By default any additional properties are allowed.
   *
   * The value of the `additionalProperties` keyword is a schema that will be used to validate any properties in the {@link https://json-schema.org/learn/glossary#instance instance} that are not matched by `properties` or `patternProperties`. Setting the `additionalProperties` schema to `false` means no additional properties will be allowed.
   *
   * It's important to note that `additionalProperties` only recognizes properties declared in the same {@link https://json-schema.org/learn/glossary#subschema subschema} as itself. So, `additionalProperties` can restrict you from "extending" a schema using {@link https://json-schema.org/understanding-json-schema/reference/combining combining} keywords such as {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf}.
   */
  additionalProperties?: SchemaObject$2 | boolean;
  /**
   * `allOf`: (AND) Must be valid against _all_ of the {@link https://json-schema.org/learn/glossary#subschema subschemas}
   *
   * To validate against `allOf`, the given data must be valid against all of the given subschemas.
   *
   * {@link https://json-schema.org/understanding-json-schema/reference/combining#allof allOf} can not be used to "extend" a schema to add more details to it in the sense of object-oriented inheritance. {@link https://json-schema.org/learn/glossary#instance Instances} must independently be valid against "all of" the schemas in the `allOf`. See the section on {@link https://json-schema.org/understanding-json-schema/reference/object#extending Extending Closed Schemas} for more information.
   */
  allOf?: ReadonlyArray<SchemaObject$2>;
  /**
   * Adds support for polymorphism. The discriminator is the schema property name that is used to differentiate between other schema that inherit this schema. The property name used MUST be defined at this schema and it MUST be in the `required` property list. When used, the value MUST be the name of this schema or any schema that inherits it.
   */
  discriminator?: string;
  /**
   * A free-form property to include an example of an instance for this schema.
   */
  example?: unknown;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: ExternalDocumentationObject$1;
  /**
   * List validation is useful for arrays of arbitrary length where each item matches the same schema. For this kind of array, set the `items` {@link https://json-schema.org/learn/glossary#keyword keyword} to a single schema that will be used to validate all of the items in the array.
   *
   * The `items` keyword can be used to control whether it's valid to have additional items in a tuple beyond what is defined in `prefixItems`. The value of the `items` keyword is a schema that all additional items must pass in order for the keyword to validate.
   *
   * Note that `items` doesn't "see inside" any {@link https://json-schema.org/learn/glossary#instance instances} of `allOf`, `anyOf`, or `oneOf` in the same {@link https://json-schema.org/learn/glossary#subschema subschema}.
   */
  items?: SchemaObject$2;
  /**
   * The properties (key-value pairs) on an object are defined using the `properties` {@link https://json-schema.org/learn/glossary#keyword keyword}. The value of `properties` is an object, where each key is the name of a property and each value is a {@link https://json-schema.org/learn/glossary#schema schema} used to validate that property. Any property that doesn't match any of the property names in the `properties` keyword is ignored by this keyword.
   */
  properties?: Record<string, SchemaObject$2>;
  /**
   * Relevant only for Schema `"properties"` definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but MUST NOT be sent as part of the request. Properties marked as `readOnly` being `true` SHOULD NOT be in the `required` list of the defined schema. Default value is `false`.
   */
  readOnly?: boolean;
  /**
   * This MAY be used only on properties schemas. It has no effect on root schemas. Adds Additional metadata to describe the XML representation format of this property.
   */
  xml?: XMLObject$1;
}
/**
 * Lists the available scopes for an OAuth2 security scheme.
 *
 * **Scopes Object Example**
 *
 * @example
 * ```yaml
 * write:pets: modify pets in your account
 * read:pets: read your pets
 * ```
 */
interface ScopesObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: any;
  /**
   * Maps between a name of a scope to a short description of it (as the value of the property).
   */
  [name: string]: string;
}
/**
 * A declaration of the security schemes available to be used in the specification. This does not enforce the security schemes on the operations and only serves to provide the relevant details for each scheme.
 *
 * **Security Definitions Object Example**
 *
 * @example
 * ```yaml
 * api_key:
 *   type: apiKey
 *   name: api_key
 *   in: header
 * petstore_auth:
 *   type: oauth2
 *   authorizationUrl: http://swagger.io/api/oauth/dialog
 *   flow: implicit
 *   scopes:
 *     write:pets: modify pets in your account
 *     read:pets: read your pets
 * ```
 */
interface SecurityDefinitionsObject {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: any;
  /**
   * A single security scheme definition, mapping a "name" to the scheme it defines.
   */
  [name: string]: SecuritySchemeObject$2;
}
/**
 * Lists the required security schemes to execute this operation. The object can have multiple security schemes declared in it which are all required (that is, there is a logical AND between the schemes).
 *
 * The name used for each property MUST correspond to a security scheme declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#security-definitions-object Security Definitions}.
 *
 * **Security Requirement Object Examples**
 *
 * Non-OAuth2 Security Requirement
 *
 * @example
 * ```yaml
 * api_key: []
 * ```
 *
 * OAuth2 Security Requirement
 *
 * @example
 * ```yaml
 * petstore_auth:
 * - write:pets
 * - read:pets
 * ```
 */
interface SecurityRequirementObject$1 {
  /**
   * Each name must correspond to a security scheme which is declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#securityDefinitions Security Definitions}. If the security scheme is of type `"oauth2"`, then the value is a list of scope names required for the execution. For other security scheme types, the array MUST be empty.
   */
  [name: string]: ReadonlyArray<string>;
}
/**
 * Allows the definition of a security scheme that can be used by the operations. Supported schemes are basic authentication, an API key (either as a header or as a query parameter) and OAuth2's common flows (implicit, password, application and access code).
 *
 * **Security Scheme Object Example**
 *
 * Basic Authentication Sample
 *
 * @example
 * ```yaml
 * type: basic
 * ```
 *
 * API Key Sample
 *
 * @example
 * ```yaml
 * type: apiKey
 * name: api_key
 * in: header
 * ```
 *
 * Implicit OAuth2 Sample
 *
 * @example
 * ```yaml
 * type: oauth2
 * authorizationUrl: http://swagger.io/api/oauth/dialog
 * flow: implicit
 * scopes:
 *   write:pets: modify pets in your account
 *   read:pets: read your pets
 * ```
 */
type SecuritySchemeObject$2 = {
  /**
   * A short description for security scheme.
   */
  description?: string;
} & ({
  /**
   * **Required** The location of the API key. Valid values are `"query"` or `"header"`.
   */
  in: 'header' | 'query';
  /**
   * **Required**. The name of the header or query parameter to be used.
   */
  name: string;
  /**
   * **Required**. The type of the security scheme. Valid values are `"basic"`, `"apiKey"` or `"oauth2"`.
   */
  type: 'apiKey';
} | {
  /**
   * **Required (`"implicit"`, `"accessCode"`)**. The authorization URL to be used for this flow. This SHOULD be in the form of a URL.
   */
  authorizationUrl?: string;
  /**
   * **Required**. The flow used by the OAuth2 security scheme. Valid values are `"implicit"`, `"password"`, `"application"` or `"accessCode"`.
   */
  flow: 'accessCode' | 'application' | 'implicit' | 'password';
  /**
   * **Required**. The available scopes for the OAuth2 security scheme.
   */
  scopes: ScopesObject;
  /**
   * **Required (`"password"`, `"application"`, `"accessCode"`)**. The token URL to be used for this flow. This SHOULD be in the form of a URL.
   */
  tokenUrl?: string;
  /**
   * **Required**. The type of the security scheme. Valid values are `"basic"`, `"apiKey"` or `"oauth2"`.
   */
  type: 'oauth2';
} | {
  /**
   * **Required**. The type of the security scheme. Valid values are `"basic"`, `"apiKey"` or `"oauth2"`.
   */
  type: 'basic';
});
/**
 * Allows adding meta data to a single tag that is used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#operation-object Operation Object}. It is not mandatory to have a Tag Object per tag used there.
 *
 * **Tag Object Example**
 *
 * @example
 * ```yaml
 * name: pet
 * description: Pets operations
 * ```
 */
interface TagObject$1 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * A short description for the tag. {@link https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown GFM syntax} can be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this tag.
   */
  externalDocs?: ExternalDocumentationObject$1;
  /**
   * **Required**. The name of the tag.
   */
  name: string;
}
/**
 * A metadata object that allows for more fine-tuned XML model definitions.
 *
 * When using arrays, XML element names are _not_ inferred (for singular/plural forms) and the `name` property should be used to add that information. See examples for expected behavior.
 */
interface XMLObject$1 {
  /**
   * Allows extensions to the Swagger Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. The value can be `null`, a primitive, an array or an object. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#specification-extensions Vendor Extensions} for further details.
   */
  [name: `x-${string}`]: unknown;
  /**
   * Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
   */
  attribute?: boolean;
  /**
   * Replaces the name of the element/attribute used for the described schema property. When defined within the Items Object (`items`), it will affect the name of the individual XML elements within the list. When defined alongside `type` being `array` (outside the `items`), it will affect the wrapping element and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
   */
  name?: string;
  /**
   * The URL of the namespace definition. Value SHOULD be in the form of a URL.
   */
  namespace?: string;
  /**
   * The prefix to be used for the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/2.0.md#xmlName name}.
   */
  prefix?: string;
  /**
   * MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `array` (outside the `items`).
   */
  wrapped?: boolean;
}
//#endregion
//#region src/openApi/2.0.x/index.d.ts
interface OpenApiV2_0_XTypes {
  InfoObject: InfoObject$2;
  OperationObject: OperationObject$2;
  SchemaObject: SchemaObject$2;
}
//#endregion
//#region src/openApi/3.0.x/types/spec.d.ts
/**
 * This is the root object of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#openapi-description OpenAPI Description}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 */
interface OpenApiV3_0_X {
  /**
   * An element to hold various Objects for the OpenAPI Description.
   */
  components?: ComponentsObject;
  /**
   * Additional external documentation.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * **REQUIRED**. Provides metadata about the API. The metadata MAY be used by tooling as required.
   */
  info: InfoObject$1;
  /**
   * **REQUIRED**. This string MUST be the {@link https://semver.org/spec/v2.0.0.html semantic version number} of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#versions OpenAPI Specification version} that the OpenAPI document uses. The `openapi` field SHOULD be used by tooling specifications and clients to interpret the OpenAPI document. This is _not_ related to the API {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#infoVersion `info.version`} string.
   */
  openapi: '3.0.0' | '3.0.1' | '3.0.2' | '3.0.3' | '3.0.4';
  /**
   * **REQUIRED**. The available paths and operations for the API.
   */
  paths: PathsObject;
  /**
   * A declaration of which security mechanisms can be used across the API. The list of values includes alternative Security Requirement Objects that can be used. Only one of the Security Requirement Objects need to be satisfied to authorize a request. Individual operations can override this definition. The list can be incomplete, up to being empty or absent. To make security explicitly optional, an empty security requirement (`{}`) can be included in the array.
   */
  security?: ReadonlyArray<SecurityRequirementObject>;
  /**
   * An array of Server Objects, which provide connectivity information to a target server. If the `servers` field is not provided, or is an empty array, the default value would be a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-object Server Object} with a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-url url} value of `/`.
   */
  servers?: ReadonlyArray<ServerObject$1>;
  /**
   * A list of tags used by the OpenAPI Description with additional metadata. The order of the tags can be used to reflect on their order by the parsing tools. Not all tags that are used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object} must be declared. The tags that are not declared MAY be organized randomly or based on the tools' logic. Each tag name in the list MUST be unique.
   */
  tags?: ReadonlyArray<TagObject>;
}
/**
 * A map of possible out-of band callbacks related to the parent operation. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-object Path Item Object} that describes a set of requests that may be initiated by the API provider and the expected responses. The key value used to identify the Path Item Object is an expression, evaluated at runtime, that identifies a URL to use for the callback operation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface CallbackObject {
  /**
   * A Path Item Object used to define a callback request and expected responses. A {@link https://learn.openapis.org/examples/v3.0/callback-example.html complete example} is available.
   */
  [expression: string]: PathItemObject | ReferenceObject$2;
}
/**
 * Holds a set of reusable objects for different aspects of the OAS. All objects defined within the Components Object will have no effect on the API unless they are explicitly referenced from outside the Components Object.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * All the fixed fields declared above are objects that MUST use keys that match the regular expression: `^[a-zA-Z0-9\.\-_]+$`.
 *
 * TODO: examples
 */
interface ComponentsObject {
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#callback-object Callback Objects}.
   */
  callbacks?: Record<string, CallbackObject | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#example-object Example Objects}.
   */
  examples?: Record<string, ExampleObject | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#header-object Header Objects}.
   */
  headers?: Record<string, HeaderObject | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#link-object Link Objects}.
   */
  linkes?: Record<string, LinkObject | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-object Parameter Objects}.
   */
  parameters?: Record<string, ParameterObject$1 | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#request-body-object Request Body Objects}.
   */
  requestBodies?: Record<string, RequestBodyObject$1 | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#response-object Response Objects}.
   */
  responses?: Record<string, ResponseObject$1 | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Objects}.
   */
  schemas?: Record<string, SchemaObject$1 | ReferenceObject$2>;
  /**
   * An object to hold reusable {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-scheme-object Security Scheme Objects}.
   */
  securitySchemes?: Record<string, SecuritySchemeObject$1 | ReferenceObject$2>;
}
/**
 * Contact information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * ```yaml
 * name: API Support
 * url: https://www.example.com/support
 * email: support@example.com
 * ```
 */
interface ContactObject {
  /**
   * The email address of the contact person/organization. This MUST be in the form of an email address.
   */
  email?: string;
  /**
   * The identifying name of the contact person/organization.
   */
  name?: string;
  /**
   * The URL for the contact information. This MUST be in the form of a URL.
   */
  url?: string;
}
/**
 * When request bodies or response payloads may be one of a number of different schemas, a Discriminator Object gives a hint about the expected schema of the document. This hint can be used to aid in serialization, deserialization, and validation. The Discriminator Object does this by implicitly or explicitly associating the possible values of a named property with alternative schemas.
 *
 * Note that `discriminator` MUST NOT change the validation outcome of the schema.
 *
 * **Conditions for Using the Discriminator Object**
 *
 * TODO: content, examples
 */
interface DiscriminatorObject {
  /**
   * An object to hold mappings between payload values and schema names or URI references.
   */
  mapping?: Record<string, string>;
  /**
   * **REQUIRED**. The name of the property in the payload that will hold the discriminating value. This property SHOULD be required in the payload schema, as the behavior when the property is absent is undefined.
   */
  propertyName: string;
}
/**
 * A single encoding definition applied to a single schema property. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-b-data-type-conversion Appendix B} for a discussion of converting values of various types to string representations.
 *
 * Properties are correlated with `multipart` parts using the {@link https://www.rfc-editor.org/rfc/rfc7578#section-4.2 `name` parameter} of `Content-Disposition: form-data`, and with `application/x-www-form-urlencoded` using the query string parameter names. In both cases, their order is implementation-defined.
 *
 * See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types Appendix E} for a detailed examination of percent-encoding concerns for form media types.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: default values examples
 * TODO: examples
 */
interface EncodingObject {
  /**
   * When this is true, parameter values are serialized using reserved expansion, as defined by {@link https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.3 RFC6570}, which allows {@link https://datatracker.ietf.org/doc/html/rfc3986#section-2.2 RFC3986's reserved character set}, as well as percent-encoded triples, to pass through unchanged, while still percent-encoding all other disallowed characters (including `%` outside of percent-encoded triples). Applications are still responsible for percent-encoding reserved characters that are {@link https://datatracker.ietf.org/doc/html/rfc3986#section-3.4 not allowed in the query string} (`[`, `]`, `#`), or have a special meaning in `application/x-www-form-urlencoded` (`-`, `&`, `+`); see Appendices {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-c-using-rfc6570-based-serialization C} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types E} for details. The default value is `false`. This field SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
   */
  allowReserved?: boolean;
  /**
   * The `Content-Type` for encoding a specific property. The value is a comma-separated list, each element of which is either a specific media type (e.g. `image/png`) or a wildcard media type (e.g. `image/*`). Default value depends on the property type as shown in the table below.
   */
  contentType?: string;
  /**
   * When this is true, property values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this field has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#encoding-style `style`} is `"form"`, the default value is `true`. For all other styles, the default value is `false`. Note that despite `false` being the default for `deepObject`, the combination of `false` with `deepObject` is undefined. This field SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
   */
  explode?: boolean;
  /**
   * A map allowing additional information to be provided as headers. `Content-Type` is described separately and SHALL be ignored in this section. This field SHALL be ignored if the request body media type is not a `multipart`.
   */
  headers?: Record<string, HeaderObject | ReferenceObject$2>;
  /**
   * Describes how a specific property value will be serialized depending on its type. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-object Parameter Object} for details on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} field. The behavior follows the same values as `query` parameters, including default values. Note that the initial `?` used in query strings is not used in `application/x-www-form-urlencoded` message bodies, and MUST be removed (if using an RFC6570 implementation) or simply not added (if constructing the string manually). This field SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded`.
   */
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited';
}
/**
 * An object grouping an internal or external example value with basic `summary` and `description` metadata. This object is typically used in fields named `examples` (plural), and is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object referenceable} alternative to older `example` (singular) fields that do not support referencing or metadata.
 *
 * Examples allow demonstration of the usage of properties, parameters and objects within OpenAPI.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * In all cases, the example value SHOULD be compatible with the schema of its associated value. Tooling implementations MAY choose to validate compatibility automatically, and reject the example value(s) if incompatible.
 *
 * TODO: examples
 */
interface ExampleObject {
  /**
   * Long description for the example. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A URL that points to the literal example. This provides the capability to reference examples that cannot easily be included in JSON or YAML documents. The `value` field and `externalValue` field are mutually exclusive. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#relative-references-in-urls Relative References}.
   */
  externalValue?: string;
  /**
   * Short description for the example.
   */
  summary?: string;
  /**
   * Embedded literal example. The `value` field and `externalValue` field are mutually exclusive. To represent examples of media types that cannot naturally represented in JSON or YAML, use a string value to contain the example, escaping where necessary.
   */
  value?: unknown;
}
/**
 * Allows referencing an external resource for extended documentation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * **External Documentation Object Example**
 *
 * ```yaml
 * description: Find more info here
 * url: https://example.com
 * ```
 */
interface ExternalDocumentationObject {
  /**
   * A description of the target documentation. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * **REQUIRED**. The URL for the target documentation. This MUST be in the form of a URL.
   */
  url: string;
}
/**
 * Describes a single header for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#response-headers HTTP responses} and for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#encoding-headers individual parts in `multipart` representations}; see the relevant {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#response-object Response Object} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#encoding-object Encoding Object} documentation for restrictions on which headers can be described.
 *
 * The Header Object follows the structure of the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-object Parameter Object}, including determining its serialization strategy based on whether `schema` or `content` is present, with the following changes:
 * 1. `name` MUST NOT be specified, it is given in the corresponding `headers` map.
 * 1. `in` MUST NOT be specified, it is implicitly in `header`.
 * 1. All traits that are affected by the location MUST be applicable to a location of `header` (for example, {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`}). This means that `allowEmptyValue` and `allowReserved` MUST NOT be used, and `style`, if used, MUST be limited to `"simple"`.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
type HeaderObject = Omit<ParameterObject$1, 'in' | 'name'>;
/**
 * The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * ```yaml
 * title: Example Pet Store App
 * description: This is an example server for a pet store.
 * termsOfService: https://example.com/terms/
 * contact:
 *   name: API Support
 *   url: https://www.example.com/support
 *   email: support@example.com
 * license:
 *   name: Apache 2.0
 *   url: https://www.apache.org/licenses/LICENSE-2.0.html
 * version: 1.0.1
 * ```
 */
interface InfoObject$1 {
  /**
   * The contact information for the exposed API.
   */
  contact?: ContactObject;
  /**
   * A description of the API. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * The license information for the exposed API.
   */
  license?: LicenseObject;
  /**
   * A URL for the Terms of Service for the API. This MUST be in the form of a URL.
   */
  termsOfService?: string;
  /**
   * **REQUIRED**. The title of the API.
   */
  title: string;
  /**
   * **REQUIRED**. The version of the OpenAPI Document (which is distinct from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-version OpenAPI Specification version} or the version of the API being described or the version of the OpenAPI Description).
   */
  version: string;
}
/**
 * License information for the exposed API.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * ```yaml
 * name: Apache 2.0
 * url: https://www.apache.org/licenses/LICENSE-2.0.html
 * ```
 */
interface LicenseObject {
  /**
   * **REQUIRED**. The license name used for the API.
   */
  name: string;
  /**
   * A URL for the license used for the API. This MUST be in the form of a URL.
   */
  url?: string;
}
/**
 * The Link Object represents a possible design-time link for a response. The presence of a link does not guarantee the caller's ability to successfully invoke it, rather it provides a known relationship and traversal mechanism between responses and other operations.
 *
 * Unlike _dynamic links_ (i.e. links provided in the response payload), the OAS linking mechanism does not require link information in the runtime response.
 *
 * For computing links and providing instructions to execute them, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#runtime-expressions runtime expression} is used for accessing values in an operation and using them as parameters while invoking the linked operation.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * A linked operation MUST be identified using either an `operationRef` or `operationId`. The identified or reference operation MUST be unique, and in the case of an `operationId`, it MUST be resolved within the scope of the OpenAPI Description (OAD). Because of the potential for name clashes, the `operationRef` syntax is preferred for multi-document OADs. However, because use of an operation depends on its URL path template in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#paths-object Paths Object}, operations from any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-object Path Item Object} that is referenced multiple times within the OAD cannot be resolved unambiguously. In such ambiguous cases, the resulting behavior is implementation-defined and MAY result in an error.
 *
 * Note that it is not possible to provide a constant value to `parameters` that matches the syntax of a runtime expression. It is possible to have ambiguous parameter names, e.g. `name: "id"`, `in: "path"` and `name: "path.id", in: "query"`; this is NOT RECOMMENDED and the behavior is implementation-defined, however implementations SHOULD prefer the qualified interpretation (`path.id` as a path parameter), as the names can always be qualified to disambiguate them (e.g. using `query.path.id` for the query parameter).
 *
 * TODO: examples
 */
interface LinkObject {
  /**
   * A description of the link. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * The name of an _existing_, resolvable OAS operation, as defined with a unique `operationId`. This field is mutually exclusive of the `operationRef` field.
   */
  operationId?: string;
  /**
   * A URI reference to an OAS operation. This field is mutually exclusive of the `operationId` field, and MUST point to an {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object}.
   */
  operationRef?: string;
  /**
   * A map representing parameters to pass to an operation as specified with `operationId` or identified via `operationRef`. The key is the parameter name to be used (optionally qualified with the parameter location, e.g. `path.id` for an `id` parameter in the path), whereas the value can be a constant or an expression to be evaluated and passed to the linked operation.
   */
  parameters?: Record<string, unknown | string>;
  /**
   * A literal value or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#runtime-expressions {expression}} to use as a request body when calling the target operation.
   */
  requestBody?: unknown | string;
  /**
   * A server object to be used by the target operation.
   */
  server?: ServerObject$1;
}
/**
 * Each Media Type Object provides schema and examples for the media type identified by its key.
 *
 * When `example` or `examples` are provided, the example SHOULD match the specified schema and be in the correct format as specified by the media type and its encoding. The `example` and `examples` fields are mutually exclusive, and if either is present it SHALL _override_ any `example` in the schema. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples} for further guidance regarding the different ways of specifying examples, including non-JSON/YAML values.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface MediaTypeObject {
  /**
   * A map between a property name and its encoding information. The key, being the property name, MUST exist in the schema as a property. The `encoding` field SHALL only apply to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#request-body-object Request Body Objects}, and only when the media type is `multipart` or `application/x-www-form-urlencoded`. If no Encoding Object is provided for a property, the behavior is determined by the default values documented for the Encoding Object.
   */
  encoding?: Record<string, EncodingObject>;
  /**
   * Example of the media type; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  example?: unknown;
  /**
   * Examples of the media type; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  examples?: Record<string, ExampleObject | ReferenceObject$2>;
  /**
   * The schema defining the content of the request, response, parameter, or header.
   */
  schema?: SchemaObject$1 | ReferenceObject$2;
}
/**
 * Configuration details for a supported OAuth Flow
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface OAuthFlowObject {
  /**
   * **REQUIRED (`"implicit"`, `"authorizationCode"`)**. The authorization URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  authorizationUrl?: string;
  /**
   * The URL to be used for obtaining refresh tokens. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  refreshUrl?: string;
  /**
   * **REQUIRED**. The available scopes for the OAuth2 security scheme. A map between the scope name and a short description for it. The map MAY be empty.
   */
  scopes: Record<string, string>;
  /**
   * **REQUIRED (`"password"`, `"clientCredentials"`, `"authorizationCode"`)**. The token URL to be used for this flow. This MUST be in the form of a URL. The OAuth2 standard requires the use of TLS.
   */
  tokenUrl?: string;
}
/**
 * Allows configuration of the supported OAuth Flows.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 */
interface OAuthFlowsObject {
  /**
   * Configuration for the OAuth Authorization Code flow. Previously called `accessCode` in OpenAPI 2.0.
   */
  authorizationCode?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Client Credentials flow. Previously called `application` in OpenAPI 2.0.
   */
  clientCredentials?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Implicit flow
   */
  implicit?: OAuthFlowObject;
  /**
   * Configuration for the OAuth Resource Owner Password flow
   */
  password?: OAuthFlowObject;
}
/**
 * Describes a single API operation on a path.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface OperationObject$1 {
  /**
   * A map of possible out-of band callbacks related to the parent operation. The key is a unique identifier for the Callback Object. Each value in the map is a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#callback-object Callback Object} that describes a request that may be initiated by the API provider and the expected responses.
   */
  callbacks?: Record<string, CallbackObject | ReferenceObject$2>;
  /**
   * Declares this operation to be deprecated. Consumers SHOULD refrain from usage of the declared operation. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A verbose explanation of the operation behavior. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this operation.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * Unique string used to identify the operation. The id MUST be unique among all operations described in the API. The operationId value is **case-sensitive**. Tools and libraries MAY use the operationId to uniquely identify an operation, therefore, it is RECOMMENDED to follow common programming naming conventions.
   */
  operationId?: string;
  /**
   * A list of parameters that are applicable for this operation. If a parameter is already defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-parameters Path Item}, the new definition will override it but can never remove it. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-name name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} to link to parameters that are defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-parameters OpenAPI Object's `components.parameters`}.
   */
  parameters?: ReadonlyArray<ParameterObject$1 | ReferenceObject$2>;
  /**
   * The request body applicable for this operation. The `requestBody` is only supported in HTTP methods where the HTTP 1.1 specification {@link https://tools.ietf.org/html/rfc7231#section-4.3.1 RFC7231} has explicitly defined semantics for request bodies. In other cases where the HTTP spec is vague (such as {@link https://tools.ietf.org/html/rfc7231#section-4.3.1 GET}, {@link https://tools.ietf.org/html/rfc7231#section-4.3.2 HEAD} and {@link https://tools.ietf.org/html/rfc7231#section-4.3.5 DELETE}), `requestBody` SHALL be ignored by consumers.
   */
  requestBody?: RequestBodyObject$1 | ReferenceObject$2;
  /**
   * **REQUIRED**. The list of possible responses as they are returned from executing this operation.
   */
  responses: ResponsesObject;
  /**
   * A declaration of which security mechanisms can be used for this operation. The list of values includes alternative Security Requirement Objects that can be used. Only one of the Security Requirement Objects need to be satisfied to authorize a request. To make security optional, an empty security requirement (`{}`) can be included in the array. This definition overrides any declared top-level {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-security `security`}. To remove a top-level security declaration, an empty array can be used.
   */
  security?: ReadonlyArray<SecurityRequirementObject>;
  /**
   * An alternative `servers` array to service this operation. If a `servers` array is specified at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-servers Path Item Object} or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-servers OpenAPI Object} level, it will be overridden by this value.
   */
  servers?: ReadonlyArray<ServerObject$1>;
  /**
   * A short summary of what the operation does.
   */
  summary?: string;
  /**
   * A list of tags for API documentation control. Tags can be used for logical grouping of operations by resources or any other qualifier.
   */
  tags?: ReadonlyArray<string>;
}
/**
 * Describes a single operation parameter.
 *
 * A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-name name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in location}.
 *
 * See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types Appendix E} for a detailed examination of percent-encoding concerns, including interactions with the `application/x-www-form-urlencoded` query string format.
 *
 * **Parameter Locations**
 *
 * There are four possible parameter locations specified by the `in` field:
 *
 * - path - Used together with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-templating Path Templating}, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in `/items/{itemId}`, the path parameter is `itemId`.
 * - query - Parameters that are appended to the URL. For example, in `/items?id=###`, the query parameter is `id`.
 * - header - Custom headers that are expected as part of the request. Note that {@link https://tools.ietf.org/html/rfc7230#section-3.2 RFC7230} states header names are case insensitive.
 * - cookie - Used to pass a specific cookie value to the API.
 *
 * **Fixed Fields**
 *
 * The rules for serialization of the parameter are specified in one of two ways. Parameter Objects MUST include either a `content` field or a `schema` field, but not both. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-b-data-type-conversion Appendix B} for a discussion of converting values of various types to string representations.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * Note that while `"Cookie"` as a `name` is not forbidden if `in` is `"header"`, the effect of defining a cookie parameter that way is undefined; use `in: "cookie"` instead.
 *
 * **Fixed Fields for use with schema**
 *
 * For simpler scenarios, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-schema `schema`} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} can describe the structure and syntax of the parameter. When `example` or `examples` are provided in conjunction with the `schema` field, the example SHOULD match the specified schema and follow the prescribed serialization strategy for the parameter. The `example` and `examples` fields are mutually exclusive, and if either is present it SHALL _override_ any `example` in the schema.
 *
 * Serializing with `schema` is NOT RECOMMENDED for `in: "cookie"` parameters, `in: "header"` parameters that use HTTP header parameters (name=value pairs following a `;`) in their values, or `in: "header"` parameters where values might have non-URL-safe characters; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-d-serializing-headers-and-cookies Appendix D} for details.
 *
 * See also {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-c-using-rfc6570-based-serialization Appendix C: Using RFC6570-Based Serialization} for additional guidance.
 *
 * **Fixed Fields for use with `content`**
 *
 * For more complex scenarios, the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-content `content`} field can define the media type and schema of the parameter, as well as give examples of its use. Using `content` with a `text/plain` media type is RECOMMENDED for `in: "header"` and `in: "cookie"` parameters where the `schema` strategy is not appropriate.
 *
 * **Style Values**
 *
 * In order to support common ways of serializing simple parameters, a set of `style` values are defined.
 *
 * See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types Appendix E} for a discussion of percent-encoding, including when delimiters need to be percent-encoded and options for handling collisions with percent-encoded data.
 *
 * TODO: examples
 */
interface ParameterObject$1 {
  /**
   * If `true`, clients MAY pass a zero-length string value in place of parameters that would otherwise be omitted entirely, which the server SHOULD interpret as the parameter being unused. Default value is `false`. If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} is used, and if {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#style-examples behavior is _n/a_ (cannot be serialized)}, the value of `allowEmptyValue` SHALL be ignored. Interactions between this field and the parameter's {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} are implementation-defined. This field is valid only for `query` parameters. Use of this field is NOT RECOMMENDED, and it is likely to be removed in a later revision.
   */
  allowEmptyValue?: boolean;
  /**
   * When this is true, parameter values are serialized using reserved expansion, as defined by {@link https://datatracker.ietf.org/doc/html/rfc6570#section-3.2.3 RFC6570}, which allows {@link https://datatracker.ietf.org/doc/html/rfc3986#section-2.2 RFC3986's reserved character set}, as well as percent-encoded triples, to pass through unchanged, while still percent-encoding all other disallowed characters (including `%` outside of percent-encoded triples). Applications are still responsible for percent-encoding reserved characters that are {@link https://datatracker.ietf.org/doc/html/rfc3986#section-3.4 not allowed in the query string} (`[`, `]`, `#`), or have a special meaning in `application/x-www-form-urlencoded` (`-`, `&`, `+`); see Appendices {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-c-using-rfc6570-based-serialization C} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#appendix-e-percent-encoding-and-form-media-types E} for details. This field only applies to parameters with an `in` value of `query`. The default value is `false`.
   */
  allowReserved?: boolean;
  /**
   * A map containing the representations for the parameter. The key is the media type and the value describes it. The map MUST only contain one entry.
   */
  content?: Record<string, MediaTypeObject>;
  /**
   * Specifies that a parameter is deprecated and SHOULD be transitioned out of usage. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * A brief description of the parameter. This could contain examples of use. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Example of the parameter's potential value; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  example?: unknown;
  /**
   * Examples of the parameter's potential value; see {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#working-with-examples Working With Examples}.
   */
  examples?: Record<string, ExampleObject | ReferenceObject$2>;
  /**
   * When this is true, parameter values of type `array` or `object` generate separate parameters for each value of the array or key-value pair of the map. For other types of parameters this field has no effect. When {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-style `style`} is `"form"`, the default value is `true`. For all other styles, the default value is `false`. Note that despite `false` being the default for `deepObject`, the combination of `false` with `deepObject` is undefined.
   */
  explode?: boolean;
  /**
   * **REQUIRED**. The location of the parameter. Possible values are `"query"`, `"header"`, `"path"` or `"cookie"`.
   */
  in: 'cookie' | 'header' | 'path' | 'query';
  /**
   * **REQUIRED**. The name of the parameter. Parameter names are _case sensitive_.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in `in`} is `"path"`, the `name` field MUST correspond to a template expression occurring within the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#paths-path path} field in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#paths-object Paths Object}. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-templating Path Templating} for further information.
   * - If {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in `in`} is `"header"` and the `name` field is `"Accept"`, `"Content-Type"` or `"Authorization"`, the parameter definition SHALL be ignored.
   * - For all other cases, the `name` corresponds to the parameter name used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in `in`} field.
   */
  name: string;
  /**
   * Determines whether this parameter is mandatory. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in parameter location} is `"path"`, this field is **REQUIRED** and its value MUST be `true`. Otherwise, the field MAY be included and its default value is `false`.
   */
  required?: boolean;
  /**
   * The schema defining the type used for the parameter.
   */
  schema?: SchemaObject$1 | ReferenceObject$2;
  /**
   * Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of `in`): for `"query"` - `"form"`; for `"path"` - `"simple"`; for `"header"` - `"simple"`; for `"cookie"` - `"form"`.
   */
  style?: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited';
}
/**
 * Describes the operations available on a single path. A Path Item MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-filtering ACL constraints}. The path itself is still exposed to the documentation viewer but they will not know which operations and parameters are available.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface PathItemObject {
  /**
   * Allows for a referenced definition of this path item. The value MUST be in the form of a URL, and the referenced structure MUST be in the form of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-item-object Path Item Object}. In case a Path Item Object field appears both in the defined object and the referenced object, the behavior is undefined. See the rules for resolving {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#relative-references-in-urls Relative References}.
   */
  $ref?: string;
  /**
   * A definition of a DELETE operation on this path.
   */
  delete?: OperationObject$1;
  /**
   * An optional string description, intended to apply to all operations in this path. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * A definition of a GET operation on this path.
   */
  get?: OperationObject$1;
  /**
   * A definition of a HEAD operation on this path.
   */
  head?: OperationObject$1;
  /**
   * A definition of a OPTIONS operation on this path.
   */
  options?: OperationObject$1;
  /**
   * A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-name name} and {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#parameter-in location}. The list can use the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} to link to parameters that are defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-parameters OpenAPI Object's `components.parameters`}.
   */
  parameters?: ReadonlyArray<ParameterObject$1 | ReferenceObject$2>;
  /**
   * A definition of a PATCH operation on this path.
   */
  patch?: OperationObject$1;
  /**
   * A definition of a POST operation on this path.
   */
  post?: OperationObject$1;
  /**
   * A definition of a PUT operation on this path.
   */
  put?: OperationObject$1;
  /**
   * An alternative `servers` array to service all operations in this path. If a `servers` array is specified at the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#oas-servers OpenAPI Object} level, it will be overridden by this value.
   */
  servers?: ReadonlyArray<ServerObject$1>;
  /**
   * An optional string summary, intended to apply to all operations in this path.
   */
  summary?: string;
  /**
   * A definition of a TRACE operation on this path.
   */
  trace?: OperationObject$1;
}
/**
 * Holds the relative paths to the individual endpoints and their operations. The path is appended to the URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-object Server Object} in order to construct the full URL. The Paths Object MAY be empty, due to {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-filtering Access Control List (ACL) constraints}.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface PathsObject {
  /**
   * A relative path to an individual endpoint. The field name MUST begin with a forward slash (`/`). The path is **appended** (no relative URL resolution) to the expanded URL from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-object Server Object}'s `url` field in order to construct the full URL. {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#path-templating Path templating} is allowed. When matching URLs, concrete (non-templated) paths would be matched before their templated counterparts. Templated paths with the same hierarchy but different templated names MUST NOT exist as they are identical. In case of ambiguous matching, it's up to the tooling to decide which one to use.
   */
  [path: `/${string}`]: PathItemObject;
}
/**
 * A simple object to allow referencing other components in the OpenAPI Description, internally and externally.
 *
 * The Reference Object is defined by {@link https://tools.ietf.org/html/draft-pbryan-zyp-json-ref-03 JSON Reference} and follows the same structure, behavior and rules.
 *
 * For this specification, reference resolution is accomplished as defined by the JSON Reference specification and not by the JSON Schema specification.
 *
 * This object cannot be extended with additional properties, and any properties added SHALL be ignored.
 *
 * **Reference Object Example**
 *
 * ```yaml
 * $ref: '#/components/schemas/Pet'
 * ```
 *
 * **Relative Schema Document Example**
 *
 * ```yaml
 * $ref: Pet.yaml
 * ```
 *
 * **Relative Documents with Embedded Schema Example**
 *
 * ```yaml
 * $ref: definitions.yaml#/Pet
 * ```
 */
interface ReferenceObject$2 {
  /**
   * **REQUIRED**. The reference string.
   */
  $ref: string;
}
/**
 * Describes a single request body.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface RequestBodyObject$1 {
  /**
   * **REQUIRED**. The content of the request body. The key is a media type or {@link https://tools.ietf.org/html/rfc7231#appendix-D media type range} and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. `"text/plain"` overrides `"text/*"`
   */
  content: Record<string, MediaTypeObject>;
  /**
   * A brief description of the request body. This could contain examples of use. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Determines if the request body is required in the request. Defaults to `false`.
   */
  required?: boolean;
}
/**
 * Describes a single response from an API operation, including design-time, static `links` to operations based on the response.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface ResponseObject$1 {
  /**
   * A map containing descriptions of potential response payloads. The key is a media type or {@link https://tools.ietf.org/html/rfc7231#appendix-D media type range} and the value describes it. For responses that match multiple keys, only the most specific key is applicable. e.g. `"text/plain"` overrides `"text/*"`
   */
  content?: Record<string, MediaTypeObject>;
  /**
   * **REQUIRED**. A description of the response. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description: string;
  /**
   * Maps a header name to its definition. {@link https://tools.ietf.org/html/rfc7230#section-3.2 RFC7230} states header names are case insensitive. If a response header is defined with the name `"Content-Type"`, it SHALL be ignored.
   */
  headers?: Record<string, HeaderObject | ReferenceObject$2>;
  /**
   * A map of operations links that can be followed from the response. The key of the map is a short name for the link, following the naming constraints of the names for {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-object Component Objects}.
   */
  links?: Record<string, LinkObject | ReferenceObject$2>;
}
/**
 * A container for the expected responses of an operation. The container maps a HTTP response code to the expected response.
 *
 * The documentation is not necessarily expected to cover all possible HTTP response codes because they may not be known in advance. However, documentation is expected to cover a successful operation response and any known errors.
 *
 * The `default` MAY be used as a default Response Object for all HTTP codes that are not covered individually by the Responses Object.
 *
 * The Responses Object MUST contain at least one response code, and if only one response code is provided it SHOULD be the response for a successful operation call.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface ResponsesObject {
  /**
   * Any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#http-status-codes HTTP status code} can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. A {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} can link to a response that is defined in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-responses OpenAPI Object's `components.responses`} section. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character `X`. For example, `2XX` represents all response codes between `200` and `299`. Only the following range definitions are allowed: `1XX`, `2XX`, `3XX`, `4XX`, and `5XX`. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
   */
  [httpStatusCode: string]: ResponseObject$1 | ReferenceObject$2 | undefined;
  /**
   * The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses. A {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} can link to a response that the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-responses OpenAPI Object's `components.responses`} section defines.
   */
  default?: ResponseObject$1 | ReferenceObject$2;
}
/**
 * The Schema Object allows the definition of input and output data types. These types can be objects, but also primitives and arrays. This object is an extended subset of the [[JSON-Schema-05|JSON Schema Specification Draft Wright-00]].
 *
 * For more information about the keywords, see {@link https://tools.ietf.org/html/draft-wright-json-schema-00 JSON Schema Core} and {@link https://tools.ietf.org/html/draft-wright-json-schema-validation-00 JSON Schema Validation}. Unless stated otherwise, the keyword definitions follow those of JSON Schema and do not add any additional semantics.
 *
 * **JSON Schema Keywords**
 *
 * The following keywords are taken directly from the JSON Schema definition and follow the same specifications:
 * - title
 * - multipleOf
 * - maximum
 * - exclusiveMaximum
 * - minimum
 * - exclusiveMinimum
 * - maxLength
 * - minLength
 * - pattern (This string SHOULD be a valid regular expression, according to the {@link https://www.ecma-international.org/ecma-262/5.1/#sec-15.10.1 Ecma-262 Edition 5.1 regular expression} dialect)
 * - maxItems
 * - minItems
 * - uniqueItems
 * - maxProperties
 * - minProperties
 * - required
 * - enum
 *
 * The following keywords are taken from the JSON Schema definition but their definitions were adjusted to the OpenAPI Specification.
 *
 * - type - Value MUST be a string. Multiple types via an array are not supported.
 * - allOf - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - oneOf - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - anyOf - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - not - Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema.
 * - items - Value MUST be an object and not an array. Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema. `items` MUST be present if `type` is `"array"`.
 * - properties - Property definitions MUST be a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema (inline or referenced).
 * - additionalProperties - Value can be boolean or object. Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema. Consistent with JSON Schema, `additionalProperties` defaults to `true`.
 * - description - {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
 * - format - See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#data-type-format Data Type Formats} for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
 * - default - The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined `type` for the Schema Object defined at the same level. For example, if `type` is `"string"`, then `default` can be `"foo"` but cannot be `1`.
 *
 * Alternatively, any time a Schema Object can be used, a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#reference-object Reference Object} can be used in its place. This allows referencing definitions instead of defining them inline.
 *
 * Additional keywords defined by the JSON Schema specification that are not mentioned here are strictly unsupported.
 *
 * Other than the JSON Schema subset fields, the following fields MAY be used for further schema documentation:
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * **Composition and Inheritance (Polymorphism)**
 *
 * TODO: content, examples
 */
interface SchemaObject$1 extends EnumExtensions {
  /**
   * The value of "additionalProperties" MUST be a boolean or a schema.
   *
   * If "additionalProperties" is absent, it may be considered present with an empty schema as a value.
   *
   * If "additionalProperties" is true, validation always succeeds.
   *
   * If "additionalProperties" is false, validation succeeds only if the instance is an object and all properties on the instance were covered by "properties" and/or "patternProperties".
   *
   * If "additionalProperties" is an object, validate the value as a schema to all of the properties that weren't validated by "properties" nor "patternProperties".
   *
   * Value can be boolean or object. Inline or referenced schema MUST be of a {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object} and not a standard JSON Schema. Consistent with JSON Schema, `additionalProperties` defaults to `true`.
   */
  additionalProperties?: boolean | SchemaObject$1 | ReferenceObject$2;
  /**
   * This keyword's value MUST be an array.  This array MUST have at least one element.
   *
   * Elements of the array MUST be objects.  Each object MUST be a valid Schema Object.
   *
   * An instance validates successfully against this keyword if it validates successfully against all schemas defined by this keyword's value.
   */
  allOf?: ReadonlyArray<SchemaObject$1 | ReferenceObject$2>;
  /**
   * This keyword's value MUST be an array.  This array MUST have at least one element.
   *
   * Elements of the array MUST be objects.  Each object MUST be a valid Schema Object.
   *
   * An instance validates successfully against this keyword if it validates successfully against at least one schema defined by this
   keyword's value.
   */
  anyOf?: ReadonlyArray<SchemaObject$1 | ReferenceObject$2>;
  /**
   * The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined `type` for the Schema Object defined at the same level. For example, if `type` is `"string"`, then `default` can be `"foo"` but cannot be `1`.
   */
  default?: unknown;
  /**
   * Specifies that a schema is deprecated and SHOULD be transitioned out of usage. Default value is `false`.
   */
  deprecated?: boolean;
  /**
   * The value of both of these keywords MUST be a string.
   *
   * Both of these keywords can be used to decorate a user interface with information about the data produced by this user interface.  A title will preferrably be short, whereas a description will provide explanation about the purpose of the instance described by this schema.
   *
   * Both of these keywords MAY be used in root schemas, and in any subschemas.
   */
  description?: string;
  /**
   * Adds support for polymorphism. The discriminator is used to determine which of a set of schemas a payload is expected to satisfy. See {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#composition-and-inheritance-polymorphism Composition and Inheritance} for more details.
   */
  discriminator?: DiscriminatorObject;
  /**
   * The value of this keyword MUST be an array.  This array SHOULD have at least one element.  Elements in the array SHOULD be unique.
   *
   * Elements in the array MAY be of any type, including null.
   *
   * An instance validates successfully against this keyword if its value is equal to one of the elements in this keyword's array value.
   */
  enum?: ReadonlyArray<unknown>;
  /**
   * A free-form field to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary.
   */
  example?: unknown;
  /**
   * The value of "exclusiveMaximum" MUST be a boolean, representing whether the limit in "maximum" is exclusive or not.  An undefined value is the same as false.
   *
   * If "exclusiveMaximum" is true, then a numeric instance SHOULD NOT be equal to the value specified in "maximum".  If "exclusiveMaximum" is false (or not specified), then a numeric instance MAY be equal to the value of "maximum".
   */
  exclusiveMaximum?: boolean;
  /**
   * The value of "exclusiveMinimum" MUST be a boolean, representing whether the limit in "minimum" is exclusive or not.  An undefined value is the same as false.
   *
   * If "exclusiveMinimum" is true, then a numeric instance SHOULD NOT be equal to the value specified in "minimum".  If "exclusiveMinimum" is false (or not specified), then a numeric instance MAY be equal to the value of "minimum".
   */
  exclusiveMinimum?: boolean;
  /**
   * Additional external documentation for this schema.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
   */
  format?: Format;
  /**
   * `items` MUST be present if `type` is `"array"`.
   */
  items?: SchemaObject$1 | ReferenceObject$2;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An array instance is valid against "maxItems" if its size is less than, or equal to, the value of this keyword.
   */
  maxItems?: number;
  /**
   * The value of this keyword MUST be a non-negative integer.
   *
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * A string instance is valid against this keyword if its length is less than, or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters as defined by {@link https://datatracker.ietf.org/doc/html/rfc7159 RFC 7159} [RFC7159].
   */
  maxLength?: number;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.
   */
  maxProperties?: number;
  /**
   * The value of "maximum" MUST be a number, representing an upper limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates if "exclusiveMaximum" is true and instance is less than the provided value, or else if the instance is less than or exactly equal to the provided value.
   */
  maximum?: number;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An array instance is valid against "minItems" if its size is greater than, or equal to, the value of this keyword.
   *
   * If this keyword is not present, it may be considered present with a value of 0.
   */
  minItems?: number;
  /**
   * A string instance is valid against this keyword if its length is greater than, or equal to, the value of this keyword.
   *
   * The length of a string instance is defined as the number of its characters as defined by {@link https://datatracker.ietf.org/doc/html/rfc7159 RFC 7159} [RFC7159].
   *
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * "minLength", if absent, may be considered as being present with integer value 0.
   */
  minLength?: number;
  /**
   * The value of this keyword MUST be an integer.  This integer MUST be greater than, or equal to, 0.
   *
   * An object instance is valid against "minProperties" if its number of properties is greater than, or equal to, the value of this keyword.
   *
   * If this keyword is not present, it may be considered present with a value of 0.
   */
  minProperties?: number;
  /**
   * The value of "minimum" MUST be a number, representing a lower limit for a numeric instance.
   *
   * If the instance is a number, then this keyword validates if "exclusiveMinimum" is true and instance is greater than the provided value, or else if the instance is greater than or exactly equal to the provided value.
   */
  minimum?: number;
  /**
   * The value of "multipleOf" MUST be a number, strictly greater than 0.
   *
   * A numeric instance is only valid if division by this keyword's value results in an integer.
   */
  multipleOf?: number;
  /**
   * This keyword's value MUST be an object.  This object MUST be a valid Schema Object.
   *
   * An instance is valid against this keyword if it fails to validate successfully against the schema defined by this keyword.
   */
  not?: SchemaObject$1 | ReferenceObject$2;
  /**
   * This keyword only takes effect if `type` is explicitly defined within the same Schema Object. A `true` value indicates that both `null` values and values of the type specified by `type` are allowed. Other Schema Object constraints retain their defined behavior, and therefore may disallow the use of `null` as a value. A `false` value leaves the specified or default `type` unmodified. The default value is `false`.
   */
  nullable?: boolean;
  /**
   * This keyword's value MUST be an array.  This array MUST have at least one element.
   *
   * Elements of the array MUST be objects.  Each object MUST be a valid Schema Object.
   *
   * An instance validates successfully against this keyword if it validates successfully against exactly one schema defined by this keyword's value.
   */
  oneOf?: ReadonlyArray<SchemaObject$1 | ReferenceObject$2>;
  /**
   * The value of this keyword MUST be a string.  This string SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect.
   *
   * A string instance is considered valid if the regular expression matches the instance successfully.  Recall: regular expressions are not implicitly anchored.
   */
  pattern?: string;
  /**
   * The value of "properties" MUST be an object.  Each value of this object MUST be an object, and each object MUST be a valid Schema Object.
   *
   * If absent, it can be considered the same as an empty object.
   */
  properties?: Record<string, SchemaObject$1 | ReferenceObject$2>;
  /**
   * Relevant only for Schema Object `properties` definitions. Declares the property as "read only". This means that it MAY be sent as part of a response but SHOULD NOT be sent as part of the request. If the property is marked as `readOnly` being `true` and is in the `required` list, the `required` will take effect on the response only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
   */
  readOnly?: boolean;
  /**
   * The value of this keyword MUST be an array.  This array MUST have at least one element.  Elements of this array MUST be strings, and MUST be unique.
   *
   * An object instance is valid against this keyword if its property set contains all elements in this keyword's array value.
   */
  required?: ReadonlyArray<string>;
  /**
   * The value of both of these keywords MUST be a string.
   *
   * Both of these keywords can be used to decorate a user interface with information about the data produced by this user interface.  A title will preferrably be short, whereas a description will provide explanation about the purpose of the instance described by this schema.
   *
   * Both of these keywords MAY be used in root schemas, and in any subschemas.
   */
  title?: string;
  /**
   * The value of this keyword MUST be a string.
   *
   * An instance matches successfully if its primitive type is one of the types defined by keyword.  Recall: "number" includes "integer".
   */
  type?: 'array' | 'boolean' | 'integer' | 'number' | 'object' | 'string';
  /**
   * The value of this keyword MUST be a boolean.
   *
   * If this keyword has boolean value false, the instance validates successfully.  If it has boolean value true, the instance validates successfully if all of its elements are unique.
   *
   * If not present, this keyword may be considered present with boolean value false.
   */
  uniqueItems?: boolean;
  /**
   * Relevant only for Schema Object `properties` definitions. Declares the property as "write only". Therefore, it MAY be sent as part of a request but SHOULD NOT be sent as part of the response. If the property is marked as `writeOnly` being `true` and is in the `required` list, the `required` will take effect on the request only. A property MUST NOT be marked as both `readOnly` and `writeOnly` being `true`. Default value is `false`.
   */
  writeOnly?: boolean;
  /**
   * This MAY be used only on property schemas. It has no effect on root schemas. Adds additional metadata to describe the XML representation of this property.
   */
  xml?: XMLObject;
}
/**
 * Lists the required security schemes to execute this operation. The name used for each property MUST correspond to a security scheme declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-scheme-object Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-object Components Object}.
 *
 * A Security Requirement Object MAY refer to multiple security schemes in which case all schemes MUST be satisfied for a request to be authorized. This enables support for scenarios where multiple query parameters or HTTP headers are required to convey security information.
 *
 * When the `security` field is defined on the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#openapi-object OpenAPI Object} or {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object} and contains multiple Security Requirement Objects, only one of the entries in the list needs to be satisfied to authorize the request. This enables support for scenarios where the API allows multiple, independent security schemes.
 *
 * An empty Security Requirement Object (`{}`) indicates anonymous access is supported.
 *
 * TODO: examples
 */
interface SecurityRequirementObject {
  /**
   * Each name MUST correspond to a security scheme which is declared in the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#security-scheme-object Security Schemes} under the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#components-object Components Object}. If the security scheme is of type `"oauth2"` or `"openIdConnect"`, then the value is a list of scope names required for the execution, and the list MAY be empty if authorization does not require a specified scope. For other security scheme types, the array MUST be empty.
   */
  [name: string]: ReadonlyArray<string>;
}
/**
 * Defines a security scheme that can be used by the operations.
 *
 * Supported schemes are HTTP authentication, an API key (either as a header, a cookie parameter, or as a query parameter), OAuth2's common flows (implicit, password, client credentials, and authorization code) as defined in {@link https://tools.ietf.org/html/rfc6749 RFC6749}, and [[OpenID-Connect-Core]]. Please note that as of 2020, the implicit flow is about to be deprecated by {@link https://tools.ietf.org/html/draft-ietf-oauth-security-topics OAuth 2.0 Security Best Current Practice}. Recommended for most use cases is Authorization Code Grant flow with PKCE.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
type SecuritySchemeObject$1 = {
  /**
   * A description for security scheme. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
} & ({
  /**
   * **REQUIRED**. The location of the API key. Valid values are `"query"`, `"header"`, or `"cookie"`.
   */
  in: 'cookie' | 'header' | 'query';
  /**
   * **REQUIRED**. The name of the header, query or cookie parameter to be used.
   */
  name: string;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'apiKey';
} | {
  /**
   * A hint to the client to identify how the bearer token is formatted. Bearer tokens are usually generated by an authorization server, so this information is primarily for documentation purposes.
   */
  bearerFormat?: string;
  /**
   * **REQUIRED**. The name of the HTTP Authentication scheme to be used in the {@link https://tools.ietf.org/html/rfc7235#section-5.1 Authorization header as defined in RFC7235}. The values used SHOULD be registered in the {@link https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml IANA Authentication Scheme registry}. The value is case-insensitive, as defined in {@link https://datatracker.ietf.org/doc/html/rfc7235#section-2.1 RFC7235}.
   */
  scheme: string;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'http';
} | {
  /**
   * **REQUIRED**. An object containing configuration information for the flow types supported.
   */
  flows: OAuthFlowsObject;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'oauth2';
} | {
  /**
   * **REQUIRED**. {@link https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig Well-known URL} to discover the [[OpenID-Connect-Discovery]] {@link https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata provider metadata}.
   */
  openIdConnectUrl: string;
  /**
   * **REQUIRED**. The type of the security scheme. Valid values are `"apiKey"`, `"http"`, `"oauth2"`, `"openIdConnect"`.
   */
  type: 'openIdConnect';
});
/**
 * An object representing a Server.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * TODO: examples
 */
interface ServerObject$1 {
  /**
   * An optional string describing the host designated by the URL. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * **REQUIRED**. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the document containing the Server Object is being served. Variable substitutions will be made when a variable is named in `{`braces`}`.
   */
  url: string;
  /**
   * A map between a variable name and its value. The value is used for substitution in the server's URL template.
   */
  variables?: Record<string, ServerVariableObject>;
}
/**
 * An object representing a Server Variable for server URL template substitution.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 */
interface ServerVariableObject {
  /**
   * **REQUIRED**. The default value to use for substitution, which SHALL be sent if an alternate value is _not_ supplied. If the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#server-variable-enum `enum`} is defined, the value SHOULD exist in the enum's values. Note that this behavior is different from the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#schema-object Schema Object}'s `default` keyword, which documents the receiver's behavior rather than inserting the value into the data.
   */
  default: string;
  /**
   * An optional description for the server variable. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * An enumeration of string values to be used if the substitution options are from a limited set. The array SHOULD NOT be empty.
   */
  enum?: ReadonlyArray<string>;
}
/**
 * Adds metadata to a single tag that is used by the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#operation-object Operation Object}. It is not mandatory to have a Tag Object per tag defined in the Operation Object instances.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * **Tag Object Example**
 *
 * ```yaml
 * name: pet
 * description: Pets operations
 * ```
 */
interface TagObject {
  /**
   * A description for the tag. {@link https://spec.commonmark.org/ CommonMark syntax} MAY be used for rich text representation.
   */
  description?: string;
  /**
   * Additional external documentation for this tag.
   */
  externalDocs?: ExternalDocumentationObject;
  /**
   * **REQUIRED**. The name of the tag.
   */
  name: string;
}
/**
 * A metadata object that allows for more fine-tuned XML model definitions.
 *
 * When using arrays, XML element names are _not_ inferred (for singular/plural forms) and the `name` field SHOULD be used to add that information. See examples for expected behavior.
 *
 * This object MAY be extended with {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#specification-extensions Specification Extensions}.
 *
 * The `namespace` field is intended to match the syntax of {@link https://www.w3.org/TR/xml-names11/ XML namespaces}, although there are a few caveats:
 * - Version 3.0.3 and earlier of this specification erroneously used the term "absolute URI" instead of "non-relative URI", so authors using namespaces that include a fragment should check tooling support carefully.
 * - XML allows but discourages relative URI-references, while this specification outright forbids them.
 * - XML 1.1 allows IRIs ({@link https://datatracker.ietf.org/doc/html/rfc3987 RFC3987}) as namespaces, and specifies that namespaces are compared without any encoding or decoding, which means that IRIs encoded to meet this specification's URI syntax requirement cannot be compared to IRIs as-is.
 *
 * TODO: examples
 */
interface XMLObject {
  /**
   * Declares whether the property definition translates to an attribute instead of an element. Default value is `false`.
   */
  attribute?: boolean;
  /**
   * Replaces the name of the element/attribute used for the described schema property. When defined within `items`, it will affect the name of the individual XML elements within the list. When defined alongside `type` being `"array"` (outside the `items`), it will affect the wrapping element if and only if `wrapped` is `true`. If `wrapped` is `false`, it will be ignored.
   */
  name?: string;
  /**
   * The URI of the namespace definition. Value MUST be in the form of a non-relative URI.
   */
  namespace?: string;
  /**
   * The prefix to be used for the {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.4.md#xml-name name}.
   */
  prefix?: string;
  /**
   * MAY be used only for an array definition. Signifies whether the array is wrapped (for example, `<books><book/><book/></books>`) or unwrapped (`<book/><book/>`). Default value is `false`. The definition takes effect only when defined alongside `type` being `"array"` (outside the `items`).
   */
  wrapped?: boolean;
}
type JsonSchemaFormats = 'date-time' | 'email' | 'hostname' | 'ipv4' | 'ipv6' | 'uri' | 'uriref';
type OpenApiSchemaFormats = 'int32' | 'int64' | 'float' | 'double' | 'byte' | 'binary' | 'date' | 'date-time' | 'password';
type Format = JsonSchemaFormats | OpenApiSchemaFormats | (string & {});
//#endregion
//#region src/openApi/3.0.x/index.d.ts
interface OpenApiV3_0_XTypes {
  InfoObject: InfoObject$1;
  OperationObject: OperationObject$1;
  ParameterObject: ParameterObject$1;
  ReferenceObject: ReferenceObject$2;
  RequestBodyObject: RequestBodyObject$1;
  ResponseObject: ResponseObject$1;
  SchemaObject: SchemaObject$1;
}
//#endregion
//#region src/openApi/3.1.x/index.d.ts
interface OpenApiV3_1_XTypes {
  InfoObject: InfoObject;
  OperationObject: OperationObject;
  ParameterObject: ParameterObject;
  ReferenceObject: ReferenceObject$1;
  RequestBodyObject: RequestBodyObject;
  ResponseObject: ResponseObject;
  SchemaObject: SchemaObject;
}
//#endregion
//#region src/plugins/@hey-api/schemas/api.d.ts
type SelectorType$13 = 'ref';
type IApi$13 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `ref`: `$ref` JSON pointer
   * @returns Selector array
   */
  selector: (type: SelectorType$13, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/schemas/types.d.ts
type UserConfig$15 = Plugin.Name<'@hey-api/schemas'> & Plugin.Hooks & {
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Customise the schema name. By default, `{{name}}Schema` is used. `name` is a
   * valid JavaScript/TypeScript identifier, e.g. if your schema name is
   * "Foo-Bar", `name` value would be "FooBar".
   *
   * @default '{{name}}Schema'
   */
  nameBuilder?: string | ((name: string, schema: OpenApiSchema | OpenApiSchema$1 | OpenApiV2_0_XTypes['SchemaObject'] | OpenApiV3_0_XTypes['ReferenceObject'] | OpenApiV3_0_XTypes['SchemaObject'] | OpenApiV3_1_XTypes['SchemaObject']) => string);
  /**
   * Choose schema type to generate. Select 'form' if you don't want
   * descriptions to reduce bundle size and you plan to use schemas
   * for form validation
   *
   * @default 'json'
   */
  type?: 'form' | 'json';
};
type HeyApiSchemasPlugin = DefinePlugin<UserConfig$15, UserConfig$15, IApi$13>;
//#endregion
//#region src/config/utils/config.d.ts
type ObjectType<T$1> = Extract<T$1, Record<string, any>> extends never ? Record<string, any> : Extract<T$1, Record<string, any>>;
type NotArray<T$1> = T$1 extends any[] ? never : T$1;
type NotFunction<T$1> = T$1 extends ((...args: any[]) => any) ? never : T$1;
type PlainObject<T$1> = T$1 extends object ? NotFunction<T$1> extends never ? never : NotArray<T$1> extends never ? never : T$1 : never;
type MappersType<T$1> = {
  boolean: T$1 extends boolean ? (value: boolean) => Partial<ObjectType<T$1>> : never;
  function: T$1 extends ((...args: any[]) => any) ? (value: (...args: any[]) => any) => Partial<ObjectType<T$1>> : never;
  number: T$1 extends number ? (value: number) => Partial<ObjectType<T$1>> : never;
  object?: PlainObject<T$1> extends never ? never : (value: Partial<PlainObject<T$1>>, defaultValue: PlainObject<T$1>) => Partial<ObjectType<T$1>>;
  string: T$1 extends string ? (value: string) => Partial<ObjectType<T$1>> : never;
} extends infer U ? { [K in keyof U as U[K] extends never ? never : K]: U[K] } : never;
type IsObjectOnly<T$1> = T$1 extends Record<string, any> | undefined ? Extract<T$1, string | boolean | number | ((...args: any[]) => any)> extends never ? true : false : false;
type ValueToObject = <T extends undefined | string | boolean | number | ((...args: any[]) => any) | Record<string, any>>(args: {
  defaultValue: ObjectType<T>;
  value: T;
} & (IsObjectOnly<T> extends true ? {
  mappers?: MappersType<T>;
} : {
  mappers: MappersType<T>;
})) => PlainObject<T>;
//#endregion
//#region src/ir/graph.d.ts
declare const irTopLevelKinds: readonly ["operation", "parameter", "requestBody", "schema", "server", "webhook"];
type IrTopLevelKind = (typeof irTopLevelKinds)[number];
//#endregion
//#region src/openApi/types.d.ts
declare namespace OpenApi$1 {
  export type V2_0_X = OpenApiV2_0_X;
  export type V3_0_X = OpenApiV3_0_X;
  export type V3_1_X = OpenApiV3_1_X;
}
declare namespace OpenApiMetaObject {
  export type V2_0_X = OpenApiV2_0_XTypes['InfoObject'];
  export type V3_0_X = OpenApiV3_0_XTypes['InfoObject'];
  export type V3_1_X = OpenApiV3_1_XTypes['InfoObject'];
}
declare namespace OpenApiOperationObject {
  export type V2_0_X = OpenApiV2_0_XTypes['OperationObject'];
  export type V3_0_X = OpenApiV3_0_XTypes['OperationObject'];
  export type V3_1_X = OpenApiV3_1_XTypes['OperationObject'];
}
declare namespace OpenApiParameterObject {
  export type V3_0_X = OpenApiV3_0_XTypes['ParameterObject'] | OpenApiV3_0_XTypes['ReferenceObject'];
  export type V3_1_X = OpenApiV3_1_XTypes['ParameterObject'] | OpenApiV3_1_XTypes['ReferenceObject'];
}
declare namespace OpenApiRequestBodyObject {
  export type V3_0_X = OpenApiV3_0_XTypes['RequestBodyObject'] | OpenApiV3_0_XTypes['ReferenceObject'];
  export type V3_1_X = OpenApiV3_1_XTypes['RequestBodyObject'] | OpenApiV3_1_XTypes['ReferenceObject'];
}
declare namespace OpenApiResponseObject {
  export type V3_0_X = OpenApiV3_0_XTypes['ResponseObject'] | OpenApiV3_0_XTypes['ReferenceObject'];
  export type V3_1_X = OpenApiV3_1_XTypes['ResponseObject'] | OpenApiV3_1_XTypes['ReferenceObject'];
}
declare namespace OpenApiSchemaObject {
  export type V2_0_X = OpenApiV2_0_XTypes['SchemaObject'];
  export type V3_0_X = OpenApiV3_0_XTypes['SchemaObject'];
  export type V3_1_X = OpenApiV3_1_XTypes['SchemaObject'];
}
//#endregion
//#region src/plugins/shared/types/instance.d.ts
type BaseEvent = {
  /**
   * Path to the node, derived from the pointer.
   */
  _path: ReadonlyArray<string | number>;
  /**
   * Pointer to the node in the graph.
   */
  pointer: string;
  /**
   * Tags associated with the node.
   */
  tags?: Set<string>;
};
type WalkEvents = BaseEvent & ({
  method: keyof IR$1.PathItemObject;
  operation: IR$1.OperationObject;
  path: string;
  type: Extract<IrTopLevelKind, 'operation'>;
} | {
  name: string;
  parameter: IR$1.ParameterObject;
  type: Extract<IrTopLevelKind, 'parameter'>;
} | {
  name: string;
  requestBody: IR$1.RequestBodyObject;
  type: Extract<IrTopLevelKind, 'requestBody'>;
} | {
  name: string;
  schema: IR$1.SchemaObject;
  type: Extract<IrTopLevelKind, 'schema'>;
} | {
  server: IR$1.ServerObject;
  type: Extract<IrTopLevelKind, 'server'>;
} | {
  key: string;
  method: keyof IR$1.PathItemObject;
  operation: IR$1.OperationObject;
  type: Extract<IrTopLevelKind, 'webhook'>;
});
type WalkEvent<T$1 extends IrTopLevelKind = IrTopLevelKind> = Extract<WalkEvents, {
  type: T$1;
}>;
//#endregion
//#region src/plugins/shared/utils/instance.d.ts
declare class PluginInstance<T$1 extends Plugin.Types = Plugin.Types> {
  api: T$1['api'];
  config: Omit<T$1['resolvedConfig'], 'name' | 'output'>;
  context: IR$1.Context;
  dependencies: Required<Plugin.Config<T$1>>['dependencies'];
  private eventHooks;
  gen: IProject;
  private handler;
  name: T$1['resolvedConfig']['name'];
  output: string;
  /**
   * The package metadata and utilities for the current context, constructed
   * from the provided dependencies. Used for managing package-related
   * information such as name, version, and dependency resolution during
   * code generation.
   */
  package: IR$1.Context['package'];
  constructor(props: Pick<Required<Plugin.Config<T$1>>, 'config' | 'dependencies' | 'handler'> & {
    api?: T$1['api'];
    context: IR$1.Context<OpenApi$1.V2_0_X | OpenApi$1.V3_0_X | OpenApi$1.V3_1_X>;
    gen: IProject;
    name: string;
    output: string;
  });
  /**
   * Iterates over various input elements as specified by the event types, in
   * a specific order: servers, schemas, parameters, request bodies, then
   * operations.
   *
   * This ensures, for example, that schemas are always processed before
   * operations, which may reference them.
   *
   * @template T - The event type(s) to yield. Defaults to all event types.
   * @param events - The event types to walk over. If none are provided, all event types are included.
   * @param callback - Function to execute for each event.
   *
   * @example
   * // Iterate over all operations and schemas
   * plugin.forEach('operation', 'schema', (event) => {
   *   if (event.type === 'operation') {
   *     // handle operation
   *   } else if (event.type === 'schema') {
   *     // handle schema
   *   }
   * });
   */
  forEach<T extends IrTopLevelKind = IrTopLevelKind>(...args: [...events: ReadonlyArray<T$1>, callback: (event: WalkEvent<T$1>) => void]): void;
  forEach<T extends IrTopLevelKind = IrTopLevelKind>(...args: [...events: ReadonlyArray<T$1>, callback: (event: WalkEvent<T$1>) => void, options: WalkOptions<T$1>]): void;
  /**
   * Retrieves a registered plugin instance by its name from the context. This
   * allows plugins to access other plugins that have been registered in the
   * same context, enabling cross-plugin communication and dependencies.
   *
   * @param name Plugin name as defined in the configuration.
   * @returns The plugin instance if found, undefined otherwise.
   */
  getPlugin<T extends keyof PluginConfigMap>(name: T$1): T$1 extends any ? PluginInstance<PluginConfigMap[T$1]> | undefined : never;
  /**
   * Retrieves a registered plugin instance by its name from the context. This
   * allows plugins to access other plugins that have been registered in the
   * same context, enabling cross-plugin communication and dependencies.
   *
   * @param name Plugin name as defined in the configuration.
   * @returns The plugin instance if found, throw otherwise.
   */
  getPluginOrThrow<T extends keyof PluginConfigMap>(name: T$1): T$1 extends any ? PluginInstance<PluginConfigMap[T$1]> : never;
  getSymbol(symbolIdOrSelector: number | Selector): Symbol | undefined;
  hooks: {
    operation: {
      isMutation: (operation: IR$1.OperationObject) => boolean;
      isQuery: (operation: IR$1.OperationObject) => boolean;
    };
  };
  isSymbolRegistered(symbolIdOrSelector: number | Selector): boolean;
  referenceSymbol(symbolIdOrSelector: number | Selector): Symbol;
  registerSymbol(symbol: SymbolIn): Symbol;
  /**
   * Executes plugin's handler function.
   */
  run(): Promise<void>;
  setSymbolValue(symbol: Symbol, value: unknown): void;
  private buildEventHooks;
  private forEachError;
  private getSymbolFilePath;
  private isOperationKind;
}
//#endregion
//#region src/parser/types/hooks.d.ts
type Hooks = {
  /**
   * Event hooks.
   */
  events?: {
    /**
     * Triggered after executing a plugin handler.
     *
     * @param args Arguments object.
     * @returns void
     */
    'plugin:handler:after'?: (args: {
      /** Plugin that just executed. */
      plugin: PluginInstance;
    }) => void;
    /**
     * Triggered before executing a plugin handler.
     *
     * @param args Arguments object.
     * @returns void
     */
    'plugin:handler:before'?: (args: {
      /** Plugin about to execute. */
      plugin: PluginInstance;
    }) => void;
    /**
     * Triggered after registering a symbol.
     *
     * You can use this to perform actions after a symbol is registered.
     *
     * @param args Arguments object.
     * @returns void
     */
    'symbol:register:after'?: (args: {
      /** Plugin that registered the symbol. */
      plugin: PluginInstance;
      /** The registered symbol. */
      symbol: Symbol;
    }) => void;
    /**
     * Triggered before registering a symbol.
     *
     * You can use this to modify the symbol before it's registered.
     *
     * @param args Arguments object.
     * @returns void
     */
    'symbol:register:before'?: (args: {
      /** Plugin registering the symbol. */
      plugin: PluginInstance;
      /** Symbol to register. */
      symbol: SymbolIn;
    }) => void;
    /**
     * Triggered after setting a symbol value.
     *
     * You can use this to perform actions after a symbol's value is set.
     *
     * @param args Arguments object.
     * @returns void
     */
    'symbol:setValue:after'?: (args: {
      /** Plugin that set the symbol value. */
      plugin: PluginInstance;
      /** The symbol. */
      symbol: Symbol;
      /** The value that was set. */
      value: unknown;
    }) => void;
    /**
     * Triggered before setting a symbol value.
     *
     *  You can use this to modify the value before it's set.
     *
     * @param args Arguments object.
     * @returns void
     */
    'symbol:setValue:before'?: (args: {
      /** Plugin setting the symbol value. */
      plugin: PluginInstance;
      /** The symbol. */
      symbol: Symbol;
      /** The value to set. */
      value: unknown;
    }) => void;
  };
  /**
   * Hooks specifically for overriding operations behavior.
   *
   * Use these to classify operations, decide which outputs to generate,
   * or apply custom behavior to individual operations.
   */
  operations?: {
    /**
     * Classify the given operation into one or more kinds.
     *
     * Each kind determines how we treat the operation (e.g., generating queries or mutations).
     *
     * **Default behavior:**
     * - GET → 'query'
     * - DELETE, PATCH, POST, PUT → 'mutation'
     *
     * **Resolution order:**
     * 1. If `isQuery` or `isMutation` returns `true` or `false`, that overrides `getKind`.
     * 2. If `isQuery` or `isMutation` returns `undefined`, the result of `getKind` is used.
     *
     * @param operation - The operation object to classify.
     * @returns An array containing one or more of 'query' or 'mutation', or undefined to fallback to default behavior.
     * @example
     * ```ts
     * getKind: (operation) => {
     *   if (operation.method === 'get' && operation.path === '/search') {
     *     return ['query', 'mutation'];
     *   }
     *   return; // fallback to default behavior
     * }
     * ```
     */
    getKind?: (operation: IROperationObject) => ReadonlyArray<'mutation' | 'query'> | undefined;
    /**
     * Check if the given operation should be treated as a mutation.
     *
     * This affects which outputs are generated for the operation.
     *
     * **Default behavior:** DELETE, PATCH, POST, and PUT operations are treated as mutations.
     *
     * **Resolution order:** If this returns `true` or `false`, it overrides `getKind`.
     * If it returns `undefined`, `getKind` is used instead.
     *
     * @param operation - The operation object to check.
     * @returns true if the operation is a mutation, false otherwise, or undefined to fallback to `getKind`.
     * @example
     * ```ts
     * isMutation: (operation) => {
     *   if (operation.method === 'post' && operation.path === '/search') {
     *     return true;
     *   }
     *   return; // fallback to default behavior
     * }
     * ```
     */
    isMutation?: (operation: IROperationObject) => boolean | undefined;
    /**
     * Check if the given operation should be treated as a query.
     *
     * This affects which outputs are generated for the operation.
     *
     * **Default behavior:** GET operations are treated as queries.
     *
     * **Resolution order:** If this returns `true` or `false`, it overrides `getKind`.
     * If it returns `undefined`, `getKind` is used instead.
     *
     * @param operation - The operation object to check.
     * @returns true if the operation is a query, false otherwise, or undefined to fallback to `getKind`.
     * @example
     * ```ts
     * isQuery: (operation) => {
     *   if (operation.method === 'post' && operation.path === '/search') {
     *     return true;
     *   }
     *   return; // fallback to default behavior
     * }
     * ```
     */
    isQuery?: (operation: IROperationObject) => boolean | undefined;
  };
  /**
   * Hooks specifically for overriding symbols behavior.
   *
   * Use these to customize file placement.
   */
  symbols?: {
    /**
     * Optional output strategy to override default plugin behavior.
     *
     * Use this to route generated symbols to specific files.
     *
     * @returns The file path to output the symbol to, or undefined to fallback to default behavior.
     */
    getFilePath?: (symbol: Symbol) => string | undefined;
  };
};
//#endregion
//#region src/types/client.d.ts
interface Operation extends Omit<Operation$1, 'tags'> {
  service: string;
}
interface Service extends Pick<Model, '$refs' | 'imports' | 'name'> {
  operations: Operation[];
}
interface Client extends Omit<Client$1, 'operations'> {
  services: Service[];
}
//#endregion
//#region src/plugins/types.d.ts
type PluginClientNames = '@hey-api/client-angular' | '@hey-api/client-axios' | '@hey-api/client-fetch' | '@hey-api/client-next' | '@hey-api/client-nuxt' | '@hey-api/client-ofetch' | 'legacy/angular' | 'legacy/axios' | 'legacy/fetch' | 'legacy/node' | 'legacy/xhr';
type PluginValidatorNames = 'arktype' | 'valibot' | 'zod';
type PluginNames = PluginClientNames | '@angular/common' | '@hey-api/schemas' | '@hey-api/sdk' | '@hey-api/transformers' | '@hey-api/typescript' | '@pinia/colada' | '@tanstack/angular-query-experimental' | '@tanstack/react-query' | '@tanstack/solid-query' | '@tanstack/svelte-query' | '@tanstack/vue-query' | 'fastify' | PluginValidatorNames;
type AnyPluginName = PluginNames | (string & {});
type PluginTag = 'client' | 'transformer' | 'validator';
type PluginContext = {
  package: Package;
  pluginByTag: <T extends AnyPluginName | boolean = AnyPluginName>(tag: PluginTag, props?: {
    defaultPlugin?: Exclude<T, boolean>;
    errorMessage?: string;
  }) => Exclude<T, boolean> | undefined;
  valueToObject: ValueToObject;
};
type BaseApi = Record<string, unknown>;
type BaseConfig = {
  /**
   * Should the exports from the plugin's file be re-exported in the index
   * barrel file?
   */
  exportFromIndex?: boolean;
  name: AnyPluginName;
  /**
   * Optional hooks to override default plugin behavior.
   *
   * Use these to classify resources, control which outputs are generated,
   * or provide custom behavior for specific resources.
   */
  '~hooks'?: Hooks;
};

/**
 * Public Plugin API.
 */
declare namespace Plugin {
  export type Config<T extends Types> = Pick<T, 'api'> & {
    config: Omit<T['config'], 'name' | 'output'>;
    /**
     * Dependency plugins will be always processed, regardless of whether user
     * explicitly defines them in their `plugins` config.
     */
    dependencies?: ReadonlyArray<AnyPluginName>;
    handler: Handler<T>;
    handlerLegacy?: LegacyHandler<T>;
    name: T['config']['name'];
    output?: NonNullable<T['config']['output']>;
    /**
     * Resolves static configuration values into their runtime equivalents. For
     * example, when `validator` is set to `true`, it figures out which plugin
     * should be used for validation.
     */
    resolveConfig?: (plugin: Omit<Plugin.Config<T>, 'dependencies'> & {
      dependencies: Set<AnyPluginName>;
    }, context: PluginContext) => void;
    /**
     * Optional tags can be used to help with deciding plugin order and resolving
     * plugin configuration options.
     */
    tags?: ReadonlyArray<PluginTag>;
  };
  export type ConfigWithName<T extends Types> = Omit<Config<T>, 'config'> & {
    config: Omit<T['config'], 'output'>;
  };

  /** @deprecated use `definePluginConfig()` instead */
  export type DefineConfig<Config extends BaseConfig, ResolvedConfig extends BaseConfig = Config> = (config?: UserConfig<Omit<Config, 'name'>>) => Omit<Plugin.Config<Config, ResolvedConfig>, 'name'> & {
    /**
     * Cast name to `any` so it doesn't throw type error in `plugins` array.
     * We could allow any `string` as plugin `name` in the object syntax, but
     * that TypeScript trick would cause all string methods to appear as
     * suggested auto completions, which is undesirable.
     */
    name: any;
  };

  /**
   * Generic wrapper for plugin hooks.
   */
  export type Hooks = Pick<BaseConfig, '~hooks'>;
  export interface Name<Name extends PluginNames> {
    name: Name;
  }
  export type Types<Config extends BaseConfig = BaseConfig, ResolvedConfig extends BaseConfig = Config, Api extends BaseApi = never> = ([Api] extends [never] ? {
    api?: BaseApi;
  } : {
    api: Api;
  }) & {
    config: Config;
    resolvedConfig: ResolvedConfig;
  };

  /**
   * Users cannot modify output file path to avoid risk of conflicts.
   */
  export type UserConfig<Config extends BaseConfig> = Omit<Config, 'output'>;
}
type DefinePlugin<Config$15 extends BaseConfig = BaseConfig, ResolvedConfig$1 extends BaseConfig = Config$15, Api$1 extends BaseApi = never> = {
  Config: Plugin.Config<Plugin.Types<Config$15, ResolvedConfig$1, Api$1>>;
  Handler: (args: {
    plugin: PluginInstance<Plugin.Types<Config$15, ResolvedConfig$1, Api$1>>;
  }) => void;
  Instance: PluginInstance<Plugin.Types<Config$15, ResolvedConfig$1, Api$1>>;
  /**
   * Plugin implementation for legacy parser.
   *
   * @deprecated
   */
  LegacyHandler: (args: {
    client: Client;
    files: Files;
    openApi: OpenApi;
    plugin: PluginInstance<Plugin.Types<Config$15, ResolvedConfig$1, Api$1>>;
  }) => void;
  Types: Plugin.Types<Config$15, ResolvedConfig$1, Api$1>;
};
//#endregion
//#region src/plugins/@hey-api/sdk/api.d.ts
type SelectorType$12 = 'buildClientParams' | 'class' | 'Client' | 'Composable' | 'formDataBodySerializer' | 'function' | 'Injectable' | 'Options' | 'urlSearchParamsBodySerializer';
type IApi$12 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `buildClientParams`: never
   *  - `class`: current class name
   *  - `Client`: never
   *  - `Composable`: never
   *  - `formDataBodySerializer`: never
   *  - `function`: `operation.id` string
   *  - `Injectable`: never
   *  - `Options`: never
   *  - `urlSearchParamsBodySerializer`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$12, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/sdk/types.d.ts
type UserConfig$14 = Plugin.Name<'@hey-api/sdk'> & Plugin.Hooks & {
  /**
   * Group operation methods into classes? When enabled, you can select which
   * classes to export with `sdk.include` and/or transform their names with
   * `sdk.classNameBuilder`.
   *
   * Note that by enabling this option, your SDKs will **NOT**
   * support {@link https://developer.mozilla.org/docs/Glossary/Tree_shaking tree-shaking}.
   * For this reason, it is disabled by default.
   *
   * @default false
   */
  asClass?: boolean;
  /**
   * Should the generated functions contain auth mechanisms? You may want to
   * disable this option if you're handling auth yourself or defining it
   * globally on the client and want to reduce the size of generated code.
   *
   * @default true
   */
  auth?: boolean;
  /**
   * Customize the generated class names. The name variable is obtained from
   * your OpenAPI specification tags or `instance` value.
   *
   * This option has no effect if `sdk.asClass` is `false`.
   */
  classNameBuilder?: StringName;
  /**
   * How should we structure your SDK? By default, we try to infer the ideal
   * structure using `operationId` keywords. If you prefer a flatter structure,
   * you can set `classStructure` to `off` to disable this behavior.
   *
   * @default 'auto'
   */
  classStructure?: 'auto' | 'off';
  /**
   * Use an internal client instance to send HTTP requests? This is useful if
   * you don't want to manually pass the client to each SDK function.
   *
   * You can customize the selected client output through its plugin. You can
   * also set `client` to `true` to automatically choose the client from your
   * defined plugins. If we can't detect a client plugin when using `true`, we
   * will default to `@hey-api/client-fetch`.
   *
   * @default true
   */
  client?: PluginClientNames | boolean;
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default true
   */
  exportFromIndex?: boolean;
  /**
   * Include only service classes with names matching regular expression
   *
   * This option has no effect if `sdk.asClass` is `false`.
   */
  include?: string;
  /**
   * Set `instance` to create an instantiable SDK. Using `true` will use the
   * default instance name; in practice, you want to define your own by passing
   * a string value.
   *
   * @default false
   */
  instance?: string | boolean;
  /**
   * Customise the name of methods within the service. By default,
   * {@link IR.OperationObject.id} or {@link Operation.name} is used.
   */
  methodNameBuilder?: (operation: IR$1.OperationObject | Operation) => string;
  // TODO: parser - rename operationId option to something like inferId?: boolean
  /**
   * Use operation ID to generate operation names?
   *
   * @default true
   */
  operationId?: boolean;
  /** @deprecated - this is an experimental feature, do not use */
  params_EXPERIMENTAL?: 'default' | 'experiment';
  /**
   * **This feature works only with the Fetch client**
   *
   * Should we return only data or multiple fields (data, error, response, etc.)?
   *
   * @default 'fields'
   */
  responseStyle?: 'data' | 'fields';
  /**
   * Transform response data before returning. This is useful if you want to
   * convert for example ISO strings into Date objects. However, transformation
   * adds runtime overhead, so it's not recommended to use unless necessary.
   *
   * You can customize the selected transformer output through its plugin. You
   * can also set `transformer` to `true` to automatically choose the
   * transformer from your defined plugins.
   *
   * @default false
   */
  transformer?: '@hey-api/transformers' | boolean;
  /**
   * Validate request and/or response data against schema before returning.
   * This is useful if you want to ensure the request and/or response conforms
   * to a desired shape. However, validation adds runtime overhead, so it's
   * not recommended to use unless absolutely necessary.
   *
   * You can customize the validator output through its plugin. You can also
   * set `validator` to `true` to automatically choose the validator from your
   * defined plugins.
   *
   * You can enable/disable validation for requests and responses separately
   * by setting `validator` to an object `{ request, response }`.
   *
   * Ensure you have declared the selected library as a dependency to avoid
   * errors.
   *
   * @default false
   */
  validator?: PluginValidatorNames | boolean | {
    /**
     * Validate request data against schema before sending.
     *
     * Can be a validator plugin name or boolean (true to auto-select, false
     * to disable).
     *
     * @default false
     */
    request?: PluginValidatorNames | boolean;
    /**
     * Validate response data against schema before returning.
     *
     * Can be a validator plugin name or boolean (true to auto-select, false
     * to disable).
     *
     * @default false
     */
    response?: PluginValidatorNames | boolean;
  };

  // DEPRECATED OPTIONS BELOW

  /**
   * **This feature works only with the legacy parser**
   *
   * Filter endpoints to be included in the generated SDK. The provided
   * string should be a regular expression where matched results will be
   * included in the output. The input pattern this string will be tested
   * against is `{method} {path}`. For example, you can match
   * `POST /api/v1/foo` with `^POST /api/v1/foo$`.
   *
   * @deprecated
   */
  // eslint-disable-next-line typescript-sort-keys/interface
  filter?: string;
  /**
   * Define shape of returned value from service calls
   *
   * @deprecated
   * @default 'body'
   */
  response?: 'body' | 'response';
};
type Config$13 = Plugin.Name<'@hey-api/sdk'> & Plugin.Hooks & {
  /**
   * Group operation methods into classes? When enabled, you can select which
   * classes to export with `sdk.include` and/or transform their names with
   * `sdk.classNameBuilder`.
   *
   * Note that by enabling this option, your SDKs will **NOT**
   * support {@link https://developer.mozilla.org/docs/Glossary/Tree_shaking tree-shaking}.
   * For this reason, it is disabled by default.
   *
   * @default false
   */
  asClass: boolean;
  /**
   * Should the generated functions contain auth mechanisms? You may want to
   * disable this option if you're handling auth yourself or defining it
   * globally on the client and want to reduce the size of generated code.
   *
   * @default true
   */
  auth: boolean;
  /**
   * Customize the generated class names. The name variable is obtained from
   * your OpenAPI specification tags or `instance` value.
   *
   * This option has no effect if `sdk.asClass` is `false`.
   */
  classNameBuilder: StringName;
  /**
   * How should we structure your SDK? By default, we try to infer the ideal
   * structure using `operationId` keywords. If you prefer a flatter structure,
   * you can set `classStructure` to `off` to disable this behavior.
   *
   * @default 'auto'
   */
  classStructure: 'auto' | 'off';
  /**
   * Use an internal client instance to send HTTP requests? This is useful if
   * you don't want to manually pass the client to each SDK function.
   *
   * You can customize the selected client output through its plugin. You can
   * also set `client` to `true` to automatically choose the client from your
   * defined plugins. If we can't detect a client plugin when using `true`, we
   * will default to `@hey-api/client-fetch`.
   *
   * @default true
   */
  client: PluginClientNames | false;
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default true
   */
  exportFromIndex: boolean;
  /**
   * Include only service classes with names matching regular expression
   *
   * This option has no effect if `sdk.asClass` is `false`.
   */
  include: string | undefined;
  /**
   * Set `instance` to create an instantiable SDK. Using `true` will use the
   * default instance name; in practice, you want to define your own by passing
   * a string value.
   *
   * @default false
   */
  instance: string | boolean;
  /**
   * Customise the name of methods within the service. By default,
   * {@link IR.OperationObject.id} or {@link Operation.name} is used.
   */
  methodNameBuilder?: (operation: IR$1.OperationObject | Operation) => string;
  // TODO: parser - rename operationId option to something like inferId?: boolean
  /**
   * Use operation ID to generate operation names?
   *
   * @default true
   */
  operationId: boolean;
  /** @deprecated - this is an experimental feature, do not use */
  params_EXPERIMENTAL: 'default' | 'experiment';
  /**
   * **This feature works only with the Fetch client**
   *
   * Should we return only data or multiple fields (data, error, response, etc.)?
   *
   * @default 'fields'
   */
  responseStyle: 'data' | 'fields';
  /**
   * Transform response data before returning. This is useful if you want to
   * convert for example ISO strings into Date objects. However, transformation
   * adds runtime overhead, so it's not recommended to use unless necessary.
   *
   * You can customize the selected transformer output through its plugin. You
   * can also set `transformer` to `true` to automatically choose the
   * transformer from your defined plugins.
   *
   * @default false
   */
  transformer: '@hey-api/transformers' | false;
  /**
   * Validate request and/or response data against schema before returning.
   * This is useful if you want to ensure the request and/or response conforms
   * to a desired shape. However, validation adds runtime overhead, so it's
   * not recommended to use unless absolutely necessary.
   */
  validator: {
    /**
     * The validator plugin to use for request validation, or false to disable.
     *
     * @default false
     */
    request: PluginValidatorNames | false;
    /**
     * The validator plugin to use for response validation, or false to disable.
     *
     * @default false
     */
    response: PluginValidatorNames | false;
  };

  // DEPRECATED OPTIONS BELOW

  /**
   * **This feature works only with the legacy parser**
   *
   * Filter endpoints to be included in the generated SDK. The provided
   * string should be a regular expression where matched results will be
   * included in the output. The input pattern this string will be tested
   * against is `{method} {path}`. For example, you can match
   * `POST /api/v1/foo` with `^POST /api/v1/foo$`.
   *
   * @deprecated
   */
  // eslint-disable-next-line typescript-sort-keys/interface
  filter?: string;
  /**
   * Define shape of returned value from service calls
   *
   * @deprecated
   * @default 'body'
   */
  response: 'body' | 'response';
};
type HeyApiSdkPlugin = DefinePlugin<UserConfig$14, Config$13, IApi$12>;
//#endregion
//#region src/plugins/@hey-api/transformers/api.d.ts
type SelectorType$11 = 'response' | 'response-ref';
type IApi$11 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `response`: `operation.id` string
   *  - `response-ref`: `$ref` JSON pointer
   * @returns Selector array
   */
  selector: (type: SelectorType$11, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/transformers/expressions.d.ts
type ExpressionTransformer = ({
  config,
  dataExpression,
  schema
}: {
  config: Omit<UserConfig$13, 'name'>;
  dataExpression?: ts.Expression | string;
  schema: IR$1.SchemaObject;
}) => Array<ts.Expression> | undefined;
//#endregion
//#region src/plugins/@hey-api/transformers/types.d.ts
/**
 * Returns the TypeScript type node for a schema with a specific format.
 * If undefined is returned, the default type will be used.
 */
type TypeTransformer = ({
  schema
}: {
  schema: IR$1.SchemaObject;
}) => ts.TypeNode | undefined;
type UserConfig$13 = Plugin.Name<'@hey-api/transformers'> & Plugin.Hooks & {
  /**
   * Convert long integers into BigInt values?
   *
   * @default true
   */
  bigInt?: boolean;
  /**
   * Convert date strings into Date objects?
   *
   * @default true
   */
  dates?: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Custom transforms to apply to the generated code.
   */
  transformers?: ReadonlyArray<ExpressionTransformer>;
  /**
   * Custom type transformers that modify the TypeScript types generated.
   */
  typeTransformers?: ReadonlyArray<TypeTransformer>;
};
type Config$12 = Plugin.Name<'@hey-api/transformers'> & Plugin.Hooks & {
  /**
   * Convert long integers into BigInt values?
   *
   * @default true
   */
  bigInt: boolean;
  /**
   * Convert date strings into Date objects?
   *
   * @default true
   */
  dates: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Custom transforms to apply to the generated code.
   */
  transformers: ReadonlyArray<ExpressionTransformer>;
  /**
   * Custom type transformers that modify the TypeScript types generated.
   */
  typeTransformers: ReadonlyArray<TypeTransformer>;
};
type HeyApiTransformersPlugin = DefinePlugin<UserConfig$13, Config$12, IApi$11>;
//#endregion
//#region src/plugins/@hey-api/typescript/shared/types.d.ts
type IrSchemaToAstOptions = {
  plugin: HeyApiTypeScriptPlugin['Instance'];
  state: ToRefs<PluginState>;
};
type PluginState = Pick<Required<SymbolMeta>, 'path'> & Pick<Partial<SymbolMeta>, 'tags'>;
//#endregion
//#region src/plugins/@hey-api/typescript/v1/plugin.d.ts
declare const irSchemaToAst: ({
  plugin,
  schema,
  state
}: IrSchemaToAstOptions & {
  schema: IR$1.SchemaObject;
}) => ts.TypeNode;
//#endregion
//#region src/plugins/@hey-api/typescript/api.d.ts
type SelectorType$10 = 'ClientOptions' | 'data' | 'error' | 'errors' | 'ref' | 'response' | 'responses' | 'TypeID' | 'webhook-payload' | 'webhook-request' | 'Webhooks';
type IApi$10 = {
  schemaToType: (args: Parameters<typeof irSchemaToAst>[0]) => ts.TypeNode;
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `ClientOptions`: never
   *  - `data`: `operation.id` string
   *  - `error`: `operation.id` string
   *  - `errors`: `operation.id` string
   *  - `ref`: `$ref` JSON pointer
   *  - `response`: `operation.id` string
   *  - `responses`: `operation.id` string
   *  - `TypeID`: `type` name string
   *  - `webhook-payload`: `operation.id` string
   *  - `webhook-request`: `operation.id` string
   *  - `Webhooks`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$10, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@hey-api/typescript/types.d.ts
type EnumsType = 'javascript' | 'typescript' | 'typescript-const';
type UserConfig$12 = Plugin.Name<'@hey-api/typescript'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'PascalCase'
   */
  case?: Exclude<StringCase, 'SCREAMING_SNAKE_CASE'>;
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared types that can be referenced across
   * requests and responses.
   *
   * Can be:
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default '{{name}}'
   */
  definitions?: StringName | {
    /**
     * The casing convention to use for generated definition names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Custom naming pattern for generated definition names. The name variable
     * is obtained from the schema name.
     *
     * @default '{{name}}'
     */
    name?: StringName;
  };
  /**
   * By default, enums are emitted as types to preserve runtime-free output.
   *
   * However, you may want to generate enums as JavaScript objects or
   * TypeScript enums for runtime usage, interoperability, or integration with
   * other tools.
   *
   * @default false
   */
  enums?: boolean | EnumsType | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'SCREAMING_SNAKE_CASE'
     */
    case?: StringCase;
    /**
     * When generating enums as JavaScript objects, they'll contain a null
     * value if they're nullable. This might be undesirable if you want to do
     * `Object.values(Foo)` and have all values be of the same type.
     *
     * This setting is disabled by default to preserve the source schemas.
     *
     * @default false
     */
    constantsIgnoreNull?: boolean;
    /**
     * Whether to generate runtime enums.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Specifies the output mode for generated enums.
     *
     * Can be:
     * - `javascript`: Generates JavaScript objects
     * - `typescript`: Generates TypeScript enums
     * - `typescript-const`: Generates TypeScript const enums
     *
     * @default 'javascript'
     */
    mode?: EnumsType;
  };
  /**
   * Configuration for error-specific types.
   *
   * Controls generation of types for error response bodies and status codes.
   *
   * Can be:
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default '{{name}}Errors'
   */
  errors?: StringName | {
    /**
     * The casing convention to use for generated error type names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Custom naming pattern for generated error type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Error'
     */
    error?: StringName;
    /**
     * Custom naming pattern for generated error type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Errors'
     */
    name?: StringName;
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default true
   */
  exportFromIndex?: boolean;
  /**
   * Configuration for request-specific types.
   *
   * Controls generation of types for request bodies, query parameters, path
   * parameters, and headers.
   *
   * Can be:
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default '{{name}}Data'
   */
  requests?: StringName | {
    /**
     * The casing convention to use for generated request type names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Custom naming pattern for generated request type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Data'
     */
    name?: StringName;
  };
  /**
   * Configuration for response-specific types.
   *
   * Controls generation of types for response bodies and status codes.
   *
   * Can be:
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default '{{name}}Responses'
   */
  responses?: StringName | {
    /**
     * The casing convention to use for generated response type names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Custom naming pattern for generated response type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Responses'
     */
    name?: StringName;
    /**
     * Custom naming pattern for generated response type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Response'
     */
    response?: StringName;
  };
  /**
   * The top type to use for untyped or unspecified schema values.
   *
   * Can be:
   * - `unknown` (default): safe top type, you must narrow before use
   * - `any`: disables type checking, can be used anywhere
   *
   * @default 'unknown'
   */
  topType?: 'any' | 'unknown';
  /**
   * Configuration for webhook-specific types.
   *
   * Controls generation of types for webhook payloads and webhook requests.
   *
   * Can be:
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default '{{name}}WebhookRequest'
   */
  webhooks?: StringName | {
    /**
     * The casing convention to use for generated webhook type names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Custom naming pattern for generated webhook type names. The name
     * variable is obtained from the webhook key.
     *
     * @default '{{name}}WebhookRequest'
     */
    name?: StringName;
    /**
     * Custom naming pattern for generated webhook type names. The name
     * variable is obtained from the webhook key.
     *
     * @default '{{name}}WebhookPayload'
     */
    payload?: StringName;
  };

  // DEPRECATED OPTIONS BELOW

  /**
   * **This feature works only with the legacy parser**
   *
   * Include only types matching regular expression.
   *
   * @deprecated
   */
  // eslint-disable-next-line typescript-sort-keys/interface
  include?: string;
  /**
   * **This feature works only with the legacy parser**
   *
   * Use your preferred naming pattern
   *
   * @deprecated
   * @default 'preserve'
   */
  style?: 'PascalCase' | 'preserve';
  /**
   * **This feature works only with the legacy parser**
   *
   * Generate a tree of types containing all operations? It will be named
   * $OpenApiTs.
   *
   * @deprecated
   * @default false
   */
  tree?: boolean;
};
type Config$11 = Plugin.Name<'@hey-api/typescript'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'PascalCase'
   */
  case: Exclude<StringCase, 'SCREAMING_SNAKE_CASE'>;
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared types that can be referenced across
   * requests and responses.
   */
  definitions: {
    /**
     * The casing convention to use for generated definition names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Custom naming pattern for generated definition names. The name variable
     * is obtained from the schema name.
     *
     * @default '{{name}}'
     */
    name: StringName;
  };
  /**
   * By default, enums are emitted as types to preserve runtime-free output.
   *
   * However, you may want to generate enums as JavaScript objects or
   * TypeScript enums for runtime usage, interoperability, or integration with
   * other tools.
   */
  enums: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'SCREAMING_SNAKE_CASE'
     */
    case: StringCase;
    /**
     * When generating enums as JavaScript objects, they'll contain a null
     * value if they're nullable. This might be undesirable if you want to do
     * `Object.values(Foo)` and have all values be of the same type.
     *
     * This setting is disabled by default to preserve the source schemas.
     *
     * @default false
     */
    constantsIgnoreNull: boolean;
    /**
     * Whether to generate runtime enums.
     *
     * @default false
     */
    enabled: boolean;
    /**
     * Specifies the output mode for generated enums.
     *
     * Can be:
     * - `javascript`: Generates JavaScript objects
     * - `typescript`: Generates TypeScript enums
     * - `typescript-const`: Generates TypeScript const enums
     *
     * @default 'javascript'
     */
    mode: EnumsType;
  };
  /**
   * Configuration for error-specific types.
   *
   * Controls generation of types for error response bodies and status codes.
   *
   * Can be:
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   */
  errors: {
    /**
     * The casing convention to use for generated error type names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Custom naming pattern for generated error type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Error'
     */
    error: StringName;
    /**
     * Custom naming pattern for generated error type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Errors'
     */
    name: StringName;
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default true
   */
  exportFromIndex: boolean;
  /**
   * Configuration for request-specific types.
   *
   * Controls generation of types for request bodies, query parameters, path
   * parameters, and headers.
   */
  requests: {
    /**
     * The casing convention to use for generated request type names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Custom naming pattern for generated request type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Data'
     */
    name: StringName;
  };
  /**
   * Configuration for response-specific types.
   *
   * Controls generation of types for response bodies and status codes.
   */
  responses: {
    /**
     * The casing convention to use for generated response type names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Custom naming pattern for generated response type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Responses'
     */
    name: StringName;
    /**
     * Custom naming pattern for generated response type names. The name
     * variable is obtained from the operation name.
     *
     * @default '{{name}}Response'
     */
    response: StringName;
  };
  /**
   * The top type to use for untyped or unspecified schema values.
   *
   * @default 'unknown'
   */
  topType: 'any' | 'unknown';
  /**
   * Configuration for webhook-specific types.
   *
   * Controls generation of types for webhook payloads and webhook requests.
   */
  webhooks: {
    /**
     * The casing convention to use for generated webhook type names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Custom naming pattern for generated webhook type names. The name
     * variable is obtained from the webhook key.
     *
     * @default '{{name}}WebhookRequest'
     */
    name: StringName;
    /**
     * Custom naming pattern for generated webhook type names. The name
     * variable is obtained from the webhook key.
     *
     * @default '{{name}}WebhookPayload'
     */
    payload: StringName;
  };

  // DEPRECATED OPTIONS BELOW

  /**
   * **This feature works only with the legacy parser**
   *
   * Include only types matching regular expression.
   *
   * @deprecated
   */
  // eslint-disable-next-line typescript-sort-keys/interface
  include?: string;
  /**
   * **This feature works only with the legacy parser**
   *
   * Use your preferred naming pattern
   *
   * @deprecated
   * @default 'preserve'
   */
  style: 'PascalCase' | 'preserve';
  /**
   * **This feature works only with the legacy parser**
   *
   * Generate a tree of types containing all operations? It will be named
   * $OpenApiTs.
   *
   * @deprecated
   * @default false
   */
  tree: boolean;
};
type HeyApiTypeScriptPlugin = DefinePlugin<UserConfig$12, Config$11, IApi$10>;
//#endregion
//#region src/plugins/@pinia/colada/api.d.ts
type SelectorType$9 = '_JSONValue' | 'AxiosError' | 'createQueryKey' | 'defineQueryOptions' | 'QueryKey' | 'queryOptionsFn' | 'serializeQueryKeyValue' | 'UseMutationOptions' | 'UseQueryOptions';
type IApi$9 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `_JSONValue`: never
   *  - `AxiosError`: never
   *  - `createQueryKey`: never
   *  - `defineQueryOptions`: never
   *  - `QueryKey`: never
   *  - `queryOptionsFn`: `operation.id` string
   *  - `serializeQueryKeyValue`: never
   *  - `UseMutationOptions`: never
   *  - `UseQueryOptions`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$9, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@pinia/colada/types.d.ts
type UserConfig$11 = Plugin.Name<'@pinia/colada'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from SDK functions to the generated Pinia Colada code?
   *
   * Duplicating comments this way is useful so you don't need to drill into
   * the underlying SDK function to learn what it does or whether it's
   * deprecated. You can set this option to `false` if you prefer less
   * comment duplication.
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Configuration for generated mutation options helpers.
   *
   * See {@link https://pinia-colada.esm.dev/guide/mutations.html Mutations}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  mutationOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     */
    name?: StringName;
  };
  /**
   * Configuration for generated query keys.
   *
   * See {@link https://pinia-colada.esm.dev/guide/query-keys.html Query Keys}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     */
    name?: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated query options helpers.
   *
   * See {@link https://pinia-colada.esm.dev/guide/queries.html Queries}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Query'
     */
    name?: StringName;
  };
};
type Config$10 = Plugin.Name<'@pinia/colada'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from SDK functions to the generated Pinia Colada code?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Resolved configuration for generated mutation options helpers.
   */
  mutationOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: ((operation: IR$1.OperationObject) => Record<string, unknown>) | undefined;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated query keys.
   *
   * See {@link https://pinia-colada.esm.dev/guide/query-keys.html Query Keys}
   */
  queryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     */
    name: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated query options helpers.
   *
   * See {@link https://pinia-colada.esm.dev/guide/queries.html Queries}
   */
  queryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: ((operation: IR$1.OperationObject) => Record<string, unknown>) | undefined;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Query'
     */
    name: StringName;
  };
};
type PiniaColadaPlugin = DefinePlugin<UserConfig$11, Config$10, IApi$9>;
//#endregion
//#region src/plugins/@tanstack/angular-query-experimental/api.d.ts
type SelectorType$8 = 'AxiosError' | 'createInfiniteParams' | 'createQueryKey' | 'DefaultError' | 'infiniteQueryOptions' | 'InfiniteData' | 'MutationOptions' | 'queryOptions' | 'queryOptionsFn' | 'QueryKey' | 'useQuery';
type IApi$8 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `AxiosError`: never
   *  - `createInfiniteParams`: never
   *  - `createQueryKey`: never
   *  - `DefaultError`: never
   *  - `infiniteQueryOptions`: never
   *  - `InfiniteData`: never
   *  - `MutationOptions`: never
   *  - `queryOptions`: never
   *  - `queryOptionsFn`: `operation.id` string
   *  - `QueryKey`: never
   *  - `useQuery`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$8, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@tanstack/angular-query-experimental/types.d.ts
type UserConfig$10 = Plugin.Name<'@tanstack/angular-query-experimental'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * Duplicating comments this way is useful so you don't need to drill into
   * the underlying SDK function to learn what it does or whether it's
   * deprecated. You can set this option to `false` if you prefer less
   * comment duplication.
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Configuration for generated infinite query key helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
     */
    name?: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated infinite query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
     */
    name?: StringName;
  };
  /**
   * Configuration for generated mutation options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/useMutation}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  mutationOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/useMutation
     */
    name?: StringName;
  };
  /**
   * Configuration for generated query keys.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/queryKey}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryKey
     */
    name?: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/angular/reference/queryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryOptions
     */
    name?: StringName;
  };
};
type Config$9 = Plugin.Name<'@tanstack/angular-query-experimental'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Resolved configuration for generated infinite query key helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
   */
  infiniteQueryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
     */
    name: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated infinite query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
   */
  infiniteQueryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/infiniteQueryOptions
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated mutation options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/angular/reference/useMutation
   */
  mutationOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/useMutation
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated query keys.
   *
   * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryKey
   */
  queryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryKey
     */
    name: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryOptions
   */
  queryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/angular/reference/queryOptions
     */
    name: StringName;
  };
};
type TanStackAngularQueryPlugin = DefinePlugin<UserConfig$10, Config$9, IApi$8>;
//#endregion
//#region src/plugins/@tanstack/react-query/api.d.ts
type SelectorType$7 = 'AxiosError' | 'createInfiniteParams' | 'createQueryKey' | 'DefaultError' | 'infiniteQueryOptions' | 'InfiniteData' | 'MutationOptions' | 'queryOptions' | 'queryOptionsFn' | 'QueryKey' | 'useQuery';
type IApi$7 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `AxiosError`: never
   *  - `createInfiniteParams`: never
   *  - `createQueryKey`: never
   *  - `DefaultError`: never
   *  - `infiniteQueryOptions`: never
   *  - `InfiniteData`: never
   *  - `MutationOptions`: never
   *  - `queryOptions`: never
   *  - `queryOptionsFn`: `operation.id` string
   *  - `QueryKey`: never
   *  - `useQuery`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$7, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@tanstack/react-query/types.d.ts
type UserConfig$9 = Plugin.Name<'@tanstack/react-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * Duplicating comments this way is useful so you don't need to drill into
   * the underlying SDK function to learn what it does or whether it's
   * deprecated. You can set this option to `false` if you prefer less
   * comment duplication.
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Configuration for generated infinite query key helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
     *
     * @default '{{name}}InfiniteQueryKey'
     */
    name?: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated infinite query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
     *
     * @default '{{name}}InfiniteOptions'
     */
    name?: StringName;
  };
  /**
   * Configuration for generated mutation options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useMutation useMutation}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  mutationOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useMutation useMutation}
     *
     * @default '{{name}}Mutation'
     */
    name?: StringName;
  };
  /**
   * Configuration for generated query keys.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/queryKey queryKey}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/guides/query-keys Query Keys}
     *
     * @default '{{name}}QueryKey'
     */
    name?: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/queryOptions queryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/queryOptions queryOptions}
     *
     * @default '{{name}}Options'
     */
    name?: StringName;
  };
  /**
   * Configuration for generated `useQuery()` function helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useQuery useQuery}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default false
   */
  useQuery?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate `useQuery()` function helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated `useQuery()` function names. The name variable is
     * obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useQuery useQuery}
     *
     * @default 'use{{name}}Query'
     */
    name?: StringName;
  };
};
type Config$8 = Plugin.Name<'@tanstack/react-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Resolved configuration for generated infinite query key helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
   */
  infiniteQueryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
     *
     * @default '{{name}}InfiniteQueryKey'
     */
    name: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated infinite query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
   */
  infiniteQueryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/infiniteQueryOptions infiniteQueryOptions}
     *
     * @default '{{name}}InfiniteOptions'
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated mutation options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useMutation useMutation}
   */
  mutationOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useMutation useMutation}
     *
     * @default '{{name}}Mutation'
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated query keys.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/guides/query-keys Query Keys}
   */
  queryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/guides/query-keys Query Keys}
     *
     * @default '{{name}}QueryKey'
     */
    name: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/queryOptions queryOptions}
   */
  queryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/queryOptions queryOptions}
     *
     * @default '{{name}}Options'
     */
    name: StringName;
  };
  /**
   * Configuration for generated `useQuery()` function helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useQuery useQuery}
   */
  useQuery: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate `useQuery()` function helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated `useQuery()` function names. The name variable is
     * obtained from the SDK function name.
     *
     * See {@link https://tanstack.com/query/v5/docs/framework/react/reference/useQuery useQuery}
     *
     * @default 'use{{name}}Query'
     */
    name: StringName;
  };
};
type TanStackReactQueryPlugin = DefinePlugin<UserConfig$9, Config$8, IApi$7>;
//#endregion
//#region src/plugins/@tanstack/solid-query/api.d.ts
type SelectorType$6 = 'AxiosError' | 'createInfiniteParams' | 'createQueryKey' | 'DefaultError' | 'infiniteQueryOptions' | 'InfiniteData' | 'MutationOptions' | 'queryOptions' | 'queryOptionsFn' | 'QueryKey' | 'useQuery';
type IApi$6 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `AxiosError`: never
   *  - `createInfiniteParams`: never
   *  - `createQueryKey`: never
   *  - `DefaultError`: never
   *  - `infiniteQueryOptions`: never
   *  - `InfiniteData`: never
   *  - `MutationOptions`: never
   *  - `queryOptions`: never
   *  - `queryOptionsFn`: `operation.id` string
   *  - `QueryKey`: never
   *  - `useQuery`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$6, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@tanstack/solid-query/types.d.ts
type UserConfig$8 = Plugin.Name<'@tanstack/solid-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * Duplicating comments this way is useful so you don't need to drill into
   * the underlying SDK function to learn what it does or whether it's
   * deprecated. You can set this option to `false` if you prefer less
   * comment duplication.
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Configuration for generated infinite query key helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery
     */
    name?: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated infinite query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery
     */
    name?: StringName;
  };
  /**
   * Configuration for generated mutation options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/solid/reference/createMutation}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  mutationOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createMutation
     */
    name?: StringName;
  };
  /**
   * Configuration for generated query keys.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/solid/reference/queryKey}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/queryKey
     */
    name?: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/solid/reference/createQuery}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createQuery
     */
    name?: StringName;
  };
};
type Config$7 = Plugin.Name<'@tanstack/solid-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Resolved configuration for generated infinite query key helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery
   */
  infiniteQueryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery
     */
    name: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated infinite query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery
   */
  infiniteQueryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createInfiniteQuery
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated mutation options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createMutation
   */
  mutationOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createMutation
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated query keys.
   *
   * @see https://tanstack.com/query/v5/docs/framework/solid/reference/queryKey
   */
  queryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/queryKey
     */
    name: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createQuery
   */
  queryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/solid/reference/createQuery
     */
    name: StringName;
  };
};
type TanStackSolidQueryPlugin = DefinePlugin<UserConfig$8, Config$7, IApi$6>;
//#endregion
//#region src/plugins/@tanstack/svelte-query/api.d.ts
type SelectorType$5 = 'AxiosError' | 'createInfiniteParams' | 'createQueryKey' | 'DefaultError' | 'infiniteQueryOptions' | 'InfiniteData' | 'MutationOptions' | 'queryOptions' | 'queryOptionsFn' | 'QueryKey' | 'useQuery';
type IApi$5 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `AxiosError`: never
   *  - `createInfiniteParams`: never
   *  - `createQueryKey`: never
   *  - `DefaultError`: never
   *  - `infiniteQueryOptions`: never
   *  - `InfiniteData`: never
   *  - `MutationOptions`: never
   *  - `queryOptions`: never
   *  - `queryOptionsFn`: `operation.id` string
   *  - `QueryKey`: never
   *  - `useQuery`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$5, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@tanstack/svelte-query/types.d.ts
type UserConfig$7 = Plugin.Name<'@tanstack/svelte-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * Duplicating comments this way is useful so you don't need to drill into
   * the underlying SDK function to learn what it does or whether it's
   * deprecated. You can set this option to `false` if you prefer less
   * comment duplication.
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Configuration for generated infinite query key helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery
     */
    name?: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated infinite query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery
     */
    name?: StringName;
  };
  /**
   * Configuration for generated mutation options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createmutation}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  mutationOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createmutation
     */
    name?: StringName;
  };
  /**
   * Configuration for generated query keys.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/react/guides/query-keys}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/react/guides/query-keys
     */
    name?: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createquery}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createquery
     */
    name?: StringName;
  };
};
type Config$6 = Plugin.Name<'@tanstack/svelte-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Resolved configuration for generated infinite query key helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery
   */
  infiniteQueryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery
     */
    name: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated infinite query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery
   */
  infiniteQueryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createinfinitequery
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated mutation options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createmutation
   */
  mutationOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createmutation
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated query keys.
   *
   * @see https://tanstack.com/query/v5/docs/framework/react/guides/query-keys
   */
  queryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/react/guides/query-keys
     */
    name: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createquery
   */
  queryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/svelte/reference/functions/createquery
     */
    name: StringName;
  };
};
type TanStackSvelteQueryPlugin = DefinePlugin<UserConfig$7, Config$6, IApi$5>;
//#endregion
//#region src/plugins/@tanstack/vue-query/api.d.ts
type SelectorType$4 = 'AxiosError' | 'createInfiniteParams' | 'createQueryKey' | 'DefaultError' | 'infiniteQueryOptions' | 'InfiniteData' | 'MutationOptions' | 'queryOptions' | 'queryOptionsFn' | 'QueryKey' | 'useQuery';
type IApi$4 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `AxiosError`: never
   *  - `createInfiniteParams`: never
   *  - `createQueryKey`: never
   *  - `DefaultError`: never
   *  - `infiniteQueryOptions`: never
   *  - `InfiniteData`: never
   *  - `MutationOptions`: never
   *  - `queryOptions`: never
   *  - `queryOptionsFn`: `operation.id` string
   *  - `QueryKey`: never
   *  - `useQuery`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$4, value?: string) => Selector;
};
//#endregion
//#region src/plugins/@tanstack/vue-query/types.d.ts
type UserConfig$6 = Plugin.Name<'@tanstack/vue-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * Duplicating comments this way is useful so you don't need to drill into
   * the underlying SDK function to learn what it does or whether it's
   * deprecated. You can set this option to `false` if you prefer less
   * comment duplication.
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Configuration for generated infinite query key helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions
     */
    name?: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated infinite query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  infiniteQueryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions
     */
    name?: StringName;
  };
  /**
   * Configuration for generated mutation options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/vue/reference/useMutation}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  mutationOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/useMutation
     */
    name?: StringName;
  };
  /**
   * Configuration for generated query keys.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/vue/reference/queryKey}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryKeys?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/queryKey
     */
    name?: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags?: boolean;
  };
  /**
   * Configuration for generated query options helpers.
   *
   * See {@link https://tanstack.com/query/v5/docs/framework/vue/reference/queryOptions}
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  queryOptions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported?: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta?: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/queryOptions
     */
    name?: StringName;
  };
};
type Config$5 = Plugin.Name<'@tanstack/vue-query'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from SDK functions to the generated TanStack Query code?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Should the exports from the generated files be re-exported in the index barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Resolved configuration for generated infinite query key helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions
   */
  infiniteQueryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query key helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated infinite query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteQueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions
     */
    name: StringName;
    /**
     * Whether to include operation tags in infinite query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated infinite query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions
   */
  infiniteQueryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate infinite query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated infinite query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated infinite query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}InfiniteOptions'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/infiniteQueryOptions
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated mutation options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/vue/reference/useMutation
   */
  mutationOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate mutation options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated mutation options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated mutation options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Mutation'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/useMutation
     */
    name: StringName;
  };
  /**
   * Resolved configuration for generated query keys.
   *
   * @see https://tanstack.com/query/v5/docs/framework/vue/reference/queryKey
   */
  queryKeys: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query keys.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated query key names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}QueryKey'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/queryKey
     */
    name: StringName;
    /**
     * Whether to include operation tags in query keys.
     * This will make query keys larger but provides better cache invalidation capabilities.
     *
     * @default false
     */
    tags: boolean;
  };
  /**
   * Resolved configuration for generated query options helpers.
   *
   * @see https://tanstack.com/query/v5/docs/framework/vue/reference/queryOptions
   */
  queryOptions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate query options helpers.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Whether to export generated symbols.
     *
     * @default true
     */
    exported: boolean;
    /**
     * Custom function to generate metadata for the operation.
     * Can return any valid meta object that will be included in the generated query options.
     *
     * @param operation - The operation object containing all available metadata
     * @returns A meta object with any properties you want to include
     *
     * @example
     * ```typescript
     * meta: (operation) => ({
     *   customField: operation.id,
     *   isDeprecated: operation.deprecated,
     *   tags: operation.tags,
     *   customObject: {
     *     method: operation.method,
     *     path: operation.path
     *   }
     * })
     * ```
     *
     * @default undefined
     */
    meta: (operation: IR$1.OperationObject) => Record<string, unknown>;
    /**
     * Custom naming pattern for generated query options names. The name variable is
     * obtained from the SDK function name.
     *
     * @default '{{name}}Options'
     * @see https://tanstack.com/query/v5/docs/framework/vue/reference/queryOptions
     */
    name: StringName;
  };
};
type TanStackVueQueryPlugin = DefinePlugin<UserConfig$6, Config$5, IApi$4>;
//#endregion
//#region src/plugins/arktype/shared/types.d.ts
type ValidatorArgs$2 = {
  operation: IR$1.OperationObject;
  plugin: ArktypePlugin['Instance'];
};
//#endregion
//#region src/plugins/arktype/api.d.ts
type SelectorType$3 = 'data' | 'external' | 'ref' | 'responses' | 'type-infer-data' | 'type-infer-ref' | 'type-infer-responses' | 'type-infer-webhook-request' | 'webhook-request';
type IApi$3 = {
  createRequestValidator: (args: ValidatorArgs$2) => ts.ArrowFunction | undefined;
  createResponseValidator: (args: ValidatorArgs$2) => ts.ArrowFunction | undefined;
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `data`: `operation.id` string
   *  - `external`: external modules
   *  - `ref`: `$ref` JSON pointer
   *  - `responses`: `operation.id` string
   *  - `type-infer-data`: `operation.id` string
   *  - `type-infer-ref`: `$ref` JSON pointer
   *  - `type-infer-responses`: `operation.id` string
   *  - `type-infer-webhook-request`: `operation.id` string
   *  - `webhook-request`: `operation.id` string
   * @returns Selector array
   */
  selector: (type: SelectorType$3, value?: string) => Selector;
};
//#endregion
//#region src/plugins/arktype/types.d.ts
type UserConfig$5 = Plugin.Name<'arktype'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'PascalCase'
   */
  case?: StringCase;
  /**
   * Add comments from input to the generated Arktype schemas?
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared Arktype schemas that can be referenced
   * across requests and responses.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   */
  definitions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Arktype schemas for reusable definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the schema name.
     *
     * @default '{{name}}'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}'
         */
        name?: StringName;
      };
    };
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Enable Arktype metadata support? It's often useful to associate a schema
   * with some additional metadata for documentation, code generation, AI
   * structured outputs, form validation, and other purposes.
   *
   * @default false
   */
  metadata?: boolean;
  /**
   * Configuration for request-specific Arktype schemas.
   *
   * Controls generation of Arktype schemas for request bodies, query parameters, path
   * parameters, and headers.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  requests?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Arktype schemas for request definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the operation name.
     *
     * @default '{{name}}Data'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}Data'
         */
        name?: StringName;
      };
    };
  };
  /**
   * Configuration for response-specific Arktype schemas.
   *
   * Controls generation of Arktype schemas for response bodies, error responses,
   * and status codes.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  responses?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Arktype schemas for response definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the operation name.
     *
     * @default '{{name}}Response'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}Response'
         */
        name?: StringName;
      };
    };
  };
  /**
   * Configuration for TypeScript type generation from Arktype schemas.
   *
   * Controls generation of TypeScript types based on the generated Arktype schemas.
   */
  types?: {
    /**
     * Configuration for `infer` types.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default false
     */
    infer?: boolean | StringName | {
      /**
       * The casing convention to use for generated type names.
       *
       * @default 'PascalCase'
       */
      case?: StringCase;
      /**
       * Whether to generate TypeScript types from Arktype schemas.
       *
       * @default true
       */
      enabled?: boolean;
    };
  };
  /**
   * Configuration for webhook-specific Arktype schemas.
   *
   * Controls generation of Arktype schemas for webhook payloads.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  webhooks?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Arktype schemas for webhook definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the webhook key.
     *
     * @default '{{name}}WebhookRequest'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}WebhookRequest'
         */
        name?: StringName;
      };
    };
  };
};
type Config$4 = Plugin.Name<'arktype'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'PascalCase'
   */
  case: StringCase;
  /**
   * Add comments from input to the generated Arktype schemas?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared Arktype schemas that can be referenced across
   * requests and responses.
   */
  definitions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Whether to generate Arktype schemas for reusable definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the schema name.
     *
     * @default '{{name}}'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}'
         */
        name: StringName;
      };
    };
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Enable Arktype metadata support? It's often useful to associate a schema with
   * some additional metadata for documentation, code generation, AI
   * structured outputs, form validation, and other purposes.
   *
   * @default false
   */
  metadata: boolean;
  /**
   * Configuration for request-specific Arktype schemas.
   *
   * Controls generation of Arktype schemas for request bodies, query parameters, path
   * parameters, and headers.
   */
  requests: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Whether to generate Arktype schemas for request definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the operation name.
     *
     * @default '{{name}}Data'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}Data'
         */
        name: StringName;
      };
    };
  };
  /**
   * Configuration for response-specific Arktype schemas.
   *
   * Controls generation of Arktype schemas for response bodies, error responses,
   * and status codes.
   */
  responses: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Whether to generate Arktype schemas for response definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the operation name.
     *
     * @default '{{name}}Response'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}Response'
         */
        name: StringName;
      };
    };
  };
  /**
   * Configuration for TypeScript type generation from Arktype schemas.
   *
   * Controls generation of TypeScript types based on the generated Arktype schemas.
   */
  types: {
    /**
     * Configuration for `infer` types.
     */
    infer: {
      /**
       * The casing convention to use for generated type names.
       *
       * @default 'PascalCase'
       */
      case: StringCase;
      /**
       * Whether to generate TypeScript types from Arktype schemas.
       *
       * @default true
       */
      enabled: boolean;
    };
  };
  /**
   * Configuration for webhook-specific Arktype schemas.
   *
   * Controls generation of Arktype schemas for webhook payloads.
   */
  webhooks: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'PascalCase'
     */
    case: StringCase;
    /**
     * Whether to generate Arktype schemas for webhook definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * is obtained from the webhook key.
     *
     * @default '{{name}}WebhookRequest'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Arktype schemas.
     *
     * Controls generation of TypeScript types based on the generated Arktype schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Arktype schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Arktype schema name.
         *
         * @default '{{name}}WebhookRequest'
         */
        name: StringName;
      };
    };
  };
};
type ArktypePlugin = DefinePlugin<UserConfig$5, Config$4, IApi$3>;
//#endregion
//#region src/plugins/fastify/api.d.ts
type SelectorType$2 = 'RouteHandler';
type IApi$2 = {
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `RouteHandler`: never
   * @returns Selector array
   */
  selector: (type: SelectorType$2, value?: string) => Selector;
};
//#endregion
//#region src/plugins/fastify/types.d.ts
type UserConfig$4 = Plugin.Name<'fastify'> & Plugin.Hooks & {
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
};
type FastifyPlugin = DefinePlugin<UserConfig$4, UserConfig$4, IApi$2>;
//#endregion
//#region src/plugins/valibot/shared/types.d.ts
type ValidatorArgs$1 = {
  operation: IR$1.OperationObject;
  plugin: ValibotPlugin['Instance'];
};
//#endregion
//#region src/plugins/valibot/api.d.ts
type SelectorType$1 = 'data' | 'external' | 'ref' | 'responses' | 'webhook-request';
type IApi$1 = {
  createRequestValidator: (args: ValidatorArgs$1) => ts.ArrowFunction | undefined;
  createResponseValidator: (args: ValidatorArgs$1) => ts.ArrowFunction | undefined;
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `data`: `operation.id` string
   *  - `external`: external modules
   *  - `ref`: `$ref` JSON pointer
   *  - `responses`: `operation.id` string
   *  - `webhook-request`: `operation.id` string
   * @returns Selector array
   */
  selector: (type: SelectorType$1, value?: string) => Selector;
};
//#endregion
//#region src/plugins/valibot/types.d.ts
type UserConfig$3 = Plugin.Name<'valibot'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from input to the generated Valibot schemas?
   *
   * @default true
   */
  comments?: boolean;
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared Valibot schemas that can be referenced
   * across requests and responses.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   */
  definitions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Valibot schemas for reusable definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the schema name.
     *
     * @default 'v{{name}}'
     */
    name?: StringName;
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Enable Valibot metadata support? It's often useful to associate a schema
   * with some additional metadata for documentation, code generation, AI
   * structured outputs, form validation, and other purposes.
   *
   * @default false
   */
  metadata?: boolean;
  /**
   * Configuration for request-specific Valibot schemas.
   *
   * Controls generation of Valibot schemas for request bodies, query
   * parameters, path parameters, and headers.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   */
  requests?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Valibot schemas for request definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the operation name.
     *
     * @default 'v{{name}}Data'
     */
    name?: StringName;
  };
  /**
   * Configuration for response-specific Valibot schemas.
   *
   * Controls generation of Valibot schemas for response bodies, error
   * responses, and status codes.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   */
  responses?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Valibot schemas for response definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the operation name.
     *
     * @default 'v{{name}}Response'
     */
    name?: StringName;
  };
  /**
   * Configuration for webhook-specific Valibot schemas.
   *
   * Controls generation of Valibot schemas for webhook payloads.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  webhooks?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Valibot schemas for webhook definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the webhook key.
     *
     * @default 'v{{name}}WebhookRequest'
     */
    name?: StringName;
  };
};
type Config$3 = Plugin.Name<'valibot'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from input to the generated Valibot schemas?
   *
   * @default true
   */
  comments: boolean;
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared Valibot schemas that can be referenced
   * across requests and responses.
   */
  definitions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Valibot schemas for reusable definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the schema name.
     *
     * @default 'v{{name}}'
     */
    name: StringName;
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Enable Valibot metadata support? It's often useful to associate a schema
   * with some additional metadata for documentation, code generation, AI
   * structured outputs, form validation, and other purposes.
   *
   * @default false
   */
  metadata: boolean;
  /**
   * Configuration for request-specific Valibot schemas.
   *
   * Controls generation of Valibot schemas for request bodies, query
   * parameters, path parameters, and headers.
   */
  requests: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Valibot schemas for request definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the operation name.
     *
     * @default 'v{{name}}Data'
     */
    name: StringName;
  };
  /**
   * Configuration for response-specific Valibot schemas.
   *
   * Controls generation of Valibot schemas for response bodies, error
   * responses, and status codes.
   */
  responses: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Valibot schemas for response definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the operation name.
     *
     * @default 'v{{name}}Response'
     */
    name: StringName;
  };
  /**
   * Configuration for webhook-specific Valibot schemas.
   *
   * Controls generation of Valibot schemas for webhook payloads.
   */
  webhooks: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Valibot schemas for webhook definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the webhook key.
     *
     * @default 'v{{name}}WebhookRequest'
     */
    name: StringName;
  };
};
type ValibotPlugin = DefinePlugin<UserConfig$3, Config$3, IApi$1>;
//#endregion
//#region src/plugins/zod/shared/types.d.ts
type ValidatorArgs = {
  operation: IR$1.OperationObject;
  plugin: ZodPlugin['Instance'];
};
//#endregion
//#region src/plugins/zod/api.d.ts
type SelectorType = 'data' | 'external' | 'ref' | 'responses' | 'type-infer-data' | 'type-infer-ref' | 'type-infer-responses' | 'type-infer-webhook-request' | 'webhook-request';
type IApi = {
  createRequestValidator: (args: ValidatorArgs) => ts.ArrowFunction | undefined;
  createResponseValidator: (args: ValidatorArgs) => ts.ArrowFunction | undefined;
  /**
   * @param type Selector type.
   * @param value Depends on `type`:
   *  - `data`: `operation.id` string
   *  - `external`: external modules
   *  - `ref`: `$ref` JSON pointer
   *  - `responses`: `operation.id` string
   *  - `type-infer-data`: `operation.id` string
   *  - `type-infer-ref`: `$ref` JSON pointer
   *  - `type-infer-responses`: `operation.id` string
   *  - `type-infer-webhook-request`: `operation.id` string
   *  - `webhook-request`: `operation.id` string
   * @returns Selector array
   */
  selector: (type: SelectorType, value?: string) => Selector;
};
//#endregion
//#region src/plugins/zod/types.d.ts
type UserConfig$2 = Plugin.Name<'zod'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case?: StringCase;
  /**
   * Add comments from input to the generated Zod schemas?
   *
   * @default true
   */
  comments?: boolean;
  /**
   * The compatibility version to target for generated output.
   *
   * Can be:
   * - `4`: [Zod 4](https://zod.dev/packages/zod) (default).
   * - `3`: [Zod 3](https://v3.zod.dev/).
   * - `'mini'`: [Zod Mini](https://zod.dev/packages/mini).
   *
   * @default 4
   */
  compatibilityVersion?: 3 | 4 | 'mini';
  /**
   * Configuration for date handling in generated Zod schemas.
   *
   * Controls how date values are processed and validated using Zod's
   * date validation features.
   */
  dates?: {
    /**
     * Whether to allow unqualified (timezone-less) datetimes:
     *
     * When enabled, Zod will accept datetime strings without timezone information.
     * When disabled, Zod will require timezone information in datetime strings.
     *
     * @default false
     */
    local?: boolean;
    /**
     * Whether to include timezone offset information when handling dates.
     *
     * When enabled, date strings will preserve timezone information.
     * When disabled, dates will be treated as local time.
     *
     * @default false
     */
    offset?: boolean;
  };
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared Zod schemas that can be referenced across
   * requests and responses.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  definitions?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Zod schemas for reusable definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the schema name.
     *
     * @default 'z{{name}}'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}ZodType'
         */
        name?: StringName;
      };
    };
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex?: boolean;
  /**
   * Enable Zod metadata support? It's often useful to associate a schema with
   * some additional metadata for documentation, code generation, AI
   * structured outputs, form validation, and other purposes.
   *
   * @default false
   */
  metadata?: boolean;
  /**
   * Configuration for request-specific Zod schemas.
   *
   * Controls generation of Zod schemas for request bodies, query parameters, path
   * parameters, and headers.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  requests?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Zod schemas for request definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the operation name.
     *
     * @default 'z{{name}}Data'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}DataZodType'
         */
        name?: StringName;
      };
    };
  };
  /**
   * Configuration for response-specific Zod schemas.
   *
   * Controls generation of Zod schemas for response bodies, error responses,
   * and status codes.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  responses?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Zod schemas for response definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the operation name.
     *
     * @default 'z{{name}}Response'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}ResponseZodType'
         */
        name?: StringName;
      };
    };
  };
  /**
   * Configuration for TypeScript type generation from Zod schemas.
   *
   * Controls generation of TypeScript types based on the generated Zod schemas.
   */
  types?: {
    /**
     * Configuration for `infer` types.
     *
     * Can be:
     * - `boolean`: Shorthand for `{ enabled: boolean }`
     * - `string` or `function`: Shorthand for `{ name: string | function }`
     * - `object`: Full configuration object
     *
     * @default false
     */
    infer?: boolean | StringName | {
      /**
       * The casing convention to use for generated type names.
       *
       * @default 'PascalCase'
       */
      case?: StringCase;
      /**
       * Whether to generate TypeScript types from Zod schemas.
       *
       * @default true
       */
      enabled?: boolean;
    };
  };
  /**
   * Configuration for webhook-specific Zod schemas.
   *
   * Controls generation of Zod schemas for webhook payloads.
   *
   * Can be:
   * - `boolean`: Shorthand for `{ enabled: boolean }`
   * - `string` or `function`: Shorthand for `{ name: string | function }`
   * - `object`: Full configuration object
   *
   * @default true
   */
  webhooks?: boolean | StringName | {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case?: StringCase;
    /**
     * Whether to generate Zod schemas for webhook definitions.
     *
     * @default true
     */
    enabled?: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable
     * is obtained from the webhook key.
     *
     * @default 'z{{name}}WebhookRequest'
     */
    name?: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types?: {
      /**
       * Configuration for `infer` types.
       *
       * Can be:
       * - `boolean`: Shorthand for `{ enabled: boolean }`
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default false
       */
      infer?: boolean | StringName | {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case?: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled?: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}WebhookRequestZodType'
         */
        name?: StringName;
      };
    };
  };
};
type Config$2 = Plugin.Name<'zod'> & Plugin.Hooks & {
  /**
   * The casing convention to use for generated names.
   *
   * @default 'camelCase'
   */
  case: StringCase;
  /**
   * Add comments from input to the generated Zod schemas?
   *
   * @default true
   */
  comments: boolean;
  /**
   * The compatibility version to target for generated output.
   *
   * Can be:
   * - `4`: [Zod 4](https://zod.dev/packages/zod) (default).
   * - `3`: [Zod 3](https://v3.zod.dev/).
   * - `'mini'`: [Zod Mini](https://zod.dev/packages/mini).
   *
   * @default 4
   */
  compatibilityVersion: 3 | 4 | 'mini';
  /**
   * Configuration for date handling in generated Zod schemas.
   *
   * Controls how date values are processed and validated using Zod's
   * date validation features.
   */
  dates: {
    /**
     * Whether to allow unqualified (timezone-less) datetimes:
     *
     * When enabled, Zod will accept datetime strings without timezone information.
     * When disabled, Zod will require timezone information in datetime strings.
     *
     * @default false
     */
    local: boolean;
    /**
     * Whether to include timezone offset information when handling dates.
     *
     * When enabled, date strings will preserve timezone information.
     * When disabled, dates will be treated as local time.
     *
     * @default false
     */
    offset: boolean;
  };
  /**
   * Configuration for reusable schema definitions.
   *
   * Controls generation of shared Zod schemas that can be referenced across
   * requests and responses.
   */
  definitions: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Zod schemas for reusable definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the schema name.
     *
     * @default 'z{{name}}'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}ZodType'
         */
        name: StringName;
      };
    };
  };
  /**
   * Should the exports from the generated files be re-exported in the index
   * barrel file?
   *
   * @default false
   */
  exportFromIndex: boolean;
  /**
   * Enable Zod metadata support? It's often useful to associate a schema with
   * some additional metadata for documentation, code generation, AI
   * structured outputs, form validation, and other purposes.
   *
   * @default false
   */
  metadata: boolean;
  /**
   * Configuration for request-specific Zod schemas.
   *
   * Controls generation of Zod schemas for request bodies, query parameters, path
   * parameters, and headers.
   */
  requests: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Zod schemas for request definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the operation name.
     *
     * @default 'z{{name}}Data'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}DataZodType'
         */
        name: StringName;
      };
    };
  };
  /**
   * Configuration for response-specific Zod schemas.
   *
   * Controls generation of Zod schemas for response bodies, error responses,
   * and status codes.
   */
  responses: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Zod schemas for response definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * obtained from the operation name.
     *
     * @default 'z{{name}}Response'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}ResponseZodType'
         */
        name: StringName;
      };
    };
  };
  /**
   * Configuration for TypeScript type generation from Zod schemas.
   *
   * Controls generation of TypeScript types based on the generated Zod schemas.
   */
  types: {
    /**
     * Configuration for `infer` types.
     */
    infer: {
      /**
       * The casing convention to use for generated type names.
       *
       * @default 'PascalCase'
       */
      case: StringCase;
      /**
       * Whether to generate TypeScript types from Zod schemas.
       *
       * @default true
       */
      enabled: boolean;
    };
  };
  /**
   * Configuration for webhook-specific Zod schemas.
   *
   * Controls generation of Zod schemas for webhook payloads.
   */
  webhooks: {
    /**
     * The casing convention to use for generated names.
     *
     * @default 'camelCase'
     */
    case: StringCase;
    /**
     * Whether to generate Zod schemas for webhook definitions.
     *
     * @default true
     */
    enabled: boolean;
    /**
     * Custom naming pattern for generated schema names. The name variable is
     * is obtained from the webhook key.
     *
     * @default 'z{{name}}WebhookRequest'
     */
    name: StringName;
    /**
     * Configuration for TypeScript type generation from Zod schemas.
     *
     * Controls generation of TypeScript types based on the generated Zod schemas.
     */
    types: {
      /**
       * Configuration for `infer` types.
       */
      infer: {
        /**
         * The casing convention to use for generated type names.
         *
         * @default 'PascalCase'
         */
        case: StringCase;
        /**
         * Whether to generate TypeScript types from Zod schemas.
         *
         * @default true
         */
        enabled: boolean;
        /**
         * Custom naming pattern for generated type names. The name variable is
         * obtained from the Zod schema name.
         *
         * @default '{{name}}WebhookRequestZodType'
         */
        name: StringName;
      };
    };
  };
};
type ZodPlugin = DefinePlugin<UserConfig$2, Config$2, IApi>;
//#endregion
//#region src/plugins/config.d.ts
interface PluginConfigMap {
  '@angular/common': AngularCommonPlugin['Types'];
  '@hey-api/client-angular': HeyApiClientAngularPlugin['Types'];
  '@hey-api/client-axios': HeyApiClientAxiosPlugin['Types'];
  '@hey-api/client-fetch': HeyApiClientFetchPlugin['Types'];
  '@hey-api/client-next': HeyApiClientNextPlugin['Types'];
  '@hey-api/client-nuxt': HeyApiClientNuxtPlugin['Types'];
  '@hey-api/client-ofetch': HeyApiClientOfetchPlugin['Types'];
  '@hey-api/schemas': HeyApiSchemasPlugin['Types'];
  '@hey-api/sdk': HeyApiSdkPlugin['Types'];
  '@hey-api/transformers': HeyApiTransformersPlugin['Types'];
  '@hey-api/typescript': HeyApiTypeScriptPlugin['Types'];
  '@pinia/colada': PiniaColadaPlugin['Types'];
  '@tanstack/angular-query-experimental': TanStackAngularQueryPlugin['Types'];
  '@tanstack/react-query': TanStackReactQueryPlugin['Types'];
  '@tanstack/solid-query': TanStackSolidQueryPlugin['Types'];
  '@tanstack/svelte-query': TanStackSvelteQueryPlugin['Types'];
  '@tanstack/vue-query': TanStackVueQueryPlugin['Types'];
  arktype: ArktypePlugin['Types'];
  fastify: FastifyPlugin['Types'];
  'legacy/angular': HeyApiClientLegacyAngularPlugin['Types'];
  'legacy/axios': HeyApiClientLegacyAxiosPlugin['Types'];
  'legacy/fetch': HeyApiClientLegacyFetchPlugin['Types'];
  'legacy/node': HeyApiClientLegacyNodePlugin['Types'];
  'legacy/xhr': HeyApiClientLegacyXhrPlugin['Types'];
  valibot: ValibotPlugin['Types'];
  zod: ZodPlugin['Types'];
}
//#endregion
//#region src/ir/context.d.ts
declare class Context<Spec$1 extends Record<string, any> = any> {
  /**
   * Configuration for parsing and generating the output. This
   * is a mix of user-provided and default values.
   */
  config: Config$1;
  /**
   * The code generation project instance used to manage files, symbols,
   */
  gen: Project;
  /**
   * The dependency graph built from the intermediate representation.
   */
  graph: Graph | undefined;
  /**
   * Intermediate representation model obtained from `spec`.
   */
  ir: IR$1.Model;
  /**
   * Logger instance.
   */
  logger: Logger;
  /**
   * The package metadata and utilities for the current context, constructed
   * from the provided dependencies. Used for managing package-related
   * information such as name, version, and dependency resolution during
   * code generation.
   */
  package: Package;
  /**
   * A map of registered plugin instances, keyed by plugin name. Plugins are
   * registered through the `registerPlugin` method and can be accessed by
   * their configured name from the config.
   */
  plugins: Partial<Record<PluginNames, PluginInstance<PluginConfigMap[keyof PluginConfigMap]>>>;
  /**
   * Resolved specification from `input`.
   */
  spec: Spec$1;
  constructor({
    config,
    dependencies,
    logger,
    spec
  }: {
    config: Config$1;
    dependencies: Record<string, string>;
    logger: Logger;
    spec: Spec$1;
  });
  /**
   * Returns a resolved and dereferenced schema from `spec`.
   */
  dereference<T>(schema: {
    $ref: string;
  }): T;
  /**
   * Registers a new plugin to the global context.
   *
   * @param name Plugin name.
   * @returns Registered plugin instance.
   */
  private registerPlugin;
  /**
   * Registers all plugins in the order specified by the configuration and returns
   * an array of the registered PluginInstance objects. Each plugin is instantiated
   * and added to the context's plugins map.
   *
   * @returns {ReadonlyArray<PluginInstance>} An array of registered plugin instances in order.
   */
  registerPlugins(): ReadonlyArray<PluginInstance>;
  resolveIrRef<T>($ref: string): T;
  /**
   * Returns a resolved reference from `spec`.
   */
  resolveRef<T>($ref: string): T;
}
//#endregion
//#region src/ir/mediaType.d.ts
type IRMediaType = 'form-data' | 'json' | 'text' | 'url-search-params' | 'octet-stream';
//#endregion
//#region src/ir/types.d.ts
interface IRBodyObject {
  mediaType: string;
  /**
   * Does body control pagination? We handle only simple values
   * for now, up to 1 nested field.
   */
  pagination?: boolean | string;
  required?: boolean;
  schema: IRSchemaObject;
  type?: IRMediaType;
}
interface IRComponentsObject {
  parameters?: Record<string, IRParameterObject>;
  requestBodies?: Record<string, IRRequestBodyObject>;
  schemas?: Record<string, IRSchemaObject>;
}
interface IROperationObject {
  body?: IRBodyObject;
  deprecated?: boolean;
  description?: string;
  id: string;
  method: keyof IRPathItemObject;
  operationId?: string;
  parameters?: IRParametersObject;
  path: keyof IRPathsObject;
  responses?: IRResponsesObject;
  security?: ReadonlyArray<IRSecurityObject>;
  servers?: ReadonlyArray<IRServerObject>;
  summary?: string;
  tags?: ReadonlyArray<string>;
}
interface IRParametersObject {
  cookie?: Record<string, IRParameterObject>;
  header?: Record<string, IRParameterObject>;
  path?: Record<string, IRParameterObject>;
  query?: Record<string, IRParameterObject>;
}
interface IRParameterObject extends Pick<JsonSchemaDraft2020_12, 'deprecated' | 'description'> {
  /**
   * Determines whether the parameter value SHOULD allow reserved characters, as defined by RFC3986 `:/?#[]@!$&'()*+,;=` to be included without percent-encoding. The default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of `contentType` (implicit or explicit) SHALL be ignored.
   */
  allowReserved?: boolean;
  /**
   * When this is true, property values of type `array` or `object` generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When `style` is `form`, the default value is `true`. For all other styles, the default value is `false`. This property SHALL be ignored if the request body media type is not `application/x-www-form-urlencoded` or `multipart/form-data`. If a value is explicitly defined, then the value of `contentType` (implicit or explicit) SHALL be ignored.
   */
  explode: boolean;
  /**
   * Endpoint parameters must specify their location.
   */
  location: 'cookie' | 'header' | 'path' | 'query';
  name: string;
  /**
   * Does this parameter control pagination? We handle only simple values
   * for now, up to 1 nested field.
   */
  pagination?: boolean | string;
  required?: boolean;
  schema: IRSchemaObject;
  /**
   * Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of `in`): for `query` - `form`; for `path` - `simple`; for `header` - `simple`; for `cookie` - `form`.
   */
  style: 'deepObject' | 'form' | 'label' | 'matrix' | 'pipeDelimited' | 'simple' | 'spaceDelimited';
}
interface IRPathsObject {
  [path: `/${string}`]: IRPathItemObject;
}
interface IRPathItemObject {
  delete?: IROperationObject;
  get?: IROperationObject;
  head?: IROperationObject;
  options?: IROperationObject;
  patch?: IROperationObject;
  post?: IROperationObject;
  put?: IROperationObject;
  trace?: IROperationObject;
}
interface IRRequestBodyObject extends Pick<JsonSchemaDraft2020_12, 'description'> {
  required?: boolean;
  schema: IRSchemaObject;
}
interface IRResponsesObject {
  /**
   * Any {@link https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#http-status-codes HTTP status code} can be used as the property name, but only one property per code, to describe the expected response for that HTTP status code. This field MUST be enclosed in quotation marks (for example, "200") for compatibility between JSON and YAML. To define a range of response codes, this field MAY contain the uppercase wildcard character `X`. For example, `2XX` represents all response codes between `[200-299]`. Only the following range definitions are allowed: `1XX`, `2XX`, `3XX`, `4XX`, and `5XX`. If a response is defined using an explicit code, the explicit code definition takes precedence over the range definition for that code.
   */
  [statusCode: string]: IRResponseObject | undefined;
  /**
   * The documentation of responses other than the ones declared for specific HTTP response codes. Use this field to cover undeclared responses.
   */
  default?: IRResponseObject;
}
interface IRResponseObject {
  // TODO: parser - handle headers, links, and possibly other media types?
  mediaType?: string;
  schema: IRSchemaObject;
}
interface IRSchemaObject extends Pick<JsonSchemaDraft2020_12, '$ref' | 'const' | 'default' | 'deprecated' | 'description' | 'exclusiveMaximum' | 'exclusiveMinimum' | 'maximum' | 'maxItems' | 'maxLength' | 'minimum' | 'minItems' | 'minLength' | 'pattern' | 'required' | 'title' | 'example'> {
  /**
   * If the schema is intended to be used as an object property, it can be
   * marked as read-only or write-only. This value controls whether the schema
   * receives the "readonly" TypeScript keyword.
   */
  accessScope?: 'read' | 'write';
  /**
   * If type is `object`, `additionalProperties` can be used to either define
   * a schema for properties not included in `properties` or disallow such
   * properties altogether.
   */
  additionalProperties?: IRSchemaObject | false;
  /**
   * Any string value is accepted as `format`.
   */
  format?: JsonSchemaDraft2020_12['format'] | 'binary' | 'integer';
  /**
   * If schema resolves into multiple items instead of a simple `type`, they
   * will be included in `items` array.
   */
  items?: ReadonlyArray<IRSchemaObject>;
  /**
   * When resolving a list of items, we need to know the relationship between
   * them. `logicalOperator` specifies this logical relationship.
   *
   * @default 'or'
   */
  logicalOperator?: 'and' | 'or';
  /**
   * When type is `object`, `patternProperties` can be used to define a schema
   * for properties that match a specific regex pattern.
   */
  patternProperties?: Record<string, IRSchemaObject>;
  /**
   * When type is `object`, `properties` will contain a map of its properties.
   */
  properties?: Record<string, IRSchemaObject>;
  /**
   * The names of `properties` can be validated against a schema, irrespective
   * of their values. This can be useful if you don't want to enforce specific
   * properties, but you want to make sure that the names of those properties
   * follow a specific convention.
   */
  propertyNames?: IRSchemaObject;
  /**
   * Each schema eventually resolves into `type`.
   */
  type?: 'array' | 'boolean' | 'enum' | 'integer' | 'never' | 'null' | 'number' | 'object' | 'string' | 'tuple' | 'undefined' | 'unknown' | 'void';
}
type IRSecurityObject = SecuritySchemeObject;
type IRServerObject = ServerObject;
type IRWebhookObject = IRPathItemObject;
interface IRModel {
  components?: IRComponentsObject;
  paths?: IRPathsObject;
  servers?: ReadonlyArray<IRServerObject>;
  webhooks?: Record<string, IRWebhookObject>;
}
declare namespace IR$1 {
  export type BodyObject = IRBodyObject;
  export type ComponentsObject = IRComponentsObject;
  export type Context<Spec extends Record<string, any> = any> = Context<Spec>;
  export type Model = IRModel;
  export type OperationObject = IROperationObject;
  export type ParameterObject = IRParameterObject;
  export type ParametersObject = IRParametersObject;
  export type PathItemObject = IRPathItemObject;
  export type PathsObject = IRPathsObject;
  export type ReferenceObject = ReferenceObject;
  export type RequestBodyObject = IRRequestBodyObject;
  export type ResponseObject = IRResponseObject;
  export type ResponsesObject = IRResponsesObject;
  export type SchemaObject = IRSchemaObject;
  export type SecurityObject = IRSecurityObject;
  export type ServerObject = IRServerObject;
  export type WebhookObject = IRWebhookObject;
}
//#endregion
//#region src/types/input.d.ts
type JsonSchema = Record<string, unknown>;
type ApiRegistryShorthands = `https://get.heyapi.dev/${string}/${string}` | `${string}/${string}` | `readme:@${string}/${string}#${string}` | `readme:${string}` | `scalar:@${string}/${string}`;
type UserInput = {
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Projects are private by default, you will need to be authenticated
   * to download OpenAPI specifications. We recommend using project API
   * keys in CI workflows and personal API keys for local development.
   *
   * API key isn't required for public projects. You can also omit this
   * parameter and provide an environment variable `HEY_API_TOKEN`.
   */
  api_key?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * You can fetch the last build from branch by providing the branch
   * name.
   */
  branch?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * You can fetch an exact specification by providing a commit sha.
   * This will always return the same file.
   */
  commit_sha?: string;
  /**
   * You can pass any valid Fetch API options to the request for fetching your
   * specification. This is useful if your file is behind auth for example.
   */
  fetch?: RequestInit;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Organization created in Hey API Platform.
   */
  organization?: string;
  /**
   * Path to the OpenAPI specification. This can be:
   *   - path
   *   - URL
   *   - API registry shorthand
   *
   * Both JSON and YAML file formats are supported. You can also pass the parsed
   * object directly if you're fetching the file yourself.
   */
  path?: ApiRegistryShorthands | (string & {}) | JsonSchema;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Project created in Hey API Platform.
   */
  project?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * If you're tagging your specifications with custom tags, you can use
   * them to filter the results. When you provide multiple tags, only
   * the first match will be returned.
   */
  tags?: ReadonlyArray<string>;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Every OpenAPI document contains a required version field. You can
   * use this value to fetch the last uploaded specification matching
   * the value.
   */
  version?: string;
  /**
   * Regenerate the client when the input file changes? You can alternatively
   * pass a numeric value for the interval in ms.
   *
   * @default false
   */
  watch?: boolean | number | Watch;
};
type Input = {
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Projects are private by default, you will need to be authenticated
   * to download OpenAPI specifications. We recommend using project API
   * keys in CI workflows and personal API keys for local development.
   *
   * API key isn't required for public projects. You can also omit this
   * parameter and provide an environment variable `HEY_API_TOKEN`.
   */
  api_key?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * You can fetch the last build from branch by providing the branch
   * name.
   */
  branch?: string;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * You can fetch an exact specification by providing a commit sha.
   * This will always return the same file.
   */
  commit_sha?: string;
  /**
   * You can pass any valid Fetch API options to the request for fetching your
   * specification. This is useful if your file is behind auth for example.
   */
  fetch?: RequestInit;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Organization created in Hey API Platform.
   */
  organization?: string;
  /**
   * Path to the OpenAPI specification. This can be:
   *   - path
   *   - URL
   *   - API registry shorthand
   *
   * Both JSON and YAML file formats are supported. You can also pass the parsed
   * object directly if you're fetching the file yourself.
   */
  path: ApiRegistryShorthands | (string & {}) | JsonSchema;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Project created in Hey API Platform.
   */
  project?: string;
  /**
   * If input path was resolved to a registry, this contains the registry
   * identifier so we don't need to parse it again.
   *
   * @default undefined
   */
  registry?: 'hey-api' | 'readme' | 'scalar';
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * If you're tagging your specifications with custom tags, you can use
   * them to filter the results. When you provide multiple tags, only
   * the first match will be returned.
   */
  tags?: ReadonlyArray<string>;
  /**
   * **Requires `path` to start with `https://get.heyapi.dev` or be undefined**
   *
   * Every OpenAPI document contains a required version field. You can
   * use this value to fetch the last uploaded specification matching
   * the value.
   */
  version?: string;
  /**
   * Regenerate the client when the input file changes? You can alternatively
   * pass a numeric value for the interval in ms.
   */
  watch: Watch;
};
type Watch = {
  /**
   * Regenerate the client when the input file changes?
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * How often should we attempt to detect the input file change? (in ms)
   *
   * @default 1000
   */
  interval?: number;
  /**
   * How long will we wait before the request times out?
   *
   * @default 60_000
   */
  timeout?: number;
};
//#endregion
//#region src/types/logs.d.ts
type Logs = {
  /**
   * Whether or not error logs should be written to a file or not
   *
   * @default true
   * */
  file?: boolean;
  /**
   * The logging level to control the verbosity of log output.
   * Determines which messages are logged based on their severity.
   *
   * Available levels (in increasing order of severity):
   * - `trace`: Detailed debug information, primarily for development.
   * - `debug`: Diagnostic information useful during debugging.
   * - `info`: General operational messages that indicate normal application behavior.
   * - `warn`: Potentially problematic situations that require attention.
   * - `error`: Errors that prevent some functionality but do not crash the application.
   * - `fatal`: Critical errors that cause the application to terminate.
   * - `silent`: Disables all logging.
   *
   * Messages with a severity equal to or higher than the specified level will be logged.
   *
   * @default 'info'
   */
  level?: 'debug' | 'error' | 'fatal' | 'info' | 'silent' | 'trace' | 'warn';
  /**
   * The relative location of the logs folder
   *
   * @default process.cwd()
   */
  path?: string;
};
//#endregion
//#region src/types/output.d.ts
type Formatters = 'biome' | 'prettier';
type Linters = 'biome' | 'eslint' | 'oxlint';
type ImportFileExtensions = '.js' | '.ts';
type UserOutput = {
  /**
   * Defines casing of the output fields. By default, we preserve `input`
   * values as data transforms incur a performance penalty at runtime.
   *
   * @default undefined
   */
  case?: StringCase;
  /**
   * Clean the `output` folder on every run? If disabled, this folder may
   * be used to store additional files. The default option is `true` to
   * reduce the risk of keeping outdated files around when configuration,
   * input, or package version changes.
   *
   * @default true
   */
  clean?: boolean;
  /**
   * Optional function to transform file names before they are used.
   *
   * @param name The original file name.
   * @returns The transformed file name.
   * @default '{{name}}'
   */
  fileName?: StringName | {
    /**
     * The casing convention to use for generated file names.
     *
     * @default 'preserve'
     */
    case?: StringCase;
    /**
     * Custom naming pattern for generated file names.
     *
     * @default '{{name}}'
     */
    name?: StringName;
    /**
     * Suffix to append to file names (before the extension). For example,
     * with a suffix of `.gen`, `example.ts` becomes `example.gen.ts`.
     *
     * @default '.gen'
     * @example
     * // Given a suffix of `.gen`
     * 'index.ts' -> 'index.ts' (index files are not renamed)
     * 'user.ts' -> 'user.gen.ts'
     * 'order.gen.ts' -> 'order.gen.ts' (files already containing the suffix are not renamed)
     */
    suffix?: string | null;
  };
  /**
   * Which formatter to use to process output folder?
   *
   * @default null
   */
  format?: Formatters | null;
  /**
   * If specified, this will be the file extension used when importing
   * other modules. By default, we don't add a file extension and let the
   * runtime resolve it. If you're using moduleResolution `nodenext`, we
   * default to `.js`.
   *
   * @default undefined
   */
  importFileExtension?: ImportFileExtensions | (string & {}) | null;
  /**
   * Should the exports from plugin files be re-exported in the index
   * barrel file? By default, this is enabled and only default plugins
   * are re-exported.
   *
   * @default true
   */
  indexFile?: boolean;
  /**
   * Which linter to use to process output folder?
   *
   * @default null
   */
  lint?: Linters | null;
  /**
   * The absolute path to the output folder.
   */
  path: string;
  /**
   * Relative or absolute path to the tsconfig file we should use to
   * generate the output. If a path to tsconfig file is not provided, we
   * attempt to find one starting from the location of the
   * `@hey-api/openapi-ts` configuration file and traversing up.
   *
   * @default undefined
   */
  tsConfigPath?: (string & {}) | null;
};
type Output = {
  /**
   * Defines casing of the output fields. By default, we preserve `input`
   * values as data transforms incur a performance penalty at runtime.
   *
   * @default undefined
   */
  case?: StringCase;
  /**
   * Clean the `output` folder on every run? If disabled, this folder may
   * be used to store additional files. The default option is `true` to
   * reduce the risk of keeping outdated files around when configuration,
   * input, or package version changes.
   *
   * @default true
   */
  clean: boolean;
  /**
   * Optional function to transform file names before they are used.
   *
   * @param name The original file name.
   * @returns The transformed file name.
   */
  fileName: {
    /**
     * The casing convention to use for generated file names.
     *
     * @default 'preserve'
     */
    case: StringCase;
    /**
     * Custom naming pattern for generated file names.
     *
     * @default '{{name}}'
     */
    name: StringName;
    /**
     * Suffix to append to file names (before the extension). For example,
     * with a suffix of `.gen`, `example.ts` becomes `example.gen.ts`.
     *
     * @default '.gen'
     * @example
     * // Given a suffix of `.gen`
     * 'index.ts' -> 'index.ts' (index files are not renamed)
     * 'user.ts' -> 'user.gen.ts'
     * 'order.gen.ts' -> 'order.gen.ts' (files already containing the suffix are not renamed)
     */
    suffix: string | null;
  };
  /**
   * Which formatter to use to process output folder?
   *
   * @default null
   */
  format: Formatters | null;
  /**
   * If specified, this will be the file extension used when importing
   * other modules. By default, we don't add a file extension and let the
   * runtime resolve it. If you're using moduleResolution `nodenext`, we
   * default to `.js`.
   *
   * @default undefined
   */
  importFileExtension: ImportFileExtensions | (string & {}) | null | undefined;
  /**
   * Should the exports from plugin files be re-exported in the index
   * barrel file? By default, this is enabled and only default plugins
   * are re-exported.
   *
   * @default true
   */
  indexFile: boolean;
  /**
   * Which linter to use to process output folder?
   *
   * @default null
   */
  lint: Linters | null;
  /**
   * The absolute path to the output folder.
   */
  path: string;
  /**
   * The parsed TypeScript configuration used to generate the output.
   * If no `tsconfig` file path was provided or found, this will be `null`.
   */
  tsConfig: ts.ParsedCommandLine | null;
  /**
   * Relative or absolute path to the tsconfig file we should use to
   * generate the output. If a path to tsconfig file is not provided, we
   * attempt to find one starting from the location of the
   * `@hey-api/openapi-ts` configuration file and traversing up.
   *
   * @default undefined
   */
  tsConfigPath: (string & {}) | null | undefined;
};
//#endregion
//#region src/types/parser.d.ts
type EnumsMode = 'inline' | 'root';
type UserParser = {
  /**
   * Filters can be used to select a subset of your input before it's passed
   * to plugins.
   */
  filters?: Filters;
  /**
   * Optional hooks to override default plugin behavior.
   *
   * Use these to classify resources, control which outputs are generated,
   * or provide custom behavior for specific resources.
   */
  hooks?: Hooks;
  /**
   * Pagination configuration.
   */
  pagination?: {
    /**
     * Array of keywords to be considered as pagination field names.
     * These will be used to detect pagination fields in schemas and parameters.
     *
     * @default ['after', 'before', 'cursor', 'offset', 'page', 'start']
     */
    keywords?: ReadonlyArray<string>;
  };
  /**
   * Custom input transformations to execute before parsing. Use this
   * to modify, fix, or enhance input before it's passed to plugins.
   */
  patch?: Patch;
  /**
   * Built-in transformations that modify or normalize the input before it's
   * passed to plugins. These options enable predictable, documented behaviors
   * and are distinct from custom patches. Use this to perform structural
   * changes to input in a standardized way.
   */
  transforms?: {
    /**
     * Your input might contain two types of enums:
     * - enums defined as reusable components (root enums)
     * - non-reusable enums nested within other schemas (inline enums)
     *
     * You may want all enums to be reusable. This is because only root enums
     * are typically exported by plugins. Inline enums will never be directly
     * importable since they're nested inside other schemas.
     *
     * For example, to export nested enum types with the `@hey-api/typescript`
     * plugin, set `enums` to `root`. Likewise, if you don't want to export any
     * enum types, set `enums` to `inline`.
     *
     * @default false
     */
    enums?: boolean | EnumsMode | {
      /**
       * The casing convention to use for generated names.
       *
       * @default 'PascalCase'
       */
      case?: StringCase;
      /**
       * Whether to transform all enums.
       *
       * @default true
       */
      enabled?: boolean;
      /**
       * Controls whether enums are promoted to reusable root components
       * ('root') or kept inline within schemas ('inline').
       *
       * @default 'root'
       */
      mode?: EnumsMode;
      /**
       * Customize the generated name of enums.
       *
       * @default '{{name}}Enum'
       */
      name?: StringName;
    };
    /**
     * By default, any object schema with a missing `required` keyword is
     * interpreted as "no properties are required." This is the correct
     * behavior according to the OpenAPI standard. However, some specifications
     * interpret a missing `required` keyword as "all properties should be
     * required."
     *
     * This option allows you to change the default behavior so that
     * properties are required by default unless explicitly marked as optional.
     *
     * @default false
     */
    propertiesRequiredByDefault?: boolean;
    /**
     * Your schemas might contain read-only or write-only fields. Using such
     * schemas directly could mean asking the user to provide a read-only
     * field in requests, or expecting a write-only field in responses.
     *
     * We separate schemas for requests and responses if direct usage
     * would result in such scenarios. You can still disable this
     * behavior if you prefer.
     *
     * @default true
     */
    readWrite?: boolean | {
      /**
       * Whether to split read-only and write-only schemas.
       *
       * @default true
       */
      enabled?: boolean;
      /**
       * Configuration for generated request-specific schemas.
       *
       * Can be:
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default '{{name}}Writable'
       */
      requests?: StringName | {
        /**
         * The casing convention to use for generated names.
         *
         * @default 'preserve'
         */
        case?: StringCase;
        /**
         * Customize the generated name of schemas used in requests or
         * containing write-only fields.
         *
         * @default '{{name}}Writable'
         */
        name?: StringName;
      };
      /**
       * Configuration for generated response-specific schemas.
       *
       * Can be:
       * - `string` or `function`: Shorthand for `{ name: string | function }`
       * - `object`: Full configuration object
       *
       * @default '{{name}}'
       */
      responses?: StringName | {
        /**
         * The casing convention to use for generated names.
         *
         * @default 'preserve'
         */
        case?: StringCase;
        /**
         * Customize the generated name of schemas used in responses or
         * containing read-only fields. We default to the original name
         * to avoid breaking output when a read-only field is added.
         *
         * @default '{{name}}'
         */
        name?: StringName;
      };
    };
  };
  /**
   * **This is an experimental feature.**
   *
   * Validate the input before generating output? This is an experimental,
   * lightweight feature and support will be added on an ad hoc basis. Setting
   * `validate_EXPERIMENTAL` to `true` is the same as `warn`.
   *
   * @default false
   */
  validate_EXPERIMENTAL?: boolean | 'strict' | 'warn';
};
type Parser = {
  /**
   * Filters can be used to select a subset of your input before it's passed
   * to plugins.
   */
  filters?: Filters;
  /**
   * Optional hooks to override default plugin behavior.
   *
   * Use these to classify resources, control which outputs are generated,
   * or provide custom behavior for specific resources.
   */
  hooks: Hooks;
  /**
   * Pagination configuration.
   */
  pagination: {
    /**
     * Array of keywords to be considered as pagination field names.
     * These will be used to detect pagination fields in schemas and parameters.
     *
     * @default ['after', 'before', 'cursor', 'offset', 'page', 'start']
     */
    keywords: ReadonlyArray<string>;
  };
  /**
   * Custom input transformations to execute before parsing. Use this
   * to modify, fix, or enhance input before it's passed to plugins.
   */
  patch?: Patch;
  /**
   * Built-in transformations that modify or normalize the input before it's
   * passed to plugins. These options enable predictable, documented behaviors
   * and are distinct from custom patches. Use this to perform structural
   * changes to input in a standardized way.
   */
  transforms: {
    /**
     * Your input might contain two types of enums:
     * - enums defined as reusable components (root enums)
     * - non-reusable enums nested within other schemas (inline enums)
     *
     * You may want all enums to be reusable. This is because only root enums
     * are typically exported by plugins. Inline enums will never be directly
     * importable since they're nested inside other schemas.
     *
     * For example, to export nested enum types with the `@hey-api/typescript`
     * plugin, set `enums` to `root`. Likewise, if you don't want to export any
     * enum types, set `enums` to `inline`.
     */
    enums: {
      /**
       * The casing convention to use for generated names.
       *
       * @default 'PascalCase'
       */
      case: StringCase;
      /**
       * Whether to transform all enums.
       *
       * @default true
       */
      enabled: boolean;
      /**
       * Controls whether enums are promoted to reusable root components
       * ('root') or kept inline within schemas ('inline').
       *
       * @default 'root'
       */
      mode: EnumsMode;
      /**
       * Customize the generated name of enums.
       *
       * @default '{{name}}Enum'
       */
      name: StringName;
    };
    /**
     * By default, any object schema with a missing `required` keyword is
     * interpreted as "no properties are required." This is the correct
     * behavior according to the OpenAPI standard. However, some specifications
     * interpret a missing `required` keyword as "all properties should be
     * required."
     *
     * This option allows you to change the default behavior so that
     * properties are required by default unless explicitly marked as optional.
     *
     * @default false
     */
    propertiesRequiredByDefault: boolean;
    /**
     * Your schemas might contain read-only or write-only fields. Using such
     * schemas directly could mean asking the user to provide a read-only
     * field in requests, or expecting a write-only field in responses.
     *
     * We separate schemas for requests and responses if direct usage
     * would result in such scenarios. You can still disable this
     * behavior if you prefer.
     */
    readWrite: {
      /**
       * Whether to split read-only and write-only schemas.
       *
       * @default true
       */
      enabled: boolean;
      /**
       * Configuration for generated request-specific schemas.
       */
      requests: {
        /**
         * The casing convention to use for generated names.
         *
         * @default 'preserve'
         */
        case: StringCase;
        /**
         * Customize the generated name of schemas used in requests or
         * containing write-only fields.
         *
         * @default '{{name}}Writable'
         */
        name: StringName;
      };
      /**
       * Configuration for generated response-specific schemas.
       */
      responses: {
        /**
         * The casing convention to use for generated names.
         *
         * @default 'preserve'
         */
        case: StringCase;
        /**
         * Customize the generated name of schemas used in responses or
         * containing read-only fields. We default to the original name
         * to avoid breaking output when a read-only field is added.
         *
         * @default '{{name}}'
         */
        name: StringName;
      };
    };
  };
  /**
   * **This is an experimental feature.**
   *
   * Validate the input before generating output? This is an experimental,
   * lightweight feature and support will be added on an ad hoc basis. Setting
   * `validate_EXPERIMENTAL` to `true` is the same as `warn`.
   *
   * @default false
   */
  validate_EXPERIMENTAL: false | 'strict' | 'warn';
};
type Filters = {
  /**
   * Include deprecated resources in the output?
   *
   * @default true
   */
  deprecated?: boolean;
  operations?: {
    /**
     * Prevent operations matching the `exclude` filters from being processed.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['GET /api/v1/foo']
     */
    exclude?: ReadonlyArray<string>;
    /**
     * Process only operations matching the `include` filters.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['GET /api/v1/foo']
     */
    include?: ReadonlyArray<string>;
  };
  /**
   * Keep reusable components without any references from operations in the
   * output? By default, we exclude orphaned resources.
   *
   * @default false
   */
  orphans?: boolean;
  parameters?: {
    /**
     * Prevent parameters matching the `exclude` filters from being processed.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['QueryParam']
     */
    exclude?: ReadonlyArray<string>;
    /**
     * Process only parameters matching the `include` filters.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['QueryParam']
     */
    include?: ReadonlyArray<string>;
  };
  /**
   * Should we preserve the key order when overwriting your input? This
   * option is disabled by default to improve performance.
   *
   * @default false
   */
  preserveOrder?: boolean;
  requestBodies?: {
    /**
     * Prevent request bodies matching the `exclude` filters from being processed.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['Foo']
     */
    exclude?: ReadonlyArray<string>;
    /**
     * Process only request bodies matching the `include` filters.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['Foo']
     */
    include?: ReadonlyArray<string>;
  };
  responses?: {
    /**
     * Prevent responses matching the `exclude` filters from being processed.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['Foo']
     */
    exclude?: ReadonlyArray<string>;
    /**
     * Process only responses matching the `include` filters.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['Foo']
     */
    include?: ReadonlyArray<string>;
  };
  schemas?: {
    /**
     * Prevent schemas matching the `exclude` filters from being processed.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['Foo']
     */
    exclude?: ReadonlyArray<string>;
    /**
     * Process only schemas matching the `include` filters.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['Foo']
     */
    include?: ReadonlyArray<string>;
  };
  tags?: {
    /**
     * Prevent tags matching the `exclude` filters from being processed.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['foo']
     */
    exclude?: ReadonlyArray<string>;
    /**
     * Process only tags matching the `include` filters.
     *
     * In case of conflicts, `exclude` takes precedence over `include`.
     *
     * @example ['foo']
     */
    include?: ReadonlyArray<string>;
  };
};
type Patch = {
  /**
   * Patch the OpenAPI meta object in place. Useful for modifying general metadata such as title, description, version, or custom fields before further processing.
   *
   * @param meta The OpenAPI meta object for the current version.
   */
  meta?: (meta: OpenApiMetaObject.V2_0_X | OpenApiMetaObject.V3_0_X | OpenApiMetaObject.V3_1_X) => void;
  /**
   * Patch OpenAPI operations in place. The key is the operation method and operation path, and the function receives the operation object to modify directly.
   *
   * @example
   * operations: {
   *   'GET /foo': (operation) => {
   *     operation.responses['200'].description = 'foo';
   *   }
   * }
   */
  operations?: Record<string, (operation: OpenApiOperationObject.V2_0_X | OpenApiOperationObject.V3_0_X | OpenApiOperationObject.V3_1_X) => void>;
  /**
   * Patch OpenAPI parameters in place. The key is the parameter name, and the function receives the parameter object to modify directly.
   *
   * @example
   * parameters: {
   *   limit: (parameter) => {
   *     parameter.schema.type = 'integer';
   *   }
   * }
   */
  parameters?: Record<string, (parameter: OpenApiParameterObject.V3_0_X | OpenApiParameterObject.V3_1_X) => void>;
  /**
   * Patch OpenAPI request bodies in place. The key is the request body name, and the function receives the request body object to modify directly.
   *
   * @example
   * requestBodies: {
   *   CreateUserRequest: (requestBody) => {
   *     requestBody.required = true;
   *   }
   * }
   */
  requestBodies?: Record<string, (requestBody: OpenApiRequestBodyObject.V3_0_X | OpenApiRequestBodyObject.V3_1_X) => void>;
  /**
   * Patch OpenAPI responses in place. The key is the response name, and the function receives the response object to modify directly.
   *
   * @example
   * responses: {
   *   NotFound: (response) => {
   *     response.description = 'Resource not found.';
   *   }
   * }
   */
  responses?: Record<string, (response: OpenApiResponseObject.V3_0_X | OpenApiResponseObject.V3_1_X) => void>;
  /**
   * Each function receives the schema object to be modified in place. Common
   * use cases include fixing incorrect data types, removing unwanted
   * properties, adding missing fields, or standardizing date/time formats.
   *
   * @example
   * ```js
   * schemas: {
   *   Foo: (schema) => {
   *     // convert date-time format to timestamp
   *     delete schema.properties.updatedAt.format;
   *     schema.properties.updatedAt.type = 'number';
   *   },
   *   Bar: (schema) => {
   *     // add missing property
   *     schema.properties.metadata = {
   *       additionalProperties: true,
   *       type: 'object',
   *     };
   *     schema.required = ['metadata'];
   *   },
   *   Baz: (schema) => {
   *     // remove property
   *     delete schema.properties.internalField;
   *   }
   * }
   * ```
   */
  schemas?: Record<string, (schema: OpenApiSchemaObject.V2_0_X | OpenApiSchemaObject.V3_0_X | OpenApiSchemaObject.V3_1_X) => void>;
  /**
   * Patch the OpenAPI version string. The function receives the current version and should return the new version string.
   * Useful for normalizing or overriding the version value before further processing.
   *
   * @param version The current OpenAPI version string.
   * @returns The new version string to use.
   *
   * @example
   * version: (version) => version.replace(/^v/, '')
   */
  version?: string | ((version: string) => string);
};
//#endregion
//#region src/types/config.d.ts
interface UserConfig$1 {
  /**
   * Path to the config file. Set this value if you don't use the default
   * config file name, or it's not located in the project root.
   */
  configFile?: string;
  /**
   * Skip writing files to disk?
   *
   * @default false
   */
  dryRun?: boolean;
  /**
   * Path to the OpenAPI specification. This can be:
   *   - path
   *   - URL
   *   - API registry shorthand
   *
   * Both JSON and YAML file formats are supported. You can also pass the parsed
   * object directly if you're fetching the file yourself.
   *
   * Alternatively, you can define a configuration object with more options.
   *
   * If you define an array, we will generate a single output from multiple
   * inputs. If you define an array of outputs with the same length, we will
   * generate multiple outputs, one for each input.
   */
  input: MaybeArray<UserInput | Required<UserInput>['path']>;
  /**
   * Show an interactive error reporting tool when the program crashes? You
   * generally want to keep this disabled (default).
   *
   * @default false
   */
  interactive?: boolean;
  /**
   * The relative location of the logs folder.
   *
   * @default process.cwd()
   */
  logs?: string | Logs;
  /**
   * Path to the output folder.
   *
   * If you define an array of outputs with the same length as inputs, we will
   * generate multiple outputs, one for each input.
   */
  output: MaybeArray<string | UserOutput>;
  /**
   * Customize how the input is parsed and transformed before it's passed to
   * plugins.
   */
  parser?: UserParser;
  /**
   * Plugins generate artifacts from `input`. By default, we generate SDK
   * functions and TypeScript interfaces. If you manually define `plugins`,
   * you need to include the default plugins if you wish to use them.
   *
   * @default ['@hey-api/typescript', '@hey-api/sdk']
   */
  plugins?: ReadonlyArray<PluginNames | { [K in PluginNames]: Plugin.UserConfig<PluginConfigMap[K]['config']> & {
    name: K;
  } }[PluginNames]>;

  // DEPRECATED OPTIONS BELOW

  /**
   * Manually set base in OpenAPI config instead of inferring from server value
   *
   * @deprecated
   */
  // eslint-disable-next-line typescript-sort-keys/interface
  base?: string;
  /**
   * Opt in to the experimental parser?
   *
   * @deprecated
   * @default true
   */
  experimentalParser?: boolean;
  /**
   * Generate core client classes?
   *
   * @deprecated
   * @default true
   */
  exportCore?: boolean;
  /**
   * Custom client class name. Please note this option is deprecated and
   * will be removed in favor of clients.
   *
   * @deprecated
   * @link https://heyapi.dev/openapi-ts/migrating.html#deprecated-name
   */
  name?: string;
  /**
   * Path to custom request file. Please note this option is deprecated and
   * will be removed in favor of clients.
   *
   * @deprecated
   * @link https://heyapi.dev/openapi-ts/migrating.html#deprecated-request
   */
  request?: string;
  /**
   * Use options or arguments functions. Please note this option is deprecated and
   * will be removed in favor of clients.
   *
   * @deprecated
   * @default true
   * @link https://heyapi.dev/openapi-ts/migrating.html#deprecated-useoptions
   */
  useOptions?: boolean;
  /**
   * @deprecated use `input.watch` instead
   */
  watch?: boolean | number | Watch;
}
type Config$1 = Omit<Required<UserConfig$1>, 'base' | 'input' | 'logs' | 'name' | 'output' | 'parser' | 'plugins' | 'request' | 'watch'> & Pick<UserConfig$1, 'base' | 'name' | 'request'> & {
  /**
   * Path to the input specification.
   */
  input: ReadonlyArray<Input>;
  logs: Logs;
  /**
   * Path to the output folder.
   */
  output: Output;
  /**
   * Customize how the input is parsed and transformed before it's passed to
   * plugins.
   */
  parser: Parser;
  pluginOrder: ReadonlyArray<keyof PluginConfigMap>;
  plugins: { [K in PluginNames]?: Plugin.ConfigWithName<PluginConfigMap[K]> };
};
//#endregion
//#region src/types/types.d.ts
declare namespace LegacyIR {
  export type LegacyOperation = Operation;
}
interface WatchValues {
  /**
   * Headers to be sent with each HEAD and/or GET request. This effectively
   * serves as a mechanism resolver because setting certain headers will opt
   * into comparing the specifications using that method.
   */
  headers: Headers;
  /**
   * Can we send a HEAD request instead of fetching the whole specification?
   * This value will be set after the first successful fetch.
   */
  isHeadMethodSupported?: boolean;
  /**
   * String content of the last successfully fetched specification.
   */
  lastValue?: string;
}
//#endregion
export { AccessLevel as A, PluginHandler as C, Comments as D, MaybeArray as E, types_d_exports as F, __export as I, FunctionTypeParameter as M, ObjectValue as N, ImportExportItemObject as O, SyntaxKindKeyword as P, Client$2 as S, LazyOrAsync as T, OpenApiRequestBodyObject as _, Input as a, parseOpenApiSpec as b, ExpressionTransformer as c, Client as d, Operation as f, OpenApiParameterObject as g, OpenApiOperationObject as h, UserConfig$1 as i, FunctionParameter as j, tsNodeToString as k, DefinePlugin as l, OpenApiMetaObject as m, WatchValues as n, IR$1 as o, OpenApi$1 as p, Config$1 as r, TypeTransformer as s, LegacyIR as t, Plugin as u, OpenApiResponseObject as v, StringCase as w, Logger as x, OpenApiSchemaObject as y };
//# sourceMappingURL=types-CHvu8B2X.d.cts.map