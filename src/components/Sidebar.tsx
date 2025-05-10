
import React, { useState } from "react";
import { useApi } from "@/contexts/ApiContext";
import { MethodBadge } from "./MethodBadge";
import { Endpoint } from "@/types/api";
import { Search } from "lucide-react";

export const Sidebar: React.FC = () => {
  const { groupedEndpoints, setSelectedEndpoint } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groupedEndpoints.map(g => [g.name, true]))
  );
  
  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };
  
  const handleEndpointClick = (endpoint: Endpoint) => {
    setSelectedEndpoint(endpoint);
  };
  
  const filteredGroups = groupedEndpoints.map(group => ({
    ...group,
    endpoints: group.endpoints.filter(endpoint => 
      endpoint.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.endpoints.length > 0);
  
  return (
    <div className="w-72 h-full bg-slate-50 border-r border-slate-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-200">
        <h2 className="font-bold text-lg text-blue-600">FuseAPITest</h2>
        <div className="text-xs text-slate-500">API Documentation</div>
      </div>
      
      <div className="p-3 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search endpoints..."
            className="w-full pl-8 pr-4 py-2 text-sm border border-slate-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredGroups.map((group) => (
          <div key={group.name} className="border-b border-slate-200">
            <button
              className="w-full px-4 py-3 text-left font-medium bg-slate-100 hover:bg-slate-200 flex justify-between items-center"
              onClick={() => toggleGroup(group.name)}
            >
              <span>{group.name}</span>
              <span className="text-xs text-slate-500">{group.endpoints.length}</span>
            </button>
            
            {expandedGroups[group.name] && (
              <div className="pl-2">
                {group.endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    className="w-full px-4 py-2 text-left hover:bg-slate-100 flex justify-between items-center text-sm border-l-2 border-transparent hover:border-blue-500"
                    onClick={() => handleEndpointClick(endpoint)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{endpoint.summary}</span>
                      <span className="text-xs text-slate-500 mt-1 font-mono">{endpoint.path}</span>
                    </div>
                    <MethodBadge method={endpoint.method} size="sm" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-slate-200 text-xs text-slate-500">
        <span>v1.0 • OpenAPI 3.0</span>
      </div>
    </div>
  );
};
