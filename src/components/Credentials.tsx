
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
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
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-medium text-slate-500 uppercase">AUTHORIZATION</h3>
        <span className="text-xs text-slate-500">{type}</span>
      </div>
      <div className="flex">
        <Input 
          value={token} 
          onChange={handleTokenChange}
          className="font-mono text-sm"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={copyToClipboard} 
          className="ml-1"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
