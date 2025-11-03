import { a as Input, b as parseOpenApiSpec, i as UserConfig, n as WatchValues, r as Config, x as Logger } from "./types-CHvu8B2X.cjs";
import { getResolvedInput } from "@hey-api/json-schema-ref-parser";

//#region src/config/init.d.ts
type ConfigResult = {
  config: Config;
  errors: ReadonlyArray<Error>;
  jobIndex: number;
};
type Configs = {
  dependencies: Record<string, string>;
  results: ReadonlyArray<ConfigResult>;
};
/**
 * @internal
 */
declare const initConfigs: ({
  logger,
  userConfigs
}: {
  logger: Logger;
  userConfigs: ReadonlyArray<UserConfig>;
}) => Promise<Configs>;
//#endregion
//#region src/getSpec.d.ts
type SpecResponse = {
  arrayBuffer: ArrayBuffer | undefined;
  error?: never;
  resolvedInput: ReturnType<typeof getResolvedInput>;
  response?: never;
};
type SpecError = {
  arrayBuffer?: never;
  error: 'not-modified' | 'not-ok';
  resolvedInput?: never;
  response: Response;
};
/**
 * @internal
 */
declare const getSpec: ({
  fetchOptions,
  inputPath,
  timeout,
  watch
}: {
  fetchOptions?: RequestInit;
  inputPath: Input["path"];
  timeout: number | undefined;
  watch: WatchValues;
}) => Promise<SpecResponse | SpecError>;
//#endregion
export { getSpec, initConfigs, parseOpenApiSpec };
//# sourceMappingURL=internal.d.cts.map