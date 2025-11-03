import { A as AccessLevel, C as PluginHandler, D as Comments, E as MaybeArray, F as types_d_exports, I as __export, M as FunctionTypeParameter, N as ObjectValue, O as ImportExportItemObject, P as SyntaxKindKeyword, S as Client$2, T as LazyOrAsync, _ as OpenApiRequestBodyObject, c as ExpressionTransformer, d as Client$7, f as Operation, g as OpenApiParameterObject, h as OpenApiOperationObject, i as UserConfig, j as FunctionParameter, k as tsNodeToString, l as DefinePlugin, m as OpenApiMetaObject, o as IR, p as OpenApi, s as TypeTransformer, t as LegacyIR, u as Plugin, v as OpenApiResponseObject, w as StringCase, x as Logger, y as OpenApiSchemaObject } from "./types-CHvu8B2X.cjs";
import * as typescript0 from "typescript";
import ts from "typescript";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injector } from "@angular/core";
import { AxiosError, AxiosInstance, AxiosRequestHeaders, AxiosResponse, AxiosStatic, CreateAxiosDefaults } from "axios";
import { AsyncDataOptions, UseFetchOptions, useAsyncData, useFetch, useLazyAsyncData, useLazyFetch } from "nuxt/app";
import { Ref } from "vue";
import { FetchOptions, ResponseType, ofetch } from "ofetch";

