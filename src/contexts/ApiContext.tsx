
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Endpoint, RequestParams, RequestResult } from "../types/api";
import { mockApiData, getGroupedEndpoints, simulateApiRequest } from "../data/mockData";

interface ApiContextType {
  endpoints: Endpoint[];
  groupedEndpoints: ReturnType<typeof getGroupedEndpoints>;
  selectedEndpoint: Endpoint | null;
  setSelectedEndpoint: (endpoint: Endpoint | null) => void;
  requestHistory: Array<{
    endpoint: Endpoint;
    params: RequestParams;
    result: RequestResult;
    timestamp: Date;
  }>;
  makeRequest: (endpoint: Endpoint, params: RequestParams) => Promise<RequestResult>;
  baseUrl: string;
  setBaseUrl: (url: string) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const [requestHistory, setRequestHistory] = useState<ApiContextType["requestHistory"]>([]);
  const [baseUrl, setBaseUrl] = useState<string>("https://example.com/api/v3");
  
  const endpoints = mockApiData.endpoints;
  const groupedEndpoints = getGroupedEndpoints();
  
  const makeRequest = async (endpoint: Endpoint, params: RequestParams) => {
    const result = await simulateApiRequest(endpoint, params);
    
    setRequestHistory(prev => [
      {
        endpoint,
        params,
        result,
        timestamp: new Date()
      },
      ...prev
    ]);
    
    return result;
  };
  
  return (
    <ApiContext.Provider value={{
      endpoints,
      groupedEndpoints,
      selectedEndpoint,
      setSelectedEndpoint,
      requestHistory,
      makeRequest,
      baseUrl,
      setBaseUrl
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
