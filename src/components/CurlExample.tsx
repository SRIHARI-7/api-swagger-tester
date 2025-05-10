
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, Code } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CurlExampleProps {
  method: string;
  endpoint: string;
  baseUrl: string;
  headers: Record<string, string>;
}

export const CurlExample: React.FC<CurlExampleProps> = ({
  method,
  endpoint,
  baseUrl,
  headers
}) => {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();
  
  const fullUrl = `${baseUrl}${endpoint}`;
  
  // Generate curl command
  const curlCommand = `curl --request ${method} \\
  --url ${fullUrl} \\${Object.entries(headers).map(([key, value]) => `
  --header '${key}: ${value}' \\`).join('')}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlCommand);
    toast({
      title: "Copied to clipboard",
      description: "The curl command has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-slate-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4" />
          <span className="font-medium">CURL REQUEST</span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)} 
            className="text-white hover:bg-slate-700"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
      
      {expanded && (
        <div className="bg-slate-900 text-slate-300 p-4 text-sm font-mono relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard} 
            className="absolute top-2 right-2 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <pre className="whitespace-pre-wrap">{curlCommand}</pre>
        </div>
      )}
    </div>
  );
};
