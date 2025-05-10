
import React, { useState } from "react";
import { ApiProvider } from "@/contexts/ApiContext";
import { Sidebar } from "@/components/Sidebar";
import { EndpointDetail } from "@/components/EndpointDetail";
import { RequestPanel } from "@/components/RequestPanel";
import { ResponsePanel } from "@/components/ResponsePanel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CurlExample } from "@/components/CurlExample";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Credentials } from "@/components/Credentials";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [responseData, setResponseData] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [baseUrl, setBaseUrl] = useState("https://example.com/api/v3");
  const [language, setLanguage] = useState<"shell" | "node" | "ruby" | "php" | "python">("shell");
  const [token, setToken] = useState("Bearer gyuyuyiguububuibiu");
  const [headers, setHeaders] = useState<Record<string, string>>({
    "accept": "application/json",
    "authorization": "Bearer gyuyuyiguububuibiu",
    "content-type": "application/json"
  });

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    setHeaders(prev => ({
      ...prev,
      "authorization": newToken
    }));
  };

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
          <div className="flex-1 flex">
            {/* Documentation */}
            <div className="flex-1 border-r border-slate-200">
              <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <div className="p-6">
                  <EndpointDetail />
                </div>
              </ScrollArea>
            </div>
            
            {/* Try It Section */}
            <div className="w-[500px] border-l border-slate-200 bg-white">
              <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <div className="p-6 space-y-6">
                  <LanguageSelector selected={language} onSelect={setLanguage} />
                  
                  <Credentials type="OAuth2" token={token} onTokenChange={handleTokenChange} />
                  
                  <CurlExample 
                    method="POST"
                    endpoint="/pet"
                    baseUrl={baseUrl}
                    headers={headers}
                  />
                  
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Try It</h2>
                    <RequestPanel 
                      onResponse={(data, status, time) => {
                        setResponseData(data);
                        setResponseStatus(status);
                        setResponseTime(time);
                      }} 
                      token={token}
                      onTokenChange={handleTokenChange}
                    />
                  </div>
                  
                  <div>
                    <ResponsePanel 
                      data={responseData} 
                      status={responseStatus} 
                      time={responseTime} 
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </ApiProvider>
  );
};

export default Index;
