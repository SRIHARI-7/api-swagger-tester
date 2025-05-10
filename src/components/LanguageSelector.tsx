
import React from "react";
import { cn } from "@/lib/utils";

type Language = "shell" | "node" | "ruby" | "php" | "python";

interface LanguageSelectorProps {
  selected: Language;
  onSelect: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selected,
  onSelect
}) => {
  const languages: { id: Language; label: string }[] = [
    { id: "shell", label: "Shell" },
    { id: "node", label: "Node" },
    { id: "ruby", label: "Ruby" },
    { id: "php", label: "PHP" },
    { id: "python", label: "Python" },
  ];
  
  return (
    <div className="mb-4">
      <h3 className="text-xs font-medium text-slate-500 uppercase mb-2">LANGUAGE</h3>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.id}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              selected === lang.id
                ? "bg-slate-100 text-slate-900 border border-slate-200"
                : "text-slate-600 hover:bg-slate-50 border border-transparent"
            )}
            onClick={() => onSelect(lang.id)}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};
