
import React from "react";
import { cn } from "@/lib/utils";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface MethodBadgeProps {
  method: Method;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const MethodBadge: React.FC<MethodBadgeProps> = ({ method, className, size = "md" }) => {
  const getMethodColor = () => {
    switch (method) {
      case "GET":
        return "bg-green-100 text-green-800 border-green-200";
      case "POST":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PUT":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "DELETE":
        return "bg-red-100 text-red-800 border-red-200";
      case "PATCH":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-1.5 py-0.5 text-xs";
      case "lg":
        return "px-3 py-1.5 text-sm";
      case "md":
      default:
        return "px-2 py-1 text-xs";
    }
  };
  
  return (
    <span 
      className={cn(
        "font-mono font-medium rounded border", 
        getMethodColor(),
        getSizeClasses(),
        className
      )}
    >
      {method}
    </span>
  );
};
