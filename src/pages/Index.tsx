
import React, { useState, useEffect } from "react";
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
  const [bodyParams, setBodyParams] = useState<Record<string, any>>({});
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [selectedMethod, setSelectedMethod] = useState<string>("GET");
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/pet");

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    setHeaders(prev => ({
      ...prev,
      "authorization": newToken
    }));
  };

  const handleParamsChange = (
    type: 'body' | 'path' | 'query', 
    params: Record<string, any>
  ) => {
    if (type === 'body') setBodyParams(params);
    else if (type === 'path') setPathParams(params as Record<string, string>);
    else if (type === 'query') setQueryParams(params as Record<string, string>);
  };

  const handleHeadersChange = (newHeaders: Record<string, string>) => {
    setHeaders(newHeaders);
  };

  const handleBaseUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseUrl(e.target.value);
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
                onChange={handleBaseUrlChange}
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
          
          {/* Main Content - Split into Documentation/Input and Try It sections */}
          <div className="flex-1 flex">
            {/* Documentation and Input Fields */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-3.5rem)]">
                <div className="p-6">
                  <EndpointDetail />
                  
                  <div className="mt-6">
                    <RequestPanel 
                      onResponse={(data, status, time) => {
                        setResponseData(data);
                        setResponseStatus(status);
                        setResponseTime(time);
                      }} 
                      token={token}
                      onTokenChange={handleTokenChange}
                      onParamsChange={handleParamsChange}
                      onMethodChange={setSelectedMethod}
                      onEndpointChange={setSelectedEndpoint}
                      onHeadersChange={handleHeadersChange}
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
            
            {/* Try It Section */}
            <div className="w-[400px] border-l border-slate-200 bg-white">
              <div className="p-4 space-y-4">
                <LanguageSelector selected={language} onSelect={setLanguage} />
                
                <Credentials type="OAuth2" token={token} onTokenChange={handleTokenChange} />
                
                <CurlExample 
                  method={selectedMethod}
                  endpoint={selectedEndpoint}
                  baseUrl={baseUrl}
                  headers={headers}
                  bodyParams={bodyParams}
                  pathParams={pathParams}
                  queryParams={queryParams}
                />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold">RESPONSE</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => {
                        const requestPanelElement = document.getElementById('request-panel-submit');
                        if (requestPanelElement) requestPanelElement.click();
                      }}
                    >
                      Try It!
                    </Button>
                  </div>
                  
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
      </div>
    </ApiProvider>
  );
};

export default Index;
