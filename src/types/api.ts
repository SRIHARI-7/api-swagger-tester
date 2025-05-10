
export interface SchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
}

export interface ParamSchema {
  type: string;
  enum?: string[];
  items?: SchemaProperty;
}

export interface Parameter {
  required: boolean;
  schema: ParamSchema;
}

export interface PathParam {
  required: boolean;
  schema: ParamSchema;
}

export interface QueryParam {
  required: boolean;
  schema: ParamSchema;
}

export interface RequestBody {
  required: boolean;
  description?: string;
  content?: Record<string, {
    schema: SchemaProperty;
  }>;
}

export interface ResponseContent {
  schema: SchemaProperty;
  examples?: Record<string, {
    value: any;
  }>;
}

export interface Response {
  content?: Record<string, ResponseContent>;
}

export interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  summary: string;
  description?: string;
  path: string;
  path_params?: Record<string, PathParam>;
  queries?: Record<string, QueryParam>;
  request_body: RequestBody;
  responses: Record<string, Response>;
}

export interface PaginationData {
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse {
  endpoints: Endpoint[];
  page: PaginationData;
}

export interface EndpointGroup {
  name: string;
  endpoints: Endpoint[];
}

export interface RequestParams {
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  bodyParams: Record<string, any>;
  headers: Record<string, string>;
}

export interface RequestResult {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  time: number;
}
