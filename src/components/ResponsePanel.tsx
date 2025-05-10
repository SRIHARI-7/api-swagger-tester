
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
      <div className="border border-slate-200 rounded-md p-6 text-center text-slate-500">
        Send a request to see the response
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
          <span className="text-sm font-medium">RESPONSE</span>
          <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${statusColorClass}`}>
            {status}
          </span>
          {status >= 400 && <span className="text-xs text-slate-500 uppercase">LOG</span>}
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
        <Tabs defaultValue="raw" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="raw" className="p-0">
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
                  <pre>&lt;HTML&gt;&lt;HEAD&gt;
&lt;TITLE&gt;Access Denied&lt;/TITLE&gt;
&lt;/HEAD&gt;&lt;BODY&gt;
&lt;H1&gt;Access Denied&lt;/H1&gt;

You don't have permission to access this resource.
Reference #32.8#35.1188#46;8af6d517&#46;1746898529&#46;1196af1
&lt;/BODY&gt;
&lt;/HTML&gt;</pre>
                </div>
              ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="headers" className="p-0">
            <div className="p-4 overflow-auto max-h-96">
              <div className="space-y-2">
                {Object.entries({
                  "content-type": "application/json",
                  "access-control-allow-origin": "*",
                  "x-powered-by": "Express",
                  "date": new Date().toUTCString(),
                }).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2">
                    <div className="text-sm font-medium">{key}:</div>
                    <div className="col-span-2 text-sm">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ResponsePanel;