//#region src/plugins/@hey-api/client-core/bundle/auth.d.ts
type AuthToken = string | undefined;
interface Auth {
  /**
   * Which part of the request do we use to send the auth?
   *
   * @default 'header'
   */
  in?: 'header' | 'query' | 'cookie';
  /**
   * Header or query parameter name.
   *
   * @default 'Authorization'
   */
  name?: string;
  scheme?: 'basic' | 'bearer';
  type: 'apiKey' | 'http';
}
//#endregion
//#region src/plugins/@hey-api/client-core/bundle/pathSerializer.d.ts
interface SerializerOptions<T$1> {
  /**
   * @default true
   */
  explode: boolean;
  style: T$1;
}
type ArrayStyle = 'form' | 'spaceDelimited' | 'pipeDelimited';
type ObjectStyle = 'form' | 'deepObject';
//#endregion
//#region src/plugins/@hey-api/client-core/bundle/bodySerializer.d.ts
type QuerySerializer$1 = (query: Record<string, unknown>) => string;
type BodySerializer = (body: any) => any;
type QuerySerializerOptionsObject = {
  allowReserved?: boolean;
  array?: Partial<SerializerOptions<ArrayStyle>>;
  object?: Partial<SerializerOptions<ObjectStyle>>;
};
type QuerySerializerOptions = QuerySerializerOptionsObject & {
  /**
   * Per-parameter serialization overrides. When provided, these settings
   * override the global array/object settings for specific parameter names.
   */
  parameters?: Record<string, QuerySerializerOptionsObject>;
};
//#endregion
//#region src/plugins/@hey-api/client-core/bundle/types.d.ts
type HttpMethod = 'connect' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace';
type Client$8<RequestFn$6 = never, Config$7 = unknown, MethodFn$6 = never, BuildUrlFn$6 = never, SseFn$6 = never> = {
  /**
   * Returns the final request URL.
   */
  buildUrl: BuildUrlFn$6;
  getConfig: () => Config$7;
  request: RequestFn$6;
  setConfig: (config: Config$7) => Config$7;
} & { [K in HttpMethod]: MethodFn$6 } & ([SseFn$6] extends [never] ? {
  sse?: never;
} : {
  sse: { [K in HttpMethod]: SseFn$6 };
});
interface Config {
  /**
   * Auth token or a function returning auth token. The resolved value will be
   * added to the request payload as defined by its `security` array.
   */
  auth?: ((auth: Auth) => Promise<AuthToken> | AuthToken) | AuthToken;
  /**
   * A function for serializing request body parameter. By default,
   * {@link JSON.stringify()} will be used.
   */
  bodySerializer?: BodySerializer | null;
  /**
   * An object containing any HTTP headers that you want to pre-populate your
   * `Headers` object with.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init See more}
   */
  headers?: RequestInit['headers'] | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined | unknown>;
  /**
   * The request method.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#method See more}
   */
  method?: Uppercase<HttpMethod>;
  /**
   * A function for serializing request query parameters. By default, arrays
   * will be exploded in form style, objects will be exploded in deepObject
   * style, and reserved characters are percent-encoded.
   *
   * This method will have no effect if the native `paramsSerializer()` Axios
   * API function is used.
   *
   * {@link https://swagger.io/docs/specification/serialization/#query View examples}
   */
  querySerializer?: QuerySerializer$1 | QuerySerializerOptions;
  /**
   * A function validating request data. This is useful if you want to ensure
   * the request conforms to the desired shape, so it can be safely sent to
   * the server.
   */
  requestValidator?: (data: unknown) => Promise<unknown>;
  /**
   * A function transforming response data before it's returned. This is useful
   * for post-processing data, e.g. converting ISO strings into Date objects.
   */
  responseTransformer?: (data: unknown) => Promise<unknown>;
  /**
   * A function validating response data. This is useful if you want to ensure
   * the response conforms to the desired shape, so it can be safely passed to
   * the transformers and returned to the user.
   */
  responseValidator?: (data: unknown) => Promise<unknown>;
}
//#endregion
//#region src/plugins/@hey-api/client-core/bundle/serverSentEvents.d.ts
type ServerSentEventsOptions<TData$1 = unknown> = Omit<RequestInit, 'method'> & Pick<Config, 'method' | 'responseTransformer' | 'responseValidator'> & {
  /**
   * Fetch API implementation. You can use this option to provide a custom
   * fetch instance.
   *
   * @default globalThis.fetch
   */
  fetch?: typeof fetch;
  /**
   * Implementing clients can call request interceptors inside this hook.
   */
  onRequest?: (url: string, init: RequestInit) => Promise<Request>;
  /**
   * Callback invoked when a network or parsing error occurs during streaming.
   *
   * This option applies only if the endpoint returns a stream of events.
   *
   * @param error The error that occurred.
   */
  onSseError?: (error: unknown) => void;
  /**
   * Callback invoked when an event is streamed from the server.
   *
   * This option applies only if the endpoint returns a stream of events.
   *
   * @param event Event streamed from the server.
   * @returns Nothing (void).
   */
  onSseEvent?: (event: StreamEvent<TData$1>) => void;
  serializedBody?: RequestInit['body'];
  /**
   * Default retry delay in milliseconds.
   *
   * This option applies only if the endpoint returns a stream of events.
   *
   * @default 3000
   */
  sseDefaultRetryDelay?: number;
  /**
   * Maximum number of retry attempts before giving up.
   */
  sseMaxRetryAttempts?: number;
  /**
   * Maximum retry delay in milliseconds.
   *
   * Applies only when exponential backoff is used.
   *
   * This option applies only if the endpoint returns a stream of events.
   *
   * @default 30000
   */
  sseMaxRetryDelay?: number;
  /**
   * Optional sleep function for retry backoff.
   *
   * Defaults to using `setTimeout`.
   */
  sseSleepFn?: (ms: number) => Promise<void>;
  url: string;
};
interface StreamEvent<TData$1 = unknown> {
  data: TData$1;
  event?: string;
  id?: string;
  retry?: number;
}
type ServerSentEventsResult<TData$1 = unknown, TReturn = void, TNext = unknown> = {
  stream: AsyncGenerator<TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1, TReturn, TNext>;
};
//#endregion
//#region src/plugins/@hey-api/client-angular/bundle/utils.d.ts
type ErrInterceptor$3<Err$1, Res$1, Req$1, Options$7> = (error: Err$1, response: Res$1, request: Req$1, options: Options$7) => Err$1 | Promise<Err$1>;
type ReqInterceptor$3<Req$1, Options$7> = (request: Req$1, options: Options$7) => Req$1 | Promise<Req$1>;
type ResInterceptor$3<Res$1, Req$1, Options$7> = (response: Res$1, request: Req$1, options: Options$7) => Res$1 | Promise<Res$1>;
declare class Interceptors$3<Interceptor> {
  fns: Array<Interceptor | null>;
  clear(): void;
  eject(id: number | Interceptor): void;
  exists(id: number | Interceptor): boolean;
  getInterceptorIndex(id: number | Interceptor): number;
  update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false;
  use(fn: Interceptor): number;
}
interface Middleware$3<Req$1, Res$1, Err$1, Options$7> {
  error: Interceptors$3<ErrInterceptor$3<Err$1, Res$1, Req$1, Options$7>>;
  request: Interceptors$3<ReqInterceptor$3<Req$1, Options$7>>;
  response: Interceptors$3<ResInterceptor$3<Res$1, Req$1, Options$7>>;
}
//#endregion
//#region src/plugins/@hey-api/client-angular/bundle/types.d.ts
type ResponseStyle$2 = 'data' | 'fields';
interface Config$6<T$1 extends ClientOptions$5 = ClientOptions$5> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Omit<Config, 'headers'> {
  /**
   * Base URL for all requests made by this client.
   */
  baseUrl?: T$1['baseUrl'];
  /**
   * An object containing any HTTP headers that you want to pre-populate your
   * `HttpHeaders` object with.
   *
   * {@link https://angular.dev/api/common/http/HttpHeaders#constructor See more}
   */
  headers?: HttpHeaders | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined | unknown>;
  /**
   * The HTTP client to use for making requests.
   */
  httpClient?: HttpClient;
  /**
   * Should we return only data or multiple fields (data, error, response, etc.)?
   *
   * @default 'fields'
   */
  responseStyle?: ResponseStyle$2;
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: T$1['throwOnError'];
}
interface RequestOptions$5<TData$1 = unknown, TResponseStyle$1 extends ResponseStyle$2 = 'fields', ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends Config$6<{
  responseStyle: TResponseStyle$1;
  throwOnError: ThrowOnError$1;
}>, Pick<ServerSentEventsOptions<TData$1>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
  /**
   * Any body that you want to add to your request.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  /**
   * Optional custom injector for dependency resolution if you don't implicitly or explicitly provide one.
   */
  injector?: Injector;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  /**
   * Security mechanism(s) to use for the request.
   */
  security?: ReadonlyArray<Auth>;
  url: Url;
}
interface ResolvedRequestOptions$3<TResponseStyle$1 extends ResponseStyle$2 = 'fields', ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends RequestOptions$5<unknown, TResponseStyle$1, ThrowOnError$1, Url> {
  serializedBody?: string;
}
type RequestResult$5<TData$1 = unknown, TError$1 = unknown, ThrowOnError$1 extends boolean = boolean, TResponseStyle$1 extends ResponseStyle$2 = 'fields'> = Promise<ThrowOnError$1 extends true ? TResponseStyle$1 extends 'data' ? TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1 : {
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  request: HttpRequest<unknown>;
  response: HttpResponse<TData$1>;
} : TResponseStyle$1 extends 'data' ? (TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1) | undefined : {
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  error: undefined;
  request: HttpRequest<unknown>;
  response: HttpResponse<TData$1>;
} | {
  data: undefined;
  error: TError$1[keyof TError$1];
  request: HttpRequest<unknown>;
  response: HttpErrorResponse & {
    error: TError$1[keyof TError$1] | null;
  };
}>;
interface ClientOptions$5 {
  baseUrl?: string;
  responseStyle?: ResponseStyle$2;
  throwOnError?: boolean;
}
type MethodFn$5 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle$2 = 'fields'>(options: Omit<RequestOptions$5<TData, TResponseStyle, ThrowOnError>, 'method'>) => RequestResult$5<TData, TError, ThrowOnError, TResponseStyle>;
type SseFn$5 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle$2 = 'fields'>(options: Omit<RequestOptions$5<TData, TResponseStyle, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;
type RequestFn$5 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle$2 = 'fields'>(options: Omit<RequestOptions$5<TData, TResponseStyle, ThrowOnError>, 'method'> & Pick<Required<RequestOptions$5<TData, TResponseStyle, ThrowOnError>>, 'method'>) => RequestResult$5<TData, TError, ThrowOnError, TResponseStyle>;
type RequestOptionsFn = <ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle$2 = 'fields'>(options: RequestOptions$5<unknown, TResponseStyle, ThrowOnError>) => HttpRequest<unknown>;
type BuildUrlFn$5 = <TData extends {
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  url: string;
}>(options: Pick<TData, 'url'> & Options$6<TData>) => string;
type Client = Client$8<RequestFn$5, Config$6, MethodFn$5, BuildUrlFn$5, SseFn$5> & {
  interceptors: Middleware$3<HttpRequest<unknown>, HttpResponse<unknown>, unknown, ResolvedRequestOptions$3>;
  requestOptions: RequestOptionsFn;
};
interface TDataShape$5 {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}
type OmitKeys$5<T$1, K$1> = Pick<T$1, Exclude<keyof T$1, K$1>>;
type Options$6<TData$1 extends TDataShape$5 = TDataShape$5, ThrowOnError$1 extends boolean = boolean, TResponse = unknown, TResponseStyle$1 extends ResponseStyle$2 = 'fields'> = OmitKeys$5<RequestOptions$5<TResponse, TResponseStyle$1, ThrowOnError$1>, 'body' | 'path' | 'query' | 'url'> & Omit<TData$1, 'url'>;
//#endregion
//#region src/plugins/@hey-api/client-axios/bundle/types.d.ts
interface Config$5<T$1 extends ClientOptions$4 = ClientOptions$4> extends Omit<CreateAxiosDefaults, 'auth' | 'baseURL' | 'headers' | 'method'>, Config {
  /**
   * Axios implementation. You can use this option to provide either an
   * `AxiosStatic` or an `AxiosInstance`.
   *
   * @default axios
   */
  axios?: AxiosStatic | AxiosInstance;
  /**
   * Base URL for all requests made by this client.
   */
  baseURL?: T$1['baseURL'];
  /**
   * An object containing any HTTP headers that you want to pre-populate your
   * `Headers` object with.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/Headers/Headers#init See more}
   */
  headers?: AxiosRequestHeaders | Record<string, string | number | boolean | (string | number | boolean)[] | null | undefined | unknown>;
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: T$1['throwOnError'];
}
interface RequestOptions$4<TData$1 = unknown, ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends Config$5<{
  throwOnError: ThrowOnError$1;
}>, Pick<ServerSentEventsOptions<TData$1>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
  /**
   * Any body that you want to add to your request.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  /**
   * Security mechanism(s) to use for the request.
   */
  security?: ReadonlyArray<Auth>;
  url: Url;
}
interface ClientOptions$4 {
  baseURL?: string;
  throwOnError?: boolean;
}
type RequestResult$4<TData$1 = unknown, TError$1 = unknown, ThrowOnError$1 extends boolean = boolean> = ThrowOnError$1 extends true ? Promise<AxiosResponse<TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1>> : Promise<(AxiosResponse<TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1> & {
  error: undefined;
}) | (AxiosError<TError$1 extends Record<string, unknown> ? TError$1[keyof TError$1] : TError$1> & {
  data: undefined;
  error: TError$1 extends Record<string, unknown> ? TError$1[keyof TError$1] : TError$1;
})>;
type MethodFn$4 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$4<TData, ThrowOnError>, 'method'>) => RequestResult$4<TData, TError, ThrowOnError>;
type SseFn$4 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$4<TData, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;
type RequestFn$4 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$4<TData, ThrowOnError>, 'method'> & Pick<Required<RequestOptions$4<TData, ThrowOnError>>, 'method'>) => RequestResult$4<TData, TError, ThrowOnError>;
type BuildUrlFn$4 = <TData extends {
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  url: string;
}>(options: Pick<TData, 'url'> & Options$5<TData>) => string;
type Client$1 = Client$8<RequestFn$4, Config$5, MethodFn$4, BuildUrlFn$4, SseFn$4> & {
  instance: AxiosInstance;
};
interface TDataShape$4 {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}
type OmitKeys$4<T$1, K$1> = Pick<T$1, Exclude<keyof T$1, K$1>>;
type Options$5<TData$1 extends TDataShape$4 = TDataShape$4, ThrowOnError$1 extends boolean = boolean, TResponse = unknown> = OmitKeys$4<RequestOptions$4<TResponse, ThrowOnError$1>, 'body' | 'path' | 'query' | 'url'> & Omit<TData$1, 'url'>;
//#endregion
//#region src/plugins/@hey-api/client-fetch/bundle/utils.d.ts
type ErrInterceptor$2<Err$1, Res$1, Req$1, Options$7> = (error: Err$1, response: Res$1, request: Req$1, options: Options$7) => Err$1 | Promise<Err$1>;
type ReqInterceptor$2<Req$1, Options$7> = (request: Req$1, options: Options$7) => Req$1 | Promise<Req$1>;
type ResInterceptor$2<Res$1, Req$1, Options$7> = (response: Res$1, request: Req$1, options: Options$7) => Res$1 | Promise<Res$1>;
declare class Interceptors$2<Interceptor> {
  fns: Array<Interceptor | null>;
  clear(): void;
  eject(id: number | Interceptor): void;
  exists(id: number | Interceptor): boolean;
  getInterceptorIndex(id: number | Interceptor): number;
  update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false;
  use(fn: Interceptor): number;
}
interface Middleware$2<Req$1, Res$1, Err$1, Options$7> {
  error: Interceptors$2<ErrInterceptor$2<Err$1, Res$1, Req$1, Options$7>>;
  request: Interceptors$2<ReqInterceptor$2<Req$1, Options$7>>;
  response: Interceptors$2<ResInterceptor$2<Res$1, Req$1, Options$7>>;
}
//#endregion
//#region src/plugins/@hey-api/client-fetch/bundle/types.d.ts
type ResponseStyle$1 = 'data' | 'fields';
interface Config$4<T$1 extends ClientOptions$3 = ClientOptions$3> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config {
  /**
   * Base URL for all requests made by this client.
   */
  baseUrl?: T$1['baseUrl'];
  /**
   * Fetch API implementation. You can use this option to provide a custom
   * fetch instance.
   *
   * @default globalThis.fetch
   */
  fetch?: typeof fetch;
  /**
   * Please don't use the Fetch client for Next.js applications. The `next`
   * options won't have any effect.
   *
   * Install {@link https://www.npmjs.com/package/@hey-api/client-next `@hey-api/client-next`} instead.
   */
  next?: never;
  /**
   * Return the response data parsed in a specified format. By default, `auto`
   * will infer the appropriate method from the `Content-Type` response header.
   * You can override this behavior with any of the {@link Body} methods.
   * Select `stream` if you don't want to parse response data at all.
   *
   * @default 'auto'
   */
  parseAs?: 'arrayBuffer' | 'auto' | 'blob' | 'formData' | 'json' | 'stream' | 'text';
  /**
   * Should we return only data or multiple fields (data, error, response, etc.)?
   *
   * @default 'fields'
   */
  responseStyle?: ResponseStyle$1;
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: T$1['throwOnError'];
}
interface RequestOptions$3<TData$1 = unknown, TResponseStyle$1 extends ResponseStyle$1 = 'fields', ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends Config$4<{
  responseStyle: TResponseStyle$1;
  throwOnError: ThrowOnError$1;
}>, Pick<ServerSentEventsOptions<TData$1>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
  /**
   * Any body that you want to add to your request.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  /**
   * Security mechanism(s) to use for the request.
   */
  security?: ReadonlyArray<Auth>;
  url: Url;
}
interface ResolvedRequestOptions$2<TResponseStyle$1 extends ResponseStyle$1 = 'fields', ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends RequestOptions$3<unknown, TResponseStyle$1, ThrowOnError$1, Url> {
  serializedBody?: string;
}
type RequestResult$3<TData$1 = unknown, TError$1 = unknown, ThrowOnError$1 extends boolean = boolean, TResponseStyle$1 extends ResponseStyle$1 = 'fields'> = ThrowOnError$1 extends true ? Promise<TResponseStyle$1 extends 'data' ? TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1 : {
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  request: Request;
  response: Response;
}> : Promise<TResponseStyle$1 extends 'data' ? (TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1) | undefined : ({
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  error: undefined;
} | {
  data: undefined;
  error: TError$1 extends Record<string, unknown> ? TError$1[keyof TError$1] : TError$1;
}) & {
  request: Request;
  response: Response;
}>;
interface ClientOptions$3 {
  baseUrl?: string;
  responseStyle?: ResponseStyle$1;
  throwOnError?: boolean;
}
type MethodFn$3 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle$1 = 'fields'>(options: Omit<RequestOptions$3<TData, TResponseStyle, ThrowOnError>, 'method'>) => RequestResult$3<TData, TError, ThrowOnError, TResponseStyle>;
type SseFn$3 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle$1 = 'fields'>(options: Omit<RequestOptions$3<TData, TResponseStyle, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;
type RequestFn$3 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle$1 = 'fields'>(options: Omit<RequestOptions$3<TData, TResponseStyle, ThrowOnError>, 'method'> & Pick<Required<RequestOptions$3<TData, TResponseStyle, ThrowOnError>>, 'method'>) => RequestResult$3<TData, TError, ThrowOnError, TResponseStyle>;
type BuildUrlFn$3 = <TData extends {
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  url: string;
}>(options: Pick<TData, 'url'> & Options$4<TData>) => string;
type Client$3 = Client$8<RequestFn$3, Config$4, MethodFn$3, BuildUrlFn$3, SseFn$3> & {
  interceptors: Middleware$2<Request, Response, unknown, ResolvedRequestOptions$2>;
};
interface TDataShape$3 {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}
type OmitKeys$3<T$1, K$1> = Pick<T$1, Exclude<keyof T$1, K$1>>;
type Options$4<TData$1 extends TDataShape$3 = TDataShape$3, ThrowOnError$1 extends boolean = boolean, TResponse = unknown, TResponseStyle$1 extends ResponseStyle$1 = 'fields'> = OmitKeys$3<RequestOptions$3<TResponse, TResponseStyle$1, ThrowOnError$1>, 'body' | 'path' | 'query' | 'url'> & Omit<TData$1, 'url'>;
//#endregion
//#region src/plugins/@hey-api/client-next/bundle/utils.d.ts
type ErrInterceptor$1<Err$1, Res$1, Options$7> = (error: Err$1, response: Res$1, options: Options$7) => Err$1 | Promise<Err$1>;
type ReqInterceptor$1<Options$7> = (options: Options$7) => void | Promise<void>;
type ResInterceptor$1<Res$1, Options$7> = (response: Res$1, options: Options$7) => Res$1 | Promise<Res$1>;
declare class Interceptors$1<Interceptor> {
  fns: Array<Interceptor | null>;
  clear(): void;
  eject(id: number | Interceptor): void;
  exists(id: number | Interceptor): boolean;
  getInterceptorIndex(id: number | Interceptor): number;
  update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false;
  use(fn: Interceptor): number;
}
interface Middleware$1<Res$1, Err$1, Options$7> {
  error: Interceptors$1<ErrInterceptor$1<Err$1, Res$1, Options$7>>;
  request: Interceptors$1<ReqInterceptor$1<Options$7>>;
  response: Interceptors$1<ResInterceptor$1<Res$1, Options$7>>;
}
//#endregion
//#region src/plugins/@hey-api/client-next/bundle/types.d.ts
interface Config$3<T$1 extends ClientOptions$2 = ClientOptions$2> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config {
  /**
   * Base URL for all requests made by this client.
   */
  baseUrl?: T$1['baseUrl'];
  /**
   * Fetch API implementation. You can use this option to provide a custom
   * fetch instance.
   *
   * @default globalThis.fetch
   */
  fetch?: typeof fetch;
  /**
   * Return the response data parsed in a specified format. By default, `auto`
   * will infer the appropriate method from the `Content-Type` response header.
   * You can override this behavior with any of the {@link Body} methods.
   * Select `stream` if you don't want to parse response data at all.
   *
   * @default 'auto'
   */
  parseAs?: 'arrayBuffer' | 'auto' | 'blob' | 'formData' | 'json' | 'stream' | 'text';
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: T$1['throwOnError'];
}
interface RequestOptions$2<TData$1 = unknown, ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends Config$3<{
  throwOnError: ThrowOnError$1;
}>, Pick<ServerSentEventsOptions<TData$1>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
  /**
   * Any body that you want to add to your request.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  /**
   * Security mechanism(s) to use for the request.
   */
  security?: ReadonlyArray<Auth>;
  url: Url;
}
interface ResolvedRequestOptions$1<ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends RequestOptions$2<unknown, ThrowOnError$1, Url> {
  serializedBody?: string;
}
type RequestResult$2<TData$1 = unknown, TError$1 = unknown, ThrowOnError$1 extends boolean = boolean> = ThrowOnError$1 extends true ? Promise<{
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  response: Response;
}> : Promise<({
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  error: undefined;
} | {
  data: undefined;
  error: TError$1 extends Record<string, unknown> ? TError$1[keyof TError$1] : TError$1;
}) & {
  response: Response;
}>;
interface ClientOptions$2 {
  baseUrl?: string;
  throwOnError?: boolean;
}
type MethodFn$2 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$2<TData, ThrowOnError>, 'method'>) => RequestResult$2<TData, TError, ThrowOnError>;
type SseFn$2 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$2<TData, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;
type RequestFn$2 = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false>(options: Omit<RequestOptions$2<TData, ThrowOnError>, 'method'> & Pick<Required<RequestOptions$2<TData, ThrowOnError>>, 'method'>) => RequestResult$2<TData, TError, ThrowOnError>;
type BuildUrlFn$2 = <TData extends {
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  url: string;
}>(options: Pick<TData, 'url'> & Options$3<TData>) => string;
type Client$4 = Client$8<RequestFn$2, Config$3, MethodFn$2, BuildUrlFn$2, SseFn$2> & {
  interceptors: Middleware$1<Response, unknown, ResolvedRequestOptions$1>;
};
interface TDataShape$2 {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}
type OmitKeys$2<T$1, K$1> = Pick<T$1, Exclude<keyof T$1, K$1>>;
type Options$3<TData$1 extends TDataShape$2 = TDataShape$2, ThrowOnError$1 extends boolean = boolean, TResponse = unknown> = OmitKeys$2<RequestOptions$2<TResponse, ThrowOnError$1>, 'body' | 'path' | 'query' | 'url'> & Omit<TData$1, 'url'>;
//#endregion
//#region src/plugins/@hey-api/client-nuxt/bundle/types.d.ts
type QuerySerializer = (query: Parameters<Client$5['buildUrl']>[0]['query']) => string;
type WithRefs<TData$1> = { [K in keyof TData$1]: NonNullable<TData$1[K]> extends object ? WithRefs<NonNullable<TData$1[K]>> | Ref<NonNullable<TData$1[K]>> : NonNullable<TData$1[K]> | Ref<NonNullable<TData$1[K]>> };
type KeysOf<T$1> = Array<T$1 extends T$1 ? (keyof T$1 extends string ? keyof T$1 : never) : never>;
interface Config$2<T$1 extends ClientOptions$1 = ClientOptions$1> extends Omit<FetchOptions$1<unknown>, 'baseURL' | 'body' | 'headers' | 'method' | 'query'>, WithRefs<Pick<FetchOptions$1<unknown>, 'query'>>, Omit<Config, 'querySerializer'> {
  /**
   * Base URL for all requests made by this client.
   */
  baseURL?: T$1['baseURL'];
  /**
   * A function for serializing request query parameters. By default, arrays
   * will be exploded in form style, objects will be exploded in deepObject
   * style, and reserved characters are percent-encoded.
   *
   * {@link https://swagger.io/docs/specification/serialization/#query View examples}
   */
  querySerializer?: QuerySerializer | QuerySerializerOptions;
}
interface RequestOptions$1<TComposable$1 extends Composable = '$fetch', ResT$1 = unknown, DefaultT$1 = undefined, Url extends string = string> extends Config$2, WithRefs<{
  /**
   * Any body that you want to add to your request.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  path?: FetchOptions$1<unknown>['query'];
  query?: FetchOptions$1<unknown>['query'];
  rawBody?: unknown;
}>, Pick<ServerSentEventsOptions<ResT$1>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
  asyncDataOptions?: AsyncDataOptions<ResT$1, ResT$1, KeysOf<ResT$1>, DefaultT$1>;
  composable?: TComposable$1;
  key?: string;
  /**
   * Security mechanism(s) to use for the request.
   */
  security?: ReadonlyArray<Auth>;
  url: Url;
}
type RequestResult$1<TComposable$1 extends Composable, ResT$1, TError$1> = TComposable$1 extends '$fetch' ? ReturnType<typeof $fetch<ResT$1>> : TComposable$1 extends 'useAsyncData' ? ReturnType<typeof useAsyncData<ResT$1 | null, TError$1>> : TComposable$1 extends 'useFetch' ? ReturnType<typeof useFetch<ResT$1 | null, TError$1>> : TComposable$1 extends 'useLazyAsyncData' ? ReturnType<typeof useLazyAsyncData<ResT$1 | null, TError$1>> : TComposable$1 extends 'useLazyFetch' ? ReturnType<typeof useLazyFetch<ResT$1 | null, TError$1>> : never;
interface ClientOptions$1 {
  baseURL?: string;
}
type MethodFn$1 = <TComposable extends Composable = '$fetch', ResT = unknown, TError = unknown, DefaultT = undefined>(options: Omit<RequestOptions$1<TComposable, ResT, DefaultT>, 'method'>) => RequestResult$1<TComposable, ResT, TError>;
type SseFn$1 = <TComposable extends Composable = '$fetch', ResT = unknown, TError = unknown, DefaultT = undefined>(options: Omit<RequestOptions$1<TComposable, ResT, DefaultT>, 'method'>) => Promise<ServerSentEventsResult<RequestResult$1<TComposable, ResT, TError>>>;
type RequestFn$1 = <TComposable extends Composable = '$fetch', ResT = unknown, TError = unknown, DefaultT = undefined>(options: Omit<RequestOptions$1<TComposable, ResT, DefaultT>, 'method'> & Pick<Required<RequestOptions$1<TComposable, ResT, DefaultT>>, 'method'>) => RequestResult$1<TComposable, ResT, TError>;
/**
 * The `createClientConfig()` function will be called on client initialization
 * and the returned object will become the client's initial configuration.
 *
 * You may want to initialize your client this way instead of calling
 * `setConfig()`. This is useful for example if you're using Next.js
 * to ensure your client always has the correct values.
 */

