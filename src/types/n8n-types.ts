/**
 * n8n type definitions imported from n8n source code
 * Source: https://github.com/n8n-io/n8n
 */

// Based on packages/workflow/src/interfaces.ts

export type NodeConnectionType = string;

export interface IConnection {
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
export type NodeInputConnections = Array<IConnection[] | null>;

export interface INodeConnections {
  // Input name
  [key: string]: NodeInputConnections;
}

export interface IConnections {
  // Node name
  [key: string]: INodeConnections;
}

export type GenericValue =
  | string
  | object
  | number
  | boolean
  | undefined
  | null;

export interface IDataObject {
  [key: string]: GenericValue | IDataObject | GenericValue[] | IDataObject[];
}

export type INodeParameters = IDataObject;

export interface INodeCredentialsDetails {
  id: string | null;
  name: string;
}

export interface INodeCredentials {
  [key: string]: INodeCredentialsDetails;
}

export type OnError =
  | "continueErrorOutput"
  | "continueRegularOutput"
  | "stopWorkflow";

export interface INode {
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

export interface IWorkflowSettings {
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
export interface ITag {
  id: string;
  name: string;
}

export interface IWorkflowBase {
  id: string;
  name: string;
  active: boolean;
  isArchived: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  nodes: INode[];
  connections: IConnections;
  settings?: IWorkflowSettings;
  tags?: ITag[];
}
