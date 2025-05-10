
import React, { useState, useEffect } from "react";
import { useApi } from "@/contexts/ApiContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { RequestParams } from "@/types/api";

export const RequestPanel: React.FC<{
  onResponse: (data: any, status: number, time: number) => void
}> = ({ onResponse }) => {
  const { selectedEndpoint, baseUrl, makeRequest } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [bodyContent, setBodyContent] = useState<string>("");
  const [headers, setHeaders] = useState<Record<string, string>>({
    "accept": "application/json",
    "content-type": "application/json"
  });
  
  // Reset form when endpoint changes
  useEffect(() => {
    if (selectedEndpoint) {
      // Initialize with empty values for path params
      if (selectedEndpoint.path_params) {
        setPathParams(
          Object.keys(selectedEndpoint.path_params).reduce(
            (acc, param) => ({ ...acc, [param]: "" }), 
            {}
          )
        );
      } else {
        setPathParams({});
      }
      
      // Initialize with empty values for query params
      if (selectedEndpoint.queries) {
        setQueryParams(
          Object.keys(selectedEndpoint.queries).reduce(
            (acc, param) => ({ ...acc, [param]: "" }), 
            {}
          )
        );
      } else {
        setQueryParams({});
      }
      
      // Initialize body if it has a schema
      if (
        selectedEndpoint.request_body?.content?.["application/json"]?.schema &&
        (selectedEndpoint.method === "POST" || selectedEndpoint.method === "PUT" || selectedEndpoint.method === "PATCH")
      ) {
        try {
          // Create a template from the schema
          const schema = selectedEndpoint.request_body.content["application/json"].schema;
          const template = createTemplateFromSchema(schema);
          setBodyContent(JSON.stringify(template, null, 2));
        } catch (e) {
          setBodyContent("{}");
        }
      } else {
        setBodyContent("");
      }
    }
  }, [selectedEndpoint]);
  
  // Create a template object from schema
  const createTemplateFromSchema = (schema: any): any => {
    if (!schema) return {};
    
    if (schema.type === "object" && schema.properties) {
      const result: Record<string, any> = {};
      Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
        if (propSchema.type === "object" && propSchema.properties) {
          result[key] = createTemplateFromSchema(propSchema);
        } else if (propSchema.type === "array" && propSchema.items) {
          result[key] = [createTemplateFromSchema(propSchema.items)];
        } else if (propSchema.type === "string") {
          result[key] = "";
        } else if (propSchema.type === "integer" || propSchema.type === "number") {
          result[key] = 0;
        } else if (propSchema.type === "boolean") {
          result[key] = false;
        } else {
          result[key] = null;
        }
      });
      return result;
    }
    
    return {};
  };
  
  const handleRequestSubmit = async () => {
    if (!selectedEndpoint) return;
    
    setIsLoading(true);
    
    try {
      // Parse body if present
      let parsedBody: any = {};
      if (bodyContent) {
        try {
          parsedBody = JSON.parse(bodyContent);
        } catch (e) {
          toast.error("Invalid JSON in request body");
          setIsLoading(false);
          return;
        }
      }
      
      const params: RequestParams = {
        pathParams,
        queryParams,
        bodyParams: parsedBody,
        headers
      };
      
      const result = await makeRequest(selectedEndpoint, params);
      
      onResponse(result.data, result.status, result.time);
      toast.success(`Request completed with status ${result.status}`);
    } catch (error) {
      toast.error("An error occurred during the request");
      console.error("Request error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // If no endpoint selected
  if (!selectedEndpoint) return null;
  
  // Compute the URL with path parameters substituted
  let url = baseUrl + selectedEndpoint.path;
  Object.entries(pathParams).forEach(([key, value]) => {
    if (value) {
      url = url.replace(`{${key}}`, encodeURIComponent(value));
    }
  });
  
  // Add query parameters
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
    
  if (queryString) {
    url += `?${queryString}`;
  }
  
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <h3 className="font-medium">Request</h3>
        <div className="mt-2 text-sm font-mono break-all">{url}</div>
      </div>
      
      <Tabs defaultValue="params" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="params">Parameters</TabsTrigger>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger 
            value="body"
            disabled={!["POST", "PUT", "PATCH"].includes(selectedEndpoint.method)}
          >
            Body
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="params" className="p-4">
          {Object.keys(pathParams).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Path Parameters</h4>
              {Object.entries(pathParams).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <label className="block text-xs mb-1">{key}</label>
                  <Input
                    value={value}
                    onChange={(e) => setPathParams(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={key}
                  />
                </div>
              ))}
            </div>
          )}
          
          {Object.keys(queryParams).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
              {Object.entries(queryParams).map(([key, value]) => (
                <div key={key} className="mb-2">
                  <label className="block text-xs mb-1">{key}</label>
                  <Input
                    value={value}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, [key]: e.target.value }))}
                    placeholder={key}
                  />
                </div>
              ))}
            </div>
          )}
          
          {Object.keys(pathParams).length === 0 && Object.keys(queryParams).length === 0 && (
            <div className="text-sm text-slate-500">No parameters for this endpoint</div>
          )}
        </TabsContent>
        
        <TabsContent value="headers" className="p-4">
          <div className="space-y-2">
            {Object.entries(headers).map(([key, value], index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={key}
                  onChange={(e) => {
                    const newHeaders = { ...headers };
                    delete newHeaders[key];
                    newHeaders[e.target.value] = value;
                    setHeaders(newHeaders);
                  }}
                  placeholder="Header name"
                  className="w-1/3"
                />
                <Input
                  value={value}
                  onChange={(e) => setHeaders(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder="Value"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newHeaders = { ...headers };
                    delete newHeaders[key];
                    setHeaders(newHeaders);
                  }}
                >
                  <span className="sr-only">Remove</span>
                  <span>×</span>
                </Button>
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setHeaders(prev => ({ ...prev, "": "" }))}
              className="w-full"
            >
              Add Header
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="body" className="p-4">
          {["POST", "PUT", "PATCH"].includes(selectedEndpoint.method) ? (
            <textarea
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              placeholder="Enter JSON body"
              className="w-full h-64 p-2 font-mono text-sm border border-slate-300 rounded-md"
            />
          ) : (
            <div className="text-sm text-slate-500">
              No body allowed for {selectedEndpoint.method} requests
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <Button 
          onClick={handleRequestSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : `Send ${selectedEndpoint.method} Request`}
        </Button>
      </div>
    </div>
  );
};