interface TDataShape$1 {
  body?: unknown;
  headers?: unknown;
  path?: FetchOptions$1<unknown>['query'];
  query?: FetchOptions$1<unknown>['query'];
  url: string;
}
type BuildUrlOptions<TData$1 extends Omit<TDataShape$1, 'headers'> = Omit<TDataShape$1, 'headers'>> = Pick<WithRefs<TData$1>, 'path' | 'query'> & Pick<TData$1, 'url'> & Pick<Options$2<'$fetch', TData$1>, 'baseURL' | 'querySerializer'>;
type BuildUrlFn$1 = <TData extends Omit<TDataShape$1, 'headers'>>(options: BuildUrlOptions<TData>) => string;
type Client$5 = Client$8<RequestFn$1, Config$2, MethodFn$1, BuildUrlFn$1, SseFn$1>;
type OmitKeys$1<T$1, K$1> = Pick<T$1, Exclude<keyof T$1, K$1>>;
type Options$2<TComposable$1 extends Composable = '$fetch', TData$1 extends TDataShape$1 = TDataShape$1, ResT$1 = unknown, DefaultT$1 = undefined> = OmitKeys$1<RequestOptions$1<TComposable$1, ResT$1, DefaultT$1>, 'body' | 'path' | 'query' | 'url'> & WithRefs<Omit<TData$1, 'url'>>;
type FetchOptions$1<TData$1> = Omit<UseFetchOptions<TData$1, TData$1>, keyof AsyncDataOptions<TData$1>>;
type Composable = '$fetch' | 'useAsyncData' | 'useFetch' | 'useLazyAsyncData' | 'useLazyFetch';
//#endregion
//#region src/plugins/@hey-api/client-ofetch/bundle/utils.d.ts
type ErrInterceptor<Err$1, Res$1, Req$1, Options$7> = (error: Err$1, response: Res$1, request: Req$1, options: Options$7) => Err$1 | Promise<Err$1>;
type ReqInterceptor<Req$1, Options$7> = (request: Req$1, options: Options$7) => Req$1 | Promise<Req$1>;
type ResInterceptor<Res$1, Req$1, Options$7> = (response: Res$1, request: Req$1, options: Options$7) => Res$1 | Promise<Res$1>;
declare class Interceptors<Interceptor> {
  fns: Array<Interceptor | null>;
  clear(): void;
  eject(id: number | Interceptor): void;
  exists(id: number | Interceptor): boolean;
  getInterceptorIndex(id: number | Interceptor): number;
  update(id: number | Interceptor, fn: Interceptor): number | Interceptor | false;
  use(fn: Interceptor): number;
}
interface Middleware<Req$1, Res$1, Err$1, Options$7> {
  error: Interceptors<ErrInterceptor<Err$1, Res$1, Req$1, Options$7>>;
  request: Interceptors<ReqInterceptor<Req$1, Options$7>>;
  response: Interceptors<ResInterceptor<Res$1, Req$1, Options$7>>;
}
//#endregion
//#region src/plugins/@hey-api/client-ofetch/bundle/types.d.ts
type ResponseStyle = 'data' | 'fields';
interface Config$1<T$1 extends ClientOptions = ClientOptions> extends Omit<RequestInit, 'body' | 'headers' | 'method'>, Config {
  /**
   * HTTP(S) agent configuration (Node.js only). Passed through to ofetch.
   */
  agent?: FetchOptions['agent'];
  /**
   * Base URL for all requests made by this client.
   */
  baseUrl?: T$1['baseUrl'];
  /**
   * Node-only proxy/agent options.
   */
  dispatcher?: FetchOptions['dispatcher'];
  /**
   * Fetch API implementation. Used for SSE streaming. You can use this option
   * to provide a custom fetch instance.
   *
   * @default globalThis.fetch
   */
  fetch?: typeof fetch;
  /**
   * Controls the native ofetch behaviour that throws `FetchError` when
   * `response.ok === false`. We default to suppressing it to match the fetch
   * client semantics and let `throwOnError` drive the outcome.
   */
  ignoreResponseError?: FetchOptions['ignoreResponseError'];
  /**
   * Please don't use the Fetch client for Next.js applications. The `next`
   * options won't have any effect.
   *
   * Install {@link https://www.npmjs.com/package/@hey-api/client-next `@hey-api/client-next`} instead.
   */
  next?: never;
  /**
   * Custom ofetch instance created via `ofetch.create()`. If provided, it will
   * be used for requests instead of the default `ofetch` export.
   */
  ofetch?: typeof ofetch;
  /**
   * ofetch hook called before a request is sent.
   */
  onRequest?: FetchOptions['onRequest'];
  /**
   * ofetch hook called when a request fails before receiving a response
   * (e.g., network errors or aborted requests).
   */
  onRequestError?: FetchOptions['onRequestError'];
  /**
   * ofetch hook called after a successful response is received and parsed.
   */
  onResponse?: FetchOptions['onResponse'];
  /**
   * ofetch hook called when the response indicates an error (non-ok status)
   * or when response parsing fails.
   */
  onResponseError?: FetchOptions['onResponseError'];
  /**
   * Return the response data parsed in a specified format. By default, `auto`
   * will infer the appropriate method from the `Content-Type` response header.
   * You can override this behavior with any of the {@link Body} methods.
   * Select `stream` if you don't want to parse response data at all.
   *
   * @default 'auto'
   */
  parseAs?: 'arrayBuffer' | 'auto' | 'blob' | 'formData' | 'json' | 'stream' | 'text';
  /** Custom response parser (ofetch). */
  parseResponse?: FetchOptions['parseResponse'];
  /**
   * Should we return only data or multiple fields (data, error, response, etc.)?
   *
   * @default 'fields'
   */
  responseStyle?: ResponseStyle;
  /**
   * ofetch responseType override. If provided, it will be passed directly to
   * ofetch and take precedence over `parseAs`.
   */
  responseType?: ResponseType;
  /**
   * Automatically retry failed requests.
   */
  retry?: FetchOptions['retry'];
  /**
   * Delay (in ms) between retry attempts.
   */
  retryDelay?: FetchOptions['retryDelay'];
  /**
   * HTTP status codes that should trigger a retry.
   */
  retryStatusCodes?: FetchOptions['retryStatusCodes'];
  /**
   * Throw an error instead of returning it in the response?
   *
   * @default false
   */
  throwOnError?: T$1['throwOnError'];
  /**
   * Abort the request after the given milliseconds.
   */
  timeout?: number;
}
interface RequestOptions<TData$1 = unknown, TResponseStyle$1 extends ResponseStyle = 'fields', ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends Config$1<{
  responseStyle: TResponseStyle$1;
  throwOnError: ThrowOnError$1;
}>, Pick<ServerSentEventsOptions<TData$1>, 'onSseError' | 'onSseEvent' | 'sseDefaultRetryDelay' | 'sseMaxRetryAttempts' | 'sseMaxRetryDelay'> {
  /**
   * Any body that you want to add to your request.
   *
   * {@link https://developer.mozilla.org/docs/Web/API/fetch#body}
   */
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  /**
   * Security mechanism(s) to use for the request.
   */
  security?: ReadonlyArray<Auth>;
  url: Url;
}
interface ResolvedRequestOptions<TResponseStyle$1 extends ResponseStyle = 'fields', ThrowOnError$1 extends boolean = boolean, Url extends string = string> extends RequestOptions<unknown, TResponseStyle$1, ThrowOnError$1, Url> {
  serializedBody?: string;
}
type RequestResult<TData$1 = unknown, TError$1 = unknown, ThrowOnError$1 extends boolean = boolean, TResponseStyle$1 extends ResponseStyle = 'fields'> = ThrowOnError$1 extends true ? Promise<TResponseStyle$1 extends 'data' ? TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1 : {
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  request: Request;
  response: Response;
}> : Promise<TResponseStyle$1 extends 'data' ? (TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1) | undefined : ({
  data: TData$1 extends Record<string, unknown> ? TData$1[keyof TData$1] : TData$1;
  error: undefined;
} | {
  data: undefined;
  error: TError$1 extends Record<string, unknown> ? TError$1[keyof TError$1] : TError$1;
}) & {
  request: Request;
  response: Response;
}>;
interface ClientOptions {
  baseUrl?: string;
  responseStyle?: ResponseStyle;
  throwOnError?: boolean;
}
type MethodFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type SseFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'>) => Promise<ServerSentEventsResult<TData, TError>>;
type RequestFn = <TData = unknown, TError = unknown, ThrowOnError extends boolean = false, TResponseStyle extends ResponseStyle = 'fields'>(options: Omit<RequestOptions<TData, TResponseStyle, ThrowOnError>, 'method'> & Pick<Required<RequestOptions<TData, TResponseStyle, ThrowOnError>>, 'method'>) => RequestResult<TData, TError, ThrowOnError, TResponseStyle>;
type BuildUrlFn = <TData extends {
  body?: unknown;
  path?: Record<string, unknown>;
  query?: Record<string, unknown>;
  url: string;
}>(options: Pick<TData, 'url'> & Options$1<TData>) => string;
type Client$6 = Client$8<RequestFn, Config$1, MethodFn, BuildUrlFn, SseFn> & {
  interceptors: Middleware<Request, Response, unknown, ResolvedRequestOptions>;
};
interface TDataShape {
  body?: unknown;
  headers?: unknown;
  path?: unknown;
  query?: unknown;
  url: string;
}
type OmitKeys<T$1, K$1> = Pick<T$1, Exclude<keyof T$1, K$1>>;
type Options$1<TData$1 extends TDataShape = TDataShape, ThrowOnError$1 extends boolean = boolean, TResponse = unknown, TResponseStyle$1 extends ResponseStyle = 'fields'> = OmitKeys<RequestOptions<TResponse, TResponseStyle$1, ThrowOnError$1>, 'body' | 'path' | 'query' | 'url'> & Omit<TData$1, 'url'>;
//#endregion
//#region src/generate.d.ts
/**
 * Generate a client from the provided configuration.
 *
 * @param userConfig User provided {@link UserConfig} configuration(s).
 */
