/**
 * n8n type definitions imported from n8n source code
 * Source: https://github.com/n8n-io/n8n
 */

// Based on packages/workflow/src/interfaces.ts

type NodeConnectionType = string;

type IConnection = {
  // The node the connection is to
  node: string;
  // The type of the input on destination node (for example "main")
  type: NodeConnectionType;
  // The output/input-index of destination node (if node has multiple inputs/outputs of the same type)
  index: number;
}

// First array index: The output/input-index (if node has multiple inputs/outputs of the same type)
// Second array index: The different connections (if one node is connected to multiple nodes)
// Any index can be null, for example in a switch node with multiple indexes some of which are not connected
type NodeInputConnections = (IConnection[] | null)[];

type INodeConnections = Record<string, NodeInputConnections>;

export type IConnections = Record<string, INodeConnections>;

type GenericValue =
  | string
  | object
  | number
  | boolean
  | undefined
  | null;

type IDataObject = {
  [key: string]: GenericValue | IDataObject | GenericValue[] | IDataObject[];
}

type INodeParameters = IDataObject;

type INodeCredentialsDetails = {
  id: string | null;
  name: string;
}

type INodeCredentials = Record<string, INodeCredentialsDetails>;

type OnError =
  | "continueErrorOutput"
  | "continueRegularOutput"
  | "stopWorkflow";

export type INode = {
  id: string;
  name: string;
  typeVersion: number;
  type: string;
  position: [number, number];
  disabled?: boolean;
  notes?: string;
  notesInFlow?: boolean;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
  onError?: OnError;
  continueOnFail?: boolean;
  parameters: INodeParameters;
  credentials?: INodeCredentials;
  webhookId?: string;
  extendsCredential?: string;
}

export type IWorkflowSettings = {
  timezone?: string;
  errorWorkflow?: string;
  callerIds?: string;
  callerPolicy?: string;
  saveDataErrorExecution?: string;
  saveDataSuccessExecution?: string;
  saveManualExecutions?: boolean;
  saveExecutionProgress?: boolean;
  executionOrder?: string;
}

// n8n API Tag type
export type ITag = {
  id: string;
  name: string;
}
