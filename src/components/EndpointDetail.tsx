
import React from "react";
import { useApi } from "@/contexts/ApiContext";
import { MethodBadge } from "./MethodBadge";

export const EndpointDetail: React.FC = () => {
  const { selectedEndpoint, baseUrl } = useApi();
  
  if (!selectedEndpoint) {
    return (
      <div className="p-8 text-center text-slate-500">
        <h2 className="text-2xl font-semibold mb-4">Welcome to FuseAPITest</h2>
        <p>Select an endpoint from the sidebar to get started</p>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-2">
        <MethodBadge method={selectedEndpoint.method} size="lg" />
        <h1 className="text-2xl font-bold">{selectedEndpoint.summary}</h1>
      </div>
      
      <div className="flex items-center text-sm font-mono text-slate-600 bg-slate-100 p-2 rounded mb-6">
        <div className="bg-white px-2 py-1 rounded mr-2">
          {selectedEndpoint.method}
        </div>
        <div>{baseUrl}{selectedEndpoint.path}</div>
      </div>
      
      {selectedEndpoint.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-slate-700">{selectedEndpoint.description}</p>
        </div>
      )}
      
      {selectedEndpoint.path_params && Object.keys(selectedEndpoint.path_params).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Path Parameters</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Required</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {Object.entries(selectedEndpoint.path_params).map(([name, param]) => (
                  <tr key={name}>
                    <td className="px-4 py-2 text-sm font-medium text-slate-900">{name}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">{param.schema.type}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {param.required ? 
                        <span className="text-amber-600 font-medium">Yes</span> : 
                        <span>No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {selectedEndpoint.queries && Object.keys(selectedEndpoint.queries).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Query Parameters</h2>
          <div className="border rounded-md overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Required</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {Object.entries(selectedEndpoint.queries).map(([name, param]) => (
                  <tr key={name}>
                    <td className="px-4 py-2 text-sm font-medium text-slate-900">{name}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {param.schema.type}
                      {param.schema.enum ? ` (${param.schema.enum.join(", ")})` : ""}
                    </td>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {param.required ? 
                        <span className="text-amber-600 font-medium">Yes</span> : 
                        <span>No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {selectedEndpoint.request_body && selectedEndpoint.request_body.content && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Request Body</h2>
          <div className="border rounded-md overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500 uppercase">Schema</div>
            <div className="p-4 bg-slate-100 font-mono text-sm overflow-auto">
              <pre>
                {JSON.stringify(
                  selectedEndpoint.request_body.content["application/json"]?.schema, 
                  null, 
                  2
                )}
              </pre>
            </div>
          </div>
        </div>
      )}
      
      {selectedEndpoint.responses && Object.keys(selectedEndpoint.responses).length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Responses</h2>
          {Object.entries(selectedEndpoint.responses).map(([status, response]) => (
            <div key={status} className="mb-4">
              <h3 className="text-md font-semibold mb-1 flex items-center">
                <span className={`inline-block w-16 text-center py-1 rounded text-xs font-medium ${
                  status.startsWith('2') 
                    ? 'bg-green-100 text-green-800' 
                    : status.startsWith('4') || status.startsWith('5')
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {status}
                </span>
                <span className="ml-2">Response</span>
              </h3>
              
              {response.content && (
                <div className="border rounded-md overflow-hidden">
                  {Object.entries(response.content).map(([contentType, content]) => (
                    <div key={contentType}>
                      <div className="bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
                        {contentType}
                      </div>
                      <div className="p-4 bg-slate-100 font-mono text-sm overflow-auto">
                        <pre>
                          {JSON.stringify(content.schema, null, 2)}
                        </pre>
                        {content.examples && (
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="text-xs font-medium text-slate-500 mb-2">Example:</div>
                            <pre>
                              {JSON.stringify(content.examples.example.value || {}, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