declare const createClient: (userConfig?: LazyOrAsync<MaybeArray<UserConfig>>, logger?: Logger) => Promise<ReadonlyArray<Client$7 | IR.Context>>;
//#endregion
//#region src/config/parser.d.ts
declare const defaultPaginationKeywords: readonly ["after", "before", "cursor", "offset", "page", "start"];
//#endregion
//#region src/config/plugins.d.ts
/**
 * Default plugins used to generate artifacts if plugins aren't specified.
 */
declare const defaultPlugins: readonly ["@hey-api/typescript", "@hey-api/sdk"];
//#endregion
//#region src/plugins/@hey-api/client-core/config.d.ts
declare const clientDefaultConfig: {
  readonly baseUrl: true;
  readonly bundle: true;
  readonly exportFromIndex: false;
};
declare const clientDefaultMeta: {
  readonly dependencies: readonly ["@hey-api/typescript"];
  readonly tags: readonly ["client"];
};
//#endregion
//#region src/plugins/@hey-api/client-core/plugin.d.ts
declare const clientPluginHandler: ({
  plugin
}: Parameters<PluginHandler>[0]) => void;
//#endregion
//#region src/plugins/shared/utils/config.d.ts
declare const definePluginConfig: <T extends Plugin.Types>(defaultConfig: Plugin.Config<T>) => (userConfig?: Omit<Plugin.UserConfig<T["config"]>, "name">) => Omit<Plugin.Config<T>, "name"> & {
  /**
   * Cast name to `any` so it doesn't throw type error in `plugins` array.
   * We could allow any `string` as plugin `name` in the object syntax, but
   * that TypeScript trick would cause all string methods to appear as
   * suggested auto completions, which is undesirable.
   */
  name: any;
};
declare namespace module_d_exports {
  export { ImportExportItem, createCallExpression, createConstVariable, createExportAllDeclaration, createNamedExportDeclarations, createNamedImportDeclarations };
}
/**
 * Create export all declaration. Example: `export * from './y'`.
 * @param module - module containing exports
 * @returns ts.ExportDeclaration
 */
