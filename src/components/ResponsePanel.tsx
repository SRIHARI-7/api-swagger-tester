
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResponsePanelProps {
  data: any;
  status: number | null;
  time: number | null;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({ data, status, time }) => {
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
  
  return (
    <div className="border border-slate-200 rounded-md overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center">
          <span className={`inline-block rounded px-2 py-1 text-xs font-medium ${statusColorClass}`}>
            {status}
          </span>
          {time && (
            <span className="ml-3 text-xs text-slate-500">
              {time}ms
            </span>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="pretty" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pretty">Pretty</TabsTrigger>
          <TabsTrigger value="raw">Raw</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pretty" className="p-0">
          <div className="bg-slate-100 p-4 font-mono text-sm overflow-auto max-h-96">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="raw" className="p-0">
          <div className="bg-slate-100 p-4 font-mono text-sm overflow-auto max-h-96">
            <pre>{JSON.stringify(data)}</pre>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="p-0">
          <div className="p-4 overflow-auto max-h-96">
            {Array.isArray(data) ? (
              <div className="space-y-4">
                {data.map((item, index) => (
                  <div key={index} className="border rounded p-3">
                    {renderObjectPreview(item)}
                  </div>
                ))}
              </div>
            ) : typeof data === 'object' && data !== null ? (
              renderObjectPreview(data)
            ) : (
              <div className="text-sm">{String(data)}</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const renderObjectPreview = (obj: Record<string, any>) => {
  return (
    <div className="space-y-2">
      {Object.entries(obj).map(([key, value]) => (
        <div key={key} className="grid grid-cols-3 gap-2">
          <div className="text-sm font-medium">{key}:</div>
          <div className="col-span-2 text-sm">
            {typeof value === 'object' && value !== null ? 
              JSON.stringify(value) : 
              String(value)
            }
          </div>
        </div>
      ))}
    </div>
  );
};
