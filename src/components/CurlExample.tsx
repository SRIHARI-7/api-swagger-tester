
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CurlExampleProps {
  method: string;
  endpoint: string;
  baseUrl: string;
  headers: Record<string, string>;
  bodyParams?: Record<string, any>;
  queryParams?: Record<string, string>;
  pathParams?: Record<string, string>;
}

export const CurlExample: React.FC<CurlExampleProps> = ({
  method,
  endpoint,
  baseUrl,
  headers,
  bodyParams,
  queryParams,
  pathParams
}) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Process endpoint with path parameters
  let processedEndpoint = endpoint;
  if (pathParams) {
    Object.entries(pathParams).forEach(([key, value]) => {
      if (value) {
        processedEndpoint = processedEndpoint.replace(`{${key}}`, encodeURIComponent(String(value)));
      }
    });
  }

  // Add query parameters if present
  const queryString = queryParams 
    ? Object.entries(queryParams)
      .filter(([_, value]) => value && value.trim() !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')
    : '';
    
  const fullUrl = `${baseUrl}${processedEndpoint}${queryString ? `?${queryString}` : ''}`;
  
  // Generate curl command
  let curlCommand = `curl --request ${method} \\
  --url ${fullUrl} \\${Object.entries(headers).map(([key, value]) => `
  --header '${key}: ${value}' \\`).join('')}`;
  
  // Add body if it's a POST, PUT, PATCH
  if (["POST", "PUT", "PATCH"].includes(method) && bodyParams) {
    const bodyContent = JSON.stringify(bodyParams, null, 2);
    curlCommand += `
  --data '${bodyContent}'`;
  }
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "The curl command has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="uppercase font-medium text-sm">CURL REQUEST</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="ml-2 h-6 w-6 p-0 text-white hover:bg-slate-700"
          >
            <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={copyToClipboard} 
          className="text-white hover:bg-slate-700 h-6 px-2"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      
      {expanded && (
        <div className="bg-slate-900 text-green-400 p-4 font-mono text-sm overflow-auto max-h-96">
          <pre className="whitespace-pre-wrap text-xs">
            {curlCommand.split('\n').map((line, i) => (
              <div key={i} className="flex">
                {i === 0 && <span className="text-green-500 mr-2">➜</span>}
                {i > 0 && <span className="w-4"></span>}
                <span>{line}</span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
};