declare const createExportAllDeclaration: ({
  module,
  shouldAppendJs
}: {
  module: string;
  shouldAppendJs?: boolean;
}) => ts.ExportDeclaration;
type ImportExportItem = ImportExportItemObject | string;
declare const createCallExpression: ({
  functionName,
  parameters,
  types
}: {
  functionName: string | ts.PropertyAccessExpression | ts.PropertyAccessChain | ts.ElementAccessExpression | ts.Expression;
  parameters?: Array<string | ts.Expression | undefined>;
  types?: ReadonlyArray<ts.TypeNode>;
}) => ts.CallExpression;
/**
 * Create a named export declaration. Example: `export { X } from './y'`.
 * @param exports - named imports to export
 * @param module - module containing exports
 * @returns ts.ExportDeclaration
 */
declare const createNamedExportDeclarations: ({
  exports,
  module
}: {
  exports: Array<ImportExportItem> | ImportExportItem;
  module: string;
}) => ts.ExportDeclaration;
/**
 * Create a const variable. Optionally, it can use const assertion or export
 * statement. Example: `export x = {} as const`.
 * @param assertion use const assertion?
 * @param exportConst export created variable?
 * @param expression expression for the variable.
 * @param name name of the variable.
 * @returns ts.VariableStatement
 */
declare const createConstVariable: ({
  assertion,
  comment,
  destructure,
  exportConst,
  expression,
  name,
  typeName
}: {
  assertion?: "const" | ts.TypeNode;
  comment?: Comments;
  destructure?: boolean;
  exportConst?: boolean;
  expression: ts.Expression;
  name: string | ts.TypeReferenceNode;
  typeName?: string | ts.IndexedAccessTypeNode | ts.TypeNode;
}) => ts.VariableStatement;
/**
 * Create a named import declaration. Example: `import { X } from './y'`.
 * @param imports - named exports to import
 * @param module - module containing imports
 * @returns ts.ImportDeclaration
 */
