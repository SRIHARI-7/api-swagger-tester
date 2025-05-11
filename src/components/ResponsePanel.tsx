
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ResponsePanelProps {
  data: any;
  status: number | null;
  time: number | null;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({ data, status, time }) => {
  const [expanded, setExpanded] = useState(true);
  const { toast } = useToast();
  
  if (status === null) {
    return (
      <div className="border border-slate-200 rounded-md p-6 text-center text-slate-500 bg-slate-50">
        <p>Click <strong>Try It!</strong> to start a request and see the response here!</p>
        <p className="mt-2">Or choose an example:</p>
        <div className="mt-4 flex justify-center items-center gap-2">
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span>200</span>
          </div>
          <span className="text-slate-300">|</span>
          <span>application/json</span>
        </div>
      </div>
    );
  }
  
  const statusColorClass = 
    status >= 200 && status < 300 
      ? "bg-green-100 text-green-800" 
      : status >= 400 
      ? "bg-red-100 text-red-800" 
      : "bg-blue-100 text-blue-800";
  
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard.",
    });
  };
  
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${statusColorClass}`}>
            {status}
          </span>
          <span className="text-xs text-slate-500">application/json</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setExpanded(!expanded)}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      
      {expanded && (
        <div className="bg-white p-4 font-mono text-sm overflow-auto max-h-96 relative">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
            className="absolute top-2 right-2"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {status >= 400 ? (
            <div className="text-red-600">
              <pre>{JSON.stringify(data || {
                error: "Access Denied",
                message: "You don't have permission to access this resource."
              }, null, 2)}</pre>
            </div>
          ) : (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default ResponsePanel;
