
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CredentialsProps {
  type: string;
  token?: string;
  onTokenChange?: (token: string) => void;
}

export const Credentials: React.FC<CredentialsProps> = ({ 
  type = "OAuth2",
  token: initialToken = "Bearer gyuyuyiguububuibiu",
  onTokenChange
}) => {
  const { toast } = useToast();
  const [token, setToken] = useState(initialToken);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(token);
    toast({
      title: "Copied to clipboard",
      description: "The token has been copied to your clipboard.",
    });
  };
  
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    if (onTokenChange) {
      onTokenChange(e.target.value);
    }
  };
  
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">CREDENTIALS</h3>
        <span className="text-sm text-slate-500 uppercase">{type}</span>
      </div>
      <div className="p-4 border rounded-md bg-white mb-2">
        <div className="text-gray-500 mb-2 text-center">{type}</div>
        <div className="flex items-center border rounded relative">
          <Input 
            value={token} 
            onChange={handleTokenChange}
            className="font-mono border-0 shadow-none py-2 pl-16 pr-8"
            placeholder="Enter bearer token"
          />
          <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 text-sm text-gray-600">
            Bearer
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyToClipboard} 
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Lock className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