declare const createNamedImportDeclarations: ({
  imports,
  module
}: {
  imports: Array<ImportExportItem> | ImportExportItem;
  module: string;
}) => ts.ImportDeclaration;
//#endregion
//#region src/tsc/typedef.d.ts
type Property = {
  comment?: Comments;
  isReadOnly?: boolean;
  isRequired?: boolean;
  name: string | ts.PropertyName;
  type: any | ts.TypeNode;
};
//#endregion
//#region src/tsc/index.d.ts
declare const tsc: {
  anonymousFunction: ({
    async,
    comment,
    multiLine,
    parameters,
    returnType,
    statements,
    types: types_d_exports
  }: {
    async?: boolean;
    comment?: Comments;
    multiLine?: boolean;
    parameters?: FunctionParameter[];
    returnType?: string | typescript0.TypeNode;
    statements?: ReadonlyArray<typescript0.Statement>;
    types?: FunctionTypeParameter[];
  }) => typescript0.FunctionExpression;
  arrayLiteralExpression: <T>({
    elements,
    multiLine
  }: {
    elements: T[];
    multiLine?: boolean;
  }) => typescript0.ArrayLiteralExpression;
  arrowFunction: ({
    async,
    comment,
    multiLine,
    parameters,
    returnType,
    statements,
    types: types_d_exports
  }: {
    async?: boolean;
    comment?: Comments;
    multiLine?: boolean;
    parameters?: ReadonlyArray<FunctionParameter>;
    returnType?: string | typescript0.TypeNode;
    statements?: typescript0.Statement[] | typescript0.Expression;
    types?: FunctionTypeParameter[];
  }) => typescript0.ArrowFunction;
  asExpression: ({
    expression,
    type
  }: {
    expression: typescript0.Expression;
    type: typescript0.TypeNode;
  }) => typescript0.AsExpression;
  assignment: ({
    left,
    right
  }: {
    left: typescript0.Expression;
    right: typescript0.Expression;
  }) => typescript0.AssignmentExpression<typescript0.EqualsToken>;
  awaitExpression: ({
    expression
  }: {
    expression: typescript0.Expression;
  }) => typescript0.AwaitExpression;
  binaryExpression: ({
    left,
    operator,
    right
  }: {
    left: typescript0.Expression;
    operator?: "=" | "===" | "!==" | "in" | "??";
    right: typescript0.Expression | string;
  }) => typescript0.BinaryExpression;
  block: ({
    multiLine,
    statements
  }: {
    multiLine?: boolean;
    statements: ReadonlyArray<typescript0.Statement>;
  }) => typescript0.Block;
  callExpression: ({
    functionName,
    parameters,
    types: types_d_exports
  }: {
    functionName: string | typescript0.PropertyAccessExpression | typescript0.PropertyAccessChain | typescript0.ElementAccessExpression | typescript0.Expression;
    parameters?: Array<string | typescript0.Expression | undefined>;
    types?: ReadonlyArray<typescript0.TypeNode>;
  }) => typescript0.CallExpression;
  classDeclaration: ({
    decorator,
    exportClass,
    extendedClasses,
    name,
    nodes
  }: {
    decorator?: {
      args: any[];
      name: string;
    };
    exportClass?: boolean;
    extendedClasses?: ReadonlyArray<string>;
    name: string;
    nodes: ReadonlyArray<typescript0.ClassElement>;
  }) => typescript0.ClassDeclaration;
  conditionalExpression: ({
    condition,
    whenFalse,
    whenTrue
  }: {
    condition: typescript0.Expression;
    whenFalse: typescript0.Expression;
    whenTrue: typescript0.Expression;
  }) => typescript0.ConditionalExpression;
  constVariable: ({
    assertion,
    comment,
    destructure,
    exportConst,
    expression,
    name,
    typeName
  }: {
    assertion?: "const" | typescript0.TypeNode;
    comment?: Comments;
    destructure?: boolean;
    exportConst?: boolean;
    expression: typescript0.Expression;
    name: string | typescript0.TypeReferenceNode;
    typeName?: string | typescript0.IndexedAccessTypeNode | typescript0.TypeNode;
  }) => typescript0.VariableStatement;
  constructorDeclaration: ({
    accessLevel,
    comment,
    multiLine,
    parameters,
    statements
  }: {
    accessLevel?: AccessLevel;
    comment?: Comments;
    multiLine?: boolean;
    parameters?: FunctionParameter[];
    statements?: typescript0.Statement[];
  }) => typescript0.ConstructorDeclaration;
  enumDeclaration: <T extends Record<string, any> | Array<ObjectValue>>({
    asConst,
    comments: enumMemberComments,
    leadingComment: comments,
    name,
    obj
  }: {
    asConst: boolean;
    comments?: Record<string | number, Comments>;
    leadingComment?: Comments;
    name: string | typescript0.TypeReferenceNode;
    obj: T;
  }) => typescript0.EnumDeclaration;
  exportAllDeclaration: ({
    module: module_d_exports,
    shouldAppendJs
  }: {
    module: string;
    shouldAppendJs?: boolean;
  }) => typescript0.ExportDeclaration;
  exportNamedDeclaration: ({
    exports,
    module: module_d_exports
  }: {
    exports: Array<ImportExportItem> | ImportExportItem;
    module: string;
  }) => typescript0.ExportDeclaration;
  expressionToStatement: ({
    expression
  }: {
    expression: typescript0.Expression;
  }) => typescript0.ExpressionStatement;
  forOfStatement: ({
    awaitModifier,
    expression,
    initializer,
    statement
  }: {
    awaitModifier?: typescript0.AwaitKeyword;
    expression: typescript0.Expression;
    initializer: typescript0.ForInitializer;
    statement: typescript0.Statement;
  }) => typescript0.ForOfStatement;
  functionTypeNode: ({
    parameters,
    returnType,
    typeParameters
  }: {
    parameters?: typescript0.ParameterDeclaration[];
    returnType: typescript0.TypeNode;
    typeParameters?: typescript0.TypeParameterDeclaration[];
  }) => typescript0.FunctionTypeNode;
  getAccessorDeclaration: ({
    name,
    returnType,
    statements
  }: {
    name: string | typescript0.PropertyName;
    returnType?: string | typescript0.Identifier;
    statements: ReadonlyArray<typescript0.Statement>;
  }) => typescript0.GetAccessorDeclaration;
  identifier: ({
    text
  }: {
    text: string;
  }) => typescript0.Identifier;
  ifStatement: ({
    elseStatement,
    expression,
    thenStatement
  }: {
    elseStatement?: typescript0.Statement;
    expression: typescript0.Expression;
    thenStatement: typescript0.Statement;
  }) => typescript0.IfStatement;
  indexedAccessTypeNode: ({
    indexType,
    objectType
  }: {
    indexType: typescript0.TypeNode;
    objectType: typescript0.TypeNode;
  }) => typescript0.IndexedAccessTypeNode;
  isTsNode: (node: any) => node is typescript0.Expression;
  keywordTypeNode: ({
    keyword
  }: {
    keyword: Extract<SyntaxKindKeyword, "any" | "boolean" | "never" | "number" | "string" | "undefined" | "unknown" | "void">;
  }) => typescript0.KeywordTypeNode<typescript0.SyntaxKind.VoidKeyword | typescript0.SyntaxKind.AnyKeyword | typescript0.SyntaxKind.BooleanKeyword | typescript0.SyntaxKind.NeverKeyword | typescript0.SyntaxKind.NumberKeyword | typescript0.SyntaxKind.StringKeyword | typescript0.SyntaxKind.UndefinedKeyword | typescript0.SyntaxKind.UnknownKeyword>;
  literalTypeNode: ({
    literal
  }: {
    literal: typescript0.LiteralTypeNode["literal"];
  }) => typescript0.LiteralTypeNode;
  mappedTypeNode: ({
    members,
    nameType,
    questionToken,
    readonlyToken,
    type,
    typeParameter
  }: {
    members?: typescript0.NodeArray<typescript0.TypeElement>;
    nameType?: typescript0.TypeNode;
    questionToken?: typescript0.QuestionToken | typescript0.PlusToken | typescript0.MinusToken;
    readonlyToken?: typescript0.ReadonlyKeyword | typescript0.PlusToken | typescript0.MinusToken;
    type?: typescript0.TypeNode;
    typeParameter: typescript0.TypeParameterDeclaration;
  }) => typescript0.MappedTypeNode;
  methodDeclaration: ({
    accessLevel,
    comment,
    isStatic,
    multiLine,
    name,
    parameters,
    returnType,
    statements,
    types: types_d_exports
  }: {
    accessLevel?: AccessLevel;
    comment?: Comments;
    isStatic?: boolean;
    multiLine?: boolean;
    name: string;
    parameters?: ReadonlyArray<FunctionParameter>;
    returnType?: string | typescript0.TypeNode;
    statements?: typescript0.Statement[];
    types?: FunctionTypeParameter[];
  }) => typescript0.MethodDeclaration;
  namedImportDeclarations: ({
    imports,
    module: module_d_exports
  }: {
    imports: Array<ImportExportItem> | ImportExportItem;
    module: string;
  }) => typescript0.ImportDeclaration;
  namespaceDeclaration: ({
    name,
    statements
  }: {
    name: string;
    statements: Array<typescript0.Statement>;
  }) => typescript0.ModuleDeclaration;
  newExpression: ({
    argumentsArray,
    expression,
    typeArguments
  }: {
    argumentsArray?: Array<typescript0.Expression>;
    expression: typescript0.Expression;
    typeArguments?: Array<typescript0.TypeNode>;
  }) => typescript0.NewExpression;
  nodeToString: typeof tsNodeToString;
  null: () => typescript0.NullLiteral;
  objectExpression: <T extends Record<string, any> | Array<ObjectValue>>({
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
  }) => typescript0.ObjectLiteralExpression;
  ots: {
    boolean: (value: boolean) => typescript0.TrueLiteral | typescript0.FalseLiteral;
    export: ({
      alias,
      asType,
      name
    }: ImportExportItemObject) => typescript0.ExportSpecifier;
    import: ({
      alias,
      asType,
      name
    }: ImportExportItemObject) => typescript0.ImportSpecifier;
    number: (value: number) => typescript0.NumericLiteral | typescript0.PrefixUnaryExpression;
    string: (value: string, unescape?: boolean) => typescript0.Identifier | typescript0.StringLiteral;
  };
  parameterDeclaration: ({
    initializer,
    modifiers,
    name,
    required,
    type
  }: {
    initializer?: typescript0.Expression;
    modifiers?: ReadonlyArray<typescript0.ModifierLike>;
    name: string | typescript0.BindingName;
    required?: boolean;
    type?: typescript0.TypeNode;
  }) => typescript0.ParameterDeclaration;
  propertyAccessExpression: ({
    expression,
    isOptional,
    name
  }: {
    expression: string | typescript0.Expression;
    isOptional?: boolean;
    name: string | number | typescript0.MemberName;
  }) => typescript0.PropertyAccessChain | typescript0.PropertyAccessExpression | typescript0.ElementAccessExpression;
  propertyAccessExpressions: ({
    expressions
  }: {
    expressions: Array<string | typescript0.Expression | typescript0.MemberName>;
  }) => typescript0.PropertyAccessExpression;
  propertyAssignment: ({
    initializer,
    name
  }: {
    initializer: typescript0.Expression;
    name: string | typescript0.PropertyName;
  }) => typescript0.PropertyAssignment;
  propertyDeclaration: ({
    initializer,
    modifier,
    name,
    type
  }: {
    initializer?: typescript0.Expression;
    modifier?: "async" | AccessLevel | "export" | "readonly" | "static";
    name: string | typescript0.PropertyName;
    type?: typescript0.TypeNode;
  }) => typescript0.PropertyDeclaration;
  regularExpressionLiteral: ({
    flags,
    text
  }: {
    flags?: ReadonlyArray<"g" | "i" | "m" | "s" | "u" | "y">;
    text: string;
  }) => typescript0.RegularExpressionLiteral;
  returnFunctionCall: ({
    args,
    name,
    types: types_d_exports
  }: {
    args: any[];
    name: string | typescript0.Expression;
    types?: ReadonlyArray<string | typescript0.StringLiteral>;
  }) => typescript0.ReturnStatement;
  returnStatement: ({
    expression
  }: {
    expression?: typescript0.Expression;
  }) => typescript0.ReturnStatement;
  returnVariable: ({
    expression
  }: {
    expression: string | typescript0.Expression;
  }) => typescript0.ReturnStatement;
  safeAccessExpression: (path: string[]) => typescript0.Expression;
  stringLiteral: ({
    isSingleQuote,
    text
  }: {
    isSingleQuote?: boolean;
    text: string;
  }) => typescript0.StringLiteral;
  templateLiteralType: ({
    value
  }: {
    value: ReadonlyArray<string | typescript0.TypeNode>;
  }) => typescript0.TemplateLiteralTypeNode;
  this: () => typescript0.ThisExpression;
  transformArrayMap: ({
    path,
    transformExpression
  }: {
    path: string[];
    transformExpression: typescript0.Expression;
  }) => typescript0.IfStatement;
  transformArrayMutation: ({
    path,
    transformerName
  }: {
    path: string[];
    transformerName: string;
  }) => typescript0.Statement;
  transformDateMutation: ({
    path
  }: {
    path: string[];
  }) => typescript0.Statement;
  transformFunctionMutation: ({
    path,
    transformerName
  }: {
    path: string[];
    transformerName: string;
  }) => typescript0.IfStatement[];
  transformNewDate: ({
    parameterName
  }: {
    parameterName: string;
  }) => typescript0.NewExpression;
  typeAliasDeclaration: ({
    comment,
    exportType,
    name,
    type,
    typeParameters
  }: {
    comment?: Comments;
    exportType?: boolean;
    name: string | typescript0.TypeReferenceNode;
    type: string | typescript0.TypeNode | typescript0.Identifier;
    typeParameters?: FunctionTypeParameter[];
  }) => typescript0.TypeAliasDeclaration;
  typeArrayNode: (types: ReadonlyArray<any | typescript0.TypeNode> | typescript0.TypeNode | typescript0.Identifier | string, isNullable?: boolean) => typescript0.TypeNode;
  typeInterfaceNode: ({
    indexKey,
    indexProperty,
    isNullable,
    properties,
    useLegacyResolution
  }: {
    indexKey?: typescript0.TypeReferenceNode;
    indexProperty?: Property;
    isNullable?: boolean;
    properties: Property[];
    useLegacyResolution: boolean;
  }) => typescript0.TypeNode;
  typeIntersectionNode: ({
    isNullable,
    types: types_d_exports
  }: {
    isNullable?: boolean;
    types: (any | typescript0.TypeNode)[];
  }) => typescript0.TypeNode;
  typeNode: (base: any | typescript0.TypeNode, args?: (any | typescript0.TypeNode)[]) => typescript0.TypeNode;
  typeOfExpression: ({
    text
  }: {
    text: string | typescript0.Identifier;
  }) => typescript0.TypeOfExpression;
  typeOperatorNode: ({
    operator,
    type
  }: {
    operator: "keyof" | "readonly" | "unique";
    type: typescript0.TypeNode;
  }) => typescript0.TypeOperatorNode;
  typeParameterDeclaration: ({
    constraint,
    defaultType,
    modifiers,
    name
  }: {
    constraint?: typescript0.TypeNode;
    defaultType?: typescript0.TypeNode;
    modifiers?: Array<typescript0.Modifier>;
    name: string | typescript0.Identifier;
  }) => typescript0.TypeParameterDeclaration;
  typeParenthesizedNode: ({
    type
  }: {
    type: typescript0.TypeNode;
  }) => typescript0.ParenthesizedTypeNode;
  typeRecordNode: (keys: (any | typescript0.TypeNode)[], values: (any | typescript0.TypeNode)[], isNullable?: boolean, useLegacyResolution?: boolean) => typescript0.TypeNode;
  typeReferenceNode: ({
    typeArguments,
    typeName
  }: {
    typeArguments?: typescript0.TypeNode[];
    typeName: string | typescript0.EntityName;
  }) => typescript0.TypeReferenceNode;
  typeTupleNode: ({
    isNullable,
    types: types_d_exports
  }: {
    isNullable?: boolean;
    types: Array<any | typescript0.TypeNode>;
  }) => typescript0.TypeNode;
  typeUnionNode: ({
    isNullable,
    types: types_d_exports
  }: {
    isNullable?: boolean;
    types: ReadonlyArray<any | typescript0.TypeNode>;
  }) => typescript0.TypeNode;
  valueToExpression: <T = unknown>({
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
  }) => typescript0.Expression | undefined;
};
/** @deprecated use tsc */
declare const compiler: {
  anonymousFunction: ({
    async,
    comment,
    multiLine,
    parameters,
    returnType,
    statements,
    types: types_d_exports
  }: {
    async?: boolean;
    comment?: Comments;
    multiLine?: boolean;
    parameters?: FunctionParameter[];
    returnType?: string | typescript0.TypeNode;
    statements?: ReadonlyArray<typescript0.Statement>;
    types?: FunctionTypeParameter[];
  }) => typescript0.FunctionExpression;
  arrayLiteralExpression: <T>({
    elements,
    multiLine
  }: {
    elements: T[];
    multiLine?: boolean;
  }) => typescript0.ArrayLiteralExpression;
  arrowFunction: ({
    async,
    comment,
    multiLine,
    parameters,
    returnType,
    statements,
    types: types_d_exports
  }: {
    async?: boolean;
    comment?: Comments;
    multiLine?: boolean;
    parameters?: ReadonlyArray<FunctionParameter>;
    returnType?: string | typescript0.TypeNode;
    statements?: typescript0.Statement[] | typescript0.Expression;
    types?: FunctionTypeParameter[];
  }) => typescript0.ArrowFunction;
  asExpression: ({
    expression,
    type
  }: {
    expression: typescript0.Expression;
    type: typescript0.TypeNode;
  }) => typescript0.AsExpression;
  assignment: ({
    left,
    right
  }: {
    left: typescript0.Expression;
    right: typescript0.Expression;
  }) => typescript0.AssignmentExpression<typescript0.EqualsToken>;
  awaitExpression: ({
    expression
  }: {
    expression: typescript0.Expression;
  }) => typescript0.AwaitExpression;
  binaryExpression: ({
    left,
    operator,
    right
  }: {
    left: typescript0.Expression;
    operator?: "=" | "===" | "!==" | "in" | "??";
    right: typescript0.Expression | string;
  }) => typescript0.BinaryExpression;
  block: ({
    multiLine,
    statements
  }: {
    multiLine?: boolean;
    statements: ReadonlyArray<typescript0.Statement>;
  }) => typescript0.Block;
  callExpression: ({
    functionName,
    parameters,
    types: types_d_exports
  }: {
    functionName: string | typescript0.PropertyAccessExpression | typescript0.PropertyAccessChain | typescript0.ElementAccessExpression | typescript0.Expression;
    parameters?: Array<string | typescript0.Expression | undefined>;
    types?: ReadonlyArray<typescript0.TypeNode>;
  }) => typescript0.CallExpression;
  classDeclaration: ({
    decorator,
    exportClass,
    extendedClasses,
    name,
    nodes
  }: {
    decorator?: {
      args: any[];
      name: string;
    };
    exportClass?: boolean;
    extendedClasses?: ReadonlyArray<string>;
    name: string;
    nodes: ReadonlyArray<typescript0.ClassElement>;
  }) => typescript0.ClassDeclaration;
  conditionalExpression: ({
    condition,
    whenFalse,
    whenTrue
  }: {
    condition: typescript0.Expression;
    whenFalse: typescript0.Expression;
    whenTrue: typescript0.Expression;
  }) => typescript0.ConditionalExpression;
  constVariable: ({
    assertion,
    comment,
    destructure,
    exportConst,
    expression,
    name,
    typeName
  }: {
    assertion?: "const" | typescript0.TypeNode;
    comment?: Comments;
    destructure?: boolean;
    exportConst?: boolean;
    expression: typescript0.Expression;
    name: string | typescript0.TypeReferenceNode;
    typeName?: string | typescript0.IndexedAccessTypeNode | typescript0.TypeNode;
  }) => typescript0.VariableStatement;
  constructorDeclaration: ({
    accessLevel,
    comment,
    multiLine,
    parameters,
    statements
  }: {
    accessLevel?: AccessLevel;
    comment?: Comments;
    multiLine?: boolean;
    parameters?: FunctionParameter[];
    statements?: typescript0.Statement[];
  }) => typescript0.ConstructorDeclaration;
  enumDeclaration: <T extends Record<string, any> | Array<ObjectValue>>({
    asConst,
    comments: enumMemberComments,
    leadingComment: comments,
    name,
    obj
  }: {
    asConst: boolean;
    comments?: Record<string | number, Comments>;
    leadingComment?: Comments;
    name: string | typescript0.TypeReferenceNode;
    obj: T;
  }) => typescript0.EnumDeclaration;
  exportAllDeclaration: ({
    module: module_d_exports,
    shouldAppendJs
  }: {
    module: string;
    shouldAppendJs?: boolean;
  }) => typescript0.ExportDeclaration;
  exportNamedDeclaration: ({
    exports,
    module: module_d_exports
  }: {
    exports: Array<ImportExportItem> | ImportExportItem;
    module: string;
  }) => typescript0.ExportDeclaration;
  expressionToStatement: ({
    expression
  }: {
    expression: typescript0.Expression;
  }) => typescript0.ExpressionStatement;
  forOfStatement: ({
    awaitModifier,
    expression,
    initializer,
    statement
  }: {
    awaitModifier?: typescript0.AwaitKeyword;
    expression: typescript0.Expression;
    initializer: typescript0.ForInitializer;
    statement: typescript0.Statement;
  }) => typescript0.ForOfStatement;
  functionTypeNode: ({
    parameters,
    returnType,
    typeParameters
  }: {
    parameters?: typescript0.ParameterDeclaration[];
    returnType: typescript0.TypeNode;
    typeParameters?: typescript0.TypeParameterDeclaration[];
  }) => typescript0.FunctionTypeNode;
  getAccessorDeclaration: ({
    name,
    returnType,
    statements
  }: {
    name: string | typescript0.PropertyName;
    returnType?: string | typescript0.Identifier;
    statements: ReadonlyArray<typescript0.Statement>;
  }) => typescript0.GetAccessorDeclaration;
  identifier: ({
    text
  }: {
    text: string;
  }) => typescript0.Identifier;
  ifStatement: ({
    elseStatement,
    expression,
    thenStatement
  }: {
    elseStatement?: typescript0.Statement;
    expression: typescript0.Expression;
    thenStatement: typescript0.Statement;
  }) => typescript0.IfStatement;
  indexedAccessTypeNode: ({
    indexType,
    objectType
  }: {
    indexType: typescript0.TypeNode;
    objectType: typescript0.TypeNode;
  }) => typescript0.IndexedAccessTypeNode;
  isTsNode: (node: any) => node is typescript0.Expression;
  keywordTypeNode: ({
    keyword
  }: {
    keyword: Extract<SyntaxKindKeyword, "any" | "boolean" | "never" | "number" | "string" | "undefined" | "unknown" | "void">;
  }) => typescript0.KeywordTypeNode<typescript0.SyntaxKind.VoidKeyword | typescript0.SyntaxKind.AnyKeyword | typescript0.SyntaxKind.BooleanKeyword | typescript0.SyntaxKind.NeverKeyword | typescript0.SyntaxKind.NumberKeyword | typescript0.SyntaxKind.StringKeyword | typescript0.SyntaxKind.UndefinedKeyword | typescript0.SyntaxKind.UnknownKeyword>;
  literalTypeNode: ({
    literal
  }: {
    literal: typescript0.LiteralTypeNode["literal"];
  }) => typescript0.LiteralTypeNode;
  mappedTypeNode: ({
    members,
    nameType,
    questionToken,
    readonlyToken,
    type,
    typeParameter
  }: {
    members?: typescript0.NodeArray<typescript0.TypeElement>;
    nameType?: typescript0.TypeNode;
    questionToken?: typescript0.QuestionToken | typescript0.PlusToken | typescript0.MinusToken;
    readonlyToken?: typescript0.ReadonlyKeyword | typescript0.PlusToken | typescript0.MinusToken;
    type?: typescript0.TypeNode;
    typeParameter: typescript0.TypeParameterDeclaration;
  }) => typescript0.MappedTypeNode;
  methodDeclaration: ({
    accessLevel,
    comment,
    isStatic,
    multiLine,
    name,
    parameters,
    returnType,
    statements,
    types: types_d_exports
  }: {
    accessLevel?: AccessLevel;
    comment?: Comments;
    isStatic?: boolean;
    multiLine?: boolean;
    name: string;
    parameters?: ReadonlyArray<FunctionParameter>;
    returnType?: string | typescript0.TypeNode;
    statements?: typescript0.Statement[];
    types?: FunctionTypeParameter[];
  }) => typescript0.MethodDeclaration;
  namedImportDeclarations: ({
    imports,
    module: module_d_exports
  }: {
    imports: Array<ImportExportItem> | ImportExportItem;
    module: string;
  }) => typescript0.ImportDeclaration;
  namespaceDeclaration: ({
    name,
    statements
  }: {
    name: string;
    statements: Array<typescript0.Statement>;
  }) => typescript0.ModuleDeclaration;
  newExpression: ({
    argumentsArray,
    expression,
    typeArguments
  }: {
    argumentsArray?: Array<typescript0.Expression>;
    expression: typescript0.Expression;
    typeArguments?: Array<typescript0.TypeNode>;
  }) => typescript0.NewExpression;
  nodeToString: typeof tsNodeToString;
  null: () => typescript0.NullLiteral;
  objectExpression: <T extends Record<string, any> | Array<ObjectValue>>({
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
  }) => typescript0.ObjectLiteralExpression;
  ots: {
    boolean: (value: boolean) => typescript0.TrueLiteral | typescript0.FalseLiteral;
    export: ({
      alias,
      asType,
      name
    }: ImportExportItemObject) => typescript0.ExportSpecifier;
    import: ({
      alias,
      asType,
      name
    }: ImportExportItemObject) => typescript0.ImportSpecifier;
    number: (value: number) => typescript0.NumericLiteral | typescript0.PrefixUnaryExpression;
    string: (value: string, unescape?: boolean) => typescript0.Identifier | typescript0.StringLiteral;
  };
  parameterDeclaration: ({
    initializer,
    modifiers,
    name,
    required,
    type
  }: {
    initializer?: typescript0.Expression;
    modifiers?: ReadonlyArray<typescript0.ModifierLike>;
    name: string | typescript0.BindingName;
    required?: boolean;
    type?: typescript0.TypeNode;
  }) => typescript0.ParameterDeclaration;
  propertyAccessExpression: ({
    expression,
    isOptional,
    name
  }: {
    expression: string | typescript0.Expression;
    isOptional?: boolean;
    name: string | number | typescript0.MemberName;
  }) => typescript0.PropertyAccessChain | typescript0.PropertyAccessExpression | typescript0.ElementAccessExpression;
  propertyAccessExpressions: ({
    expressions
  }: {
    expressions: Array<string | typescript0.Expression | typescript0.MemberName>;
  }) => typescript0.PropertyAccessExpression;
  propertyAssignment: ({
    initializer,
    name
  }: {
    initializer: typescript0.Expression;
    name: string | typescript0.PropertyName;
  }) => typescript0.PropertyAssignment;
  propertyDeclaration: ({
    initializer,
    modifier,
    name,
    type
  }: {
    initializer?: typescript0.Expression;
    modifier?: "async" | AccessLevel | "export" | "readonly" | "static";
    name: string | typescript0.PropertyName;
    type?: typescript0.TypeNode;
  }) => typescript0.PropertyDeclaration;
  regularExpressionLiteral: ({
    flags,
    text
  }: {
    flags?: ReadonlyArray<"g" | "i" | "m" | "s" | "u" | "y">;
    text: string;
  }) => typescript0.RegularExpressionLiteral;
  returnFunctionCall: ({
    args,
    name,
    types: types_d_exports
  }: {
    args: any[];
    name: string | typescript0.Expression;
    types?: ReadonlyArray<string | typescript0.StringLiteral>;
  }) => typescript0.ReturnStatement;
  returnStatement: ({
    expression
  }: {
    expression?: typescript0.Expression;
  }) => typescript0.ReturnStatement;
  returnVariable: ({
    expression
  }: {
    expression: string | typescript0.Expression;
  }) => typescript0.ReturnStatement;
  safeAccessExpression: (path: string[]) => typescript0.Expression;
  stringLiteral: ({
    isSingleQuote,
    text
  }: {
    isSingleQuote?: boolean;
    text: string;
  }) => typescript0.StringLiteral;
  templateLiteralType: ({
    value
  }: {
    value: ReadonlyArray<string | typescript0.TypeNode>;
  }) => typescript0.TemplateLiteralTypeNode;
  this: () => typescript0.ThisExpression;
  transformArrayMap: ({
    path,
    transformExpression
  }: {
    path: string[];
    transformExpression: typescript0.Expression;
  }) => typescript0.IfStatement;
  transformArrayMutation: ({
    path,
    transformerName
  }: {
    path: string[];
    transformerName: string;
  }) => typescript0.Statement;
  transformDateMutation: ({
    path
  }: {
    path: string[];
  }) => typescript0.Statement;
  transformFunctionMutation: ({
    path,
    transformerName
  }: {
    path: string[];
    transformerName: string;
  }) => typescript0.IfStatement[];
  transformNewDate: ({
    parameterName
  }: {
    parameterName: string;
  }) => typescript0.NewExpression;
  typeAliasDeclaration: ({
    comment,
    exportType,
    name,
    type,
    typeParameters
  }: {
    comment?: Comments;
    exportType?: boolean;
    name: string | typescript0.TypeReferenceNode;
    type: string | typescript0.TypeNode | typescript0.Identifier;
    typeParameters?: FunctionTypeParameter[];
  }) => typescript0.TypeAliasDeclaration;
  typeArrayNode: (types: ReadonlyArray<any | typescript0.TypeNode> | typescript0.TypeNode | typescript0.Identifier | string, isNullable?: boolean) => typescript0.TypeNode;
  typeInterfaceNode: ({
    indexKey,
    indexProperty,
    isNullable,
    properties,
    useLegacyResolution
  }: {
    indexKey?: typescript0.TypeReferenceNode;
    indexProperty?: Property;
    isNullable?: boolean;
    properties: Property[];
    useLegacyResolution: boolean;
  }) => typescript0.TypeNode;
  typeIntersectionNode: ({
    isNullable,
    types: types_d_exports
  }: {
    isNullable?: boolean;
    types: (any | typescript0.TypeNode)[];
  }) => typescript0.TypeNode;
  typeNode: (base: any | typescript0.TypeNode, args?: (any | typescript0.TypeNode)[]) => typescript0.TypeNode;
  typeOfExpression: ({
    text
  }: {
    text: string | typescript0.Identifier;
  }) => typescript0.TypeOfExpression;
  typeOperatorNode: ({
    operator,
    type
  }: {
    operator: "keyof" | "readonly" | "unique";
    type: typescript0.TypeNode;
  }) => typescript0.TypeOperatorNode;
  typeParameterDeclaration: ({
    constraint,
    defaultType,
    modifiers,
    name
  }: {
    constraint?: typescript0.TypeNode;
    defaultType?: typescript0.TypeNode;
    modifiers?: Array<typescript0.Modifier>;
    name: string | typescript0.Identifier;
  }) => typescript0.TypeParameterDeclaration;
  typeParenthesizedNode: ({
    type
  }: {
    type: typescript0.TypeNode;
  }) => typescript0.ParenthesizedTypeNode;
  typeRecordNode: (keys: (any | typescript0.TypeNode)[], values: (any | typescript0.TypeNode)[], isNullable?: boolean, useLegacyResolution?: boolean) => typescript0.TypeNode;
  typeReferenceNode: ({
    typeArguments,
    typeName
  }: {
    typeArguments?: typescript0.TypeNode[];
    typeName: string | typescript0.EntityName;
  }) => typescript0.TypeReferenceNode;
  typeTupleNode: ({
    isNullable,
    types: types_d_exports
  }: {
    isNullable?: boolean;
    types: Array<any | typescript0.TypeNode>;
  }) => typescript0.TypeNode;
  typeUnionNode: ({
    isNullable,
    types: types_d_exports
  }: {
    isNullable?: boolean;
    types: ReadonlyArray<any | typescript0.TypeNode>;
  }) => typescript0.TypeNode;
  valueToExpression: <T = unknown>({
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
  }) => typescript0.Expression | undefined;
};
//#endregion
//#region src/utils/exports.d.ts
declare const utils: {
  stringCase: ({
    case: _case,
    stripLeadingSeparators,
    value
  }: {
    readonly case: StringCase | undefined;
    stripLeadingSeparators?: boolean;
    value: string;
  }) => string;
};
//#endregion
//#region src/index.d.ts
declare module '@hey-api/codegen-core' {
  interface ProjectRenderMeta {
    /**
     * If specified, this will be the file extension used when importing
     * other modules. By default, we don't add a file extension and let the
     * runtime resolve it.
     *
     * @default null
     */
    importFileExtension?: (string & {}) | null;
  }
  interface SymbolMeta {
    /**
     * Path to the resource this symbol represents.
     */
    path?: ReadonlyArray<string | number>;
    /**
     * Name of the plugin that registered this symbol.
     */
    pluginName?: string;
    /**
     * Tags associated with this symbol.
     */
    tags?: Set<string>;
  }
}
/**
 * Type helper for openapi-ts.config.ts, returns {@link MaybeArray<UserConfig>} object(s)
 */
declare const defineConfig: <T extends MaybeArray<UserConfig>>(config: LazyOrAsync<T>) => Promise<T>;
//#endregion
export { type Client as AngularClient, type Client$1 as AxiosClient, type Client$2 as Client, type DefinePlugin, type ExpressionTransformer, type Client$3 as FetchClient, type IR, type LegacyIR, Logger, type Client$4 as NextClient, type Client$5 as NuxtClient, type Client$6 as OfetchClient, type OpenApi, type OpenApiMetaObject, type OpenApiOperationObject, type OpenApiParameterObject, type OpenApiRequestBodyObject, type OpenApiResponseObject, type OpenApiSchemaObject, type Operation, type Plugin, type TypeTransformer, type UserConfig, clientDefaultConfig, clientDefaultMeta, clientPluginHandler, compiler, createClient, defaultPaginationKeywords, defaultPlugins, defineConfig, definePluginConfig, tsc, utils };
//# sourceMappingURL=index.d.cts.map