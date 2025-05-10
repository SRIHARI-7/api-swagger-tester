
import React, { useState } from "react";
import { ApiProvider } from "@/contexts/ApiContext";
import { Sidebar } from "@/components/Sidebar";
import { EndpointDetail } from "@/components/EndpointDetail";
import { RequestPanel } from "@/components/RequestPanel";
import { ResponsePanel } from "@/components/ResponsePanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [responseData, setResponseData] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [baseUrl, setBaseUrl] = useState("https://example.com/api/v3");

  return (
    <ApiProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-slate-200 flex items-center px-6 bg-white">
          <h1 className="text-xl font-bold text-blue-600">FuseAPITest</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Base URL:</span>
              <Input 
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-64 h-8"
              />
            </div>
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 grid grid-cols-1 gap-6">
              <div className="col-span-1">
                <EndpointDetail />
              </div>
              
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-2">Try It</h2>
                <RequestPanel 
                  onResponse={(data, status, time) => {
                    setResponseData(data);
                    setResponseStatus(status);
                    setResponseTime(time);
                  }} 
                />
              </div>
              
              <div className="col-span-1">
                <h2 className="text-lg font-semibold mb-2">Response</h2>
                <ResponsePanel 
                  data={responseData} 
                  status={responseStatus} 
                  time={responseTime} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApiProvider>
  );
};

export default Index;
