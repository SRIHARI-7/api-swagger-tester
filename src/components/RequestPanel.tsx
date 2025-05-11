import React, { useState, useEffect } from "react";
import { useApi } from "@/contexts/ApiContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { SchemaProperty } from "@/types/api";
import { Info, ChevronDown, Plus } from "lucide-react";

// Import the RequestParams type from types/api.ts
import type { RequestParams } from "@/types/api";

export const RequestPanel: React.FC<{
  onResponse: (data: any, status: number, time: number) => void;
  token?: string;
  onTokenChange?: (token: string) => void;
  onParamsChange?: (type: 'body' | 'path' | 'query', params: Record<string, any>) => void;
  onHeadersChange?: (headers: Record<string, string>) => void;
  onMethodChange?: React.Dispatch<React.SetStateAction<string>>;
  onEndpointChange?: React.Dispatch<React.SetStateAction<string>>;
}> = ({ 
  onResponse, 
  token, 
  onTokenChange, 
  onParamsChange,
  onHeadersChange,
  onMethodChange,
  onEndpointChange 
}) => {
  const { selectedEndpoint, baseUrl, makeRequest } = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [bodyContent, setBodyContent] = useState<string>("");
  const [bodyFormValues, setBodyFormValues] = useState<Record<string, any>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({
    "accept": "application/json",
    "content-type": "application/json"
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (token) {
      setHeaders(prev => ({
        ...prev,
        "authorization": token
      }));
      
      // Notify parent of headers change
      if (onHeadersChange) {
        onHeadersChange({
          ...headers,
          "authorization": token
        });
      }
    }
  }, [token, onHeadersChange]);
  
  // Notify parent component when parameters change
  useEffect(() => {
    if (onParamsChange) {
      onParamsChange('path', pathParams);
    }
  }, [pathParams, onParamsChange]);

  useEffect(() => {
    if (onParamsChange) {
      onParamsChange('query', queryParams);
    }
  }, [queryParams, onParamsChange]);

  useEffect(() => {
    if (onParamsChange) {
      onParamsChange('body', bodyFormValues);
    }
  }, [bodyFormValues, onParamsChange]);

  // Notify parent of headers change
  useEffect(() => {
    if (onHeadersChange) {
      onHeadersChange(headers);
    }
  }, [headers, onHeadersChange]);

  // Update method and endpoint in parent component
  useEffect(() => {
    if (selectedEndpoint && onMethodChange) {
      onMethodChange(selectedEndpoint.method);
    }
  }, [selectedEndpoint, onMethodChange]);

  useEffect(() => {
    if (selectedEndpoint && onEndpointChange) {
      onEndpointChange(selectedEndpoint.path);
    }
  }, [selectedEndpoint, onEndpointChange]);
  
  // Reset form when endpoint changes
  useEffect(() => {
    if (selectedEndpoint) {
      // Initialize path params
      if (selectedEndpoint.path_params) {
        const newPathParams = Object.keys(selectedEndpoint.path_params).reduce(
          (acc, param) => ({ ...acc, [param]: "" }), 
          {}
        );
        setPathParams(newPathParams);
        if (onParamsChange) {
          onParamsChange('path', newPathParams);
        }
      } else {
        setPathParams({});
        if (onParamsChange) {
          onParamsChange('path', {});
        }
      }
      
      // Initialize query params
      if (selectedEndpoint.queries) {
        const newQueryParams = Object.keys(selectedEndpoint.queries).reduce(
          (acc, param) => ({ ...acc, [param]: "" }), 
          {}
        );
        setQueryParams(newQueryParams);
        if (onParamsChange) {
          onParamsChange('query', newQueryParams);
        }
      } else {
        setQueryParams({});
        if (onParamsChange) {
          onParamsChange('query', {});
        }
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
          setBodyFormValues(template);
          if (onParamsChange) {
            onParamsChange('body', template);
          }
        } catch (e) {
          setBodyContent("{}");
          setBodyFormValues({});
          if (onParamsChange) {
            onParamsChange('body', {});
          }
        }
      } else {
        setBodyContent("");
        setBodyFormValues({});
        if (onParamsChange) {
          onParamsChange('body', {});
        }
      }
      
      // Default expand categories
      if (selectedEndpoint.request_body?.content?.["application/json"]?.schema?.properties) {
        const newExpandedCategories: Record<string, boolean> = {};
        Object.keys(selectedEndpoint.request_body.content["application/json"].schema.properties).forEach(key => {
          newExpandedCategories[key] = true;
        });
        setExpandedCategories(newExpandedCategories);
      }
    }
  }, [selectedEndpoint, onParamsChange]);
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
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

  // Update body content when form values change
  useEffect(() => {
    setBodyContent(JSON.stringify(bodyFormValues, null, 2));
  }, [bodyFormValues]);
  
  const handleRequestSubmit = async () => {
    if (!selectedEndpoint) return;

    // Check for required fields
    let hasError = false;
    
    // Check required path params
    if (selectedEndpoint.path_params) {
      Object.entries(selectedEndpoint.path_params).forEach(([key, param]) => {
        if (param.required && (!pathParams[key] || pathParams[key].trim() === "")) {
          toast.error(`Path parameter "${key}" is required`);
          hasError = true;
        }
      });
    }
    
    // Check required query params
    if (selectedEndpoint.queries) {
      Object.entries(selectedEndpoint.queries).forEach(([key, param]) => {
        if (param.required && (!queryParams[key] || queryParams[key].trim() === "")) {
          toast.error(`Query parameter "${key}" is required`);
          hasError = true;
        }
      });
    }
    
    // Check for required body fields
    if (selectedEndpoint.request_body?.required && 
        selectedEndpoint.request_body?.content?.["application/json"]?.schema) {
      const schema = selectedEndpoint.request_body.content["application/json"].schema;
      if (schema.properties && schema.required) {
        schema.required.forEach((field: string) => {
          if (!bodyFormValues[field] && bodyFormValues[field] !== 0) {
            toast.error(`Body field "${field}" is required`);
            hasError = true;
          }
        });
      }
    }
    
    if (hasError) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const params: RequestParams = {
        pathParams,
        queryParams,
        bodyParams: bodyFormValues,
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

  // Get body schema if available
  const bodySchema = selectedEndpoint.request_body?.content?.["application/json"]?.schema;
  const requiredFields = bodySchema?.required || [];
  
  const renderFormField = (fieldName: string, fieldSchema: SchemaProperty, parentPath = "") => {
    const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
    const isRequired = requiredFields.includes(fieldName);
    
    const setValue = (value: any) => {
      setBodyFormValues(prev => {
        const newValues = { ...prev };
        if (parentPath) {
          // Handle nested properties
          const paths = parentPath.split('.');
          let current = newValues;
          for (let i = 0; i < paths.length; i++) {
            if (i === paths.length - 1) {
              current[paths[i]][fieldName] = value;
            } else {
              current = current[paths[i]];
            }
          }
        } else {
          newValues[fieldName] = value;
        }
        return newValues;
      });
    };
    
    const getValue = () => {
      if (parentPath) {
        // Handle nested properties
        const paths = parentPath.split('.');
        let current = bodyFormValues;
        for (const path of paths) {
          current = current[path];
          if (!current) return "";
        }
        return current[fieldName];
      }
      return bodyFormValues[fieldName];
    };
    
    const currentValue = getValue();
    
    if (fieldSchema.type === "object" && fieldSchema.properties) {
      const isExpanded = expandedCategories[fullPath] !== false;
      
      // Render object fields
      return (
        <div key={fullPath} className="mb-4 border rounded-lg border-slate-200">
          <div 
            className="p-2 bg-slate-50 flex justify-between items-center cursor-pointer border-b border-slate-200"
            onClick={() => toggleCategory(fullPath)}
          >
            <h4 className="text-sm font-medium flex items-center">
              {fieldName} 
              {isRequired && <span className="text-red-500 ml-1">*</span>}
              <span className="ml-2 text-xs text-slate-500">object</span>
            </h4>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
          
          {isExpanded && (
            <div className="p-3 space-y-3">
              {Object.entries(fieldSchema.properties || {}).map(([propName, propSchema]) => 
                renderFormField(propName, propSchema as SchemaProperty, fullPath)
              )}
            </div>
          )}
        </div>
      );
    } else if (fieldSchema.type === "array") {
      // For array of strings, show a simple UI that allows adding strings
      if (fieldSchema.items?.type === "string") {
        const arrayValue = Array.isArray(currentValue) ? currentValue : [];
        
        return (
          <div key={fullPath} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <Label className="block text-sm flex items-center">
                {fieldName} {isRequired && <span className="text-red-500 ml-1">*</span>}
                <span className="ml-2 text-xs text-slate-400">array of strings</span>
              </Label>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={() => setValue([...arrayValue, ""])}
                className="h-6 text-xs"
              >
                ADD STRING
              </Button>
            </div>
            {arrayValue.map((value, index) => (
              <div key={index} className="flex mb-2">
                <Input
                  value={value}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    setValue(newArray);
                  }}
                  className={`flex-1 ${isRequired ? "border-red-200" : ""}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    setValue(newArray);
                  }}
                  className="ml-2 h-10 w-10"
                >
                  <span className="sr-only">Remove</span>
                  <span>×</span>
                </Button>
              </div>
            ))}
            {arrayValue.length === 0 && (
              <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-md p-3 text-center">
                No items added yet
              </div>
            )}
          </div>
        );
      }
      
      // For array of objects, create a more complex UI
      if (fieldSchema.items?.type === "object") {
        const arrayValue = Array.isArray(currentValue) ? currentValue : [];
        
        return (
          <div key={fullPath} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <Label className="block text-sm flex items-center">
                {fieldName} {isRequired && <span className="text-red-500 ml-1">*</span>}
                <span className="ml-2 text-xs text-slate-400">array of objects</span>
              </Label>
              <Button 
                type="button"
                variant="outline" 
                size="sm"
                onClick={() => setValue([...arrayValue, createTemplateFromSchema(fieldSchema.items)])}
                className="h-6 text-xs"
              >
                ADD OBJECT
              </Button>
            </div>
            {arrayValue.map((_, index) => (
              <div key={index} className="mb-2 border border-slate-200 rounded-md p-2">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium">Item {index + 1}</h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newArray = arrayValue.filter((_, i) => i !== index);
                      setValue(newArray);
                    }}
                    className="h-6 text-xs"
                  >
                    Remove
                  </Button>
                </div>
                <div className="pl-3 border-l-2 border-slate-200">
                  {Object.entries(fieldSchema.items?.properties || {}).map(([propName, propSchema]) => 
                    renderFormField(
                      propName, 
                      propSchema as SchemaProperty, 
                      `${fullPath}[${index}]`
                    )
                  )}
                </div>
              </div>
            ))}
            {arrayValue.length === 0 && (
              <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-md p-3 text-center">
                No items added yet
              </div>
            )}
          </div>
        );
      }
      
      // Fallback for other array types
      return (
        <div key={fullPath} className="mb-2">
          <Label className="block text-sm mb-1 flex items-center">
            {fieldName} {isRequired && <span className="text-red-500 ml-1">*</span>}
            <span className="ml-2 text-xs text-slate-400">array</span>
          </Label>
          <Textarea 
            value={JSON.stringify(currentValue || [], null, 2)}
            onChange={(e) => {
              try {
                const arrayValue = JSON.parse(e.target.value);
                setValue(arrayValue);
              } catch (error) {
                // Handle invalid JSON
              }
            }}
            placeholder={`[${fieldSchema.items?.type || ""}]`}
            className={`font-mono text-sm ${isRequired ? "border-red-200" : ""}`}
          />
        </div>
      );
    } else if (fieldSchema.type === "string" && fieldSchema.enum) {
      // Render select for enum fields
      return (
        <div key={fullPath} className="mb-3">
          <Label className="block text-sm mb-1 flex items-center">
            {fieldName} {isRequired && <span className="text-red-500 ml-1">*</span>}
            <span className="ml-2 text-xs text-slate-400">string</span>
            {fieldSchema.description && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                    <Info className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="text-xs">{fieldSchema.description}</PopoverContent>
              </Popover>
            )}
          </Label>
          <Select 
            value={currentValue || ""} 
            onValueChange={setValue}
          >
            <SelectTrigger className={`w-full ${isRequired ? "border-red-200" : ""}`}>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              {fieldSchema.enum?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    } else if (fieldSchema.type === "boolean") {
      // Render select for boolean
      return (
        <div key={fullPath} className="mb-3">
          <Label className="block text-sm mb-1 flex items-center">
            {fieldName} {isRequired && <span className="text-red-500 ml-1">*</span>}
            <span className="ml-2 text-xs text-slate-400">boolean</span>
          </Label>
          <Select 
            value={currentValue?.toString() || "false"} 
            onValueChange={(value) => setValue(value === "true")}
          >
            <SelectTrigger className={`w-full ${isRequired ? "border-red-200" : ""}`}>
              <SelectValue placeholder="Select value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">true</SelectItem>
              <SelectItem value="false">false</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    } else {
      // Default input for string, number, integer
      let inputType = "text";
      let typeLabel = fieldSchema.type;
      if (fieldSchema.type === "integer" || fieldSchema.type === "number") {
        inputType = "number";
      }
      
      return (
        <div key={fullPath} className="mb-3">
          <Label className="block text-sm mb-1 flex items-center">
            {fieldName} {isRequired && <span className="text-red-500 ml-1">*</span>}
            <span className="ml-2 text-xs text-slate-400">{typeLabel}</span>
            {fieldSchema.description && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-4 w-4 ml-1">
                    <Info className="h-3 w-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="text-xs">{fieldSchema.description}</PopoverContent>
              </Popover>
            )}
          </Label>
          <Input
            type={inputType}
            value={currentValue !== undefined ? currentValue : ""}
            onChange={(e) => setValue(inputType === "number" ? Number(e.target.value) : e.target.value)}
            placeholder={fieldName}
            className={isRequired ? "border-red-200" : ""}
          />
        </div>
      );
    }
  };
  
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200">
        <h3 className="font-medium">Request Parameters</h3>
        <div className="mt-2 text-sm font-mono break-all">{url}</div>
      </div>
      
      <Tabs defaultValue="body" className="w-full">
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
              <h4 className="text-sm font-medium mb-3">Path Parameters</h4>
              {Object.entries(pathParams).map(([key, value]) => {
                const paramSchema = selectedEndpoint.path_params?.[key];
                const isRequired = paramSchema?.required;
                
                return (
                  <div key={key} className="mb-3">
                    <Label className="block text-sm mb-1 flex items-center">
                      {key} {isRequired && <span className="text-red-500 ml-1">*</span>}
                      <span className="ml-2 text-xs text-slate-400">
                        {paramSchema?.schema?.type || "string"}
                      </span>
                    </Label>
                    <Input
                      value={value}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setPathParams(prev => {
                          const updated = { ...prev, [key]: newValue };
                          return updated;
                        });
                      }}
                      placeholder={key}
                      className={isRequired ? "border-red-200" : ""}
                    />
                  </div>
                );
              })}
            </div>
          )}
          
          {Object.keys(queryParams).length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Query Parameters</h4>
              {Object.entries(queryParams).map(([key, value]) => {
                const paramSchema = selectedEndpoint.queries?.[key];
                const isRequired = paramSchema?.required;
                
                return (
                  <div key={key} className="mb-3">
                    <Label className="block text-sm mb-1 flex items-center">
                      {key} {isRequired && <span className="text-red-500 ml-1">*</span>}
                      <span className="ml-2 text-xs text-slate-400">
                        {paramSchema?.schema?.type || "string"}
                      </span>
                    </Label>
                    <Input
                      value={value}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setQueryParams(prev => {
                          const updated = { ...prev, [key]: newValue };
                          return updated;
                        });
                      }}
                      placeholder={key}
                      className={isRequired ? "border-red-200" : ""}
                    />
                  </div>
                );
              })}
            </div>
          )}
          
          {Object.keys(pathParams).length === 0 && Object.keys(queryParams).length === 0 && (
            <div className="text-sm text-slate-500 p-4 border border-dashed border-slate-200 rounded-md text-center">
              No parameters for this endpoint
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="headers" className="p-4">
          <div className="space-y-3">
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
                  onChange={(e) => {
                    setHeaders(prev => ({ ...prev, [key]: e.target.value }));
                    if (key === "authorization" && onTokenChange) {
                      onTokenChange(e.target.value);
                    }
                  }}
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
            <div>
              {bodySchema && bodySchema.properties ? (
                <div className="space-y-4">
                  {selectedEndpoint.request_body?.description && (
                    <div className="mb-4 text-sm text-slate-600">
                      {selectedEndpoint.request_body?.description}
                    </div>
                  )}
                  
                  {Object.entries(bodySchema.properties).map(([fieldName, fieldSchema]) => 
                    renderFormField(fieldName, fieldSchema as SchemaProperty)
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="block text-sm">Raw JSON</Label>
                  <Textarea
                    value={bodyContent}
                    onChange={(e) => {
                      setBodyContent(e.target.value);
                      try {
                        const newBodyFormValues = JSON.parse(e.target.value);
                        setBodyFormValues(newBodyFormValues);
                        if (onParamsChange) {
                          onParamsChange('body', newBodyFormValues);
                        }
                      } catch (err) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Enter JSON body"
                    className="w-full h-64 font-mono text-sm"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500 p-4 border border-dashed border-slate-200 rounded-md text-center">
              No body allowed for {selectedEndpoint.method} requests
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <Button 
          id="request-panel-submit"
          onClick={handleRequestSubmit}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Sending..." : `Execute ${selectedEndpoint.method} Request`}
        </Button>
      </div>
    </div>
  );
};
