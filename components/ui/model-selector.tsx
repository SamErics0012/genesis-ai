"use client";

import { useState, ReactNode } from "react";
import { ChevronRight, ChevronDown, Check, Clock, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import icons from @lobehub/icons
import { 
  Flux, 
  Gemini, 
  Runway, 
  AdobeFirefly, 
  OpenAI, 
  Ideogram, 
  Qwen,
  Midjourney,
  Luma,
  Minimax
} from "@lobehub/icons";

// Icon component mapping
const IconComponents: Record<string, any> = {
  flux: Flux,
  google: Gemini.Color,
  runway: Runway,
  adobe: AdobeFirefly.Color,
  openai: OpenAI,
  ideogram: Ideogram,
  qwen: Qwen.Color,
  midjourney: Midjourney,
  luma: Luma,
  minimax: Minimax.Color,
};

// Fallback to PNG URL for icons not in the package
const getIconUrl = (iconName: string, theme: string) => {
  if (iconName === 'leonardo') {
    return 'https://storageprdv2inwink.blob.core.windows.net/c31006ba-c504-4fe1-8c23-5a98badcfaa5/21e1e4d2-08fb-4bb7-8295-2c2c406d5d1a';
  }

  if (iconName === 'Wan-AI') {
    return 'https://cdn.futurepedia.io/2025-05-21T13-50-32.827Z-3Dn05kcwqmug6r5q1hI62B-1K0uvoqhoN.png';
  }

  if (iconName === 'Lightricks') {
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5_IfUN3NnyXym5lPXdDidd2s5XtyeLsfVaA&s';
  }

  if (iconName === 'meituan-longcat') {
    return 'https://7nyt0uhk7sse4zvn.public.blob.vercel-storage.com/docs-assets/static/docs/ai-gateway/logos/meituan.png';
  }

  if (iconName === 'tencent') {
    return 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/hunyuan-color.png';
  }

  if (iconName === 'genmo') {
    return 'https://images.g2crowd.com/uploads/product/image/fc3bc5583870a21f2f70f5872d088285/genmo.png';
  }

  if (iconName === 'zai-org') {
    return 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/cogvideo-color.png';
  }

  if (iconName === 'kwaivgI') {
    return 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/kling-color.png';
  }
  
  const themeFolder = theme === "dark" ? "dark" : "light";
  
  // Use custom icon for Reve
  if (iconName === 'reve') {
    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6J2EbehDThMmsiub-ag2r19zbN_tWB6NAgw&s';
  }

  return `https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/${themeFolder}/${iconName}.png`;
};

// Render icon component or fallback to image
const ModelIcon = ({ iconName, theme, size = 20, className = "" }: { iconName: string; theme: string; size?: number; className?: string }) => {
  const IconComponent = IconComponents[iconName];
  
  if (IconComponent) {
    return <IconComponent size={size} className={className} />;
  }
  
  return (
    <img 
      src={getIconUrl(iconName, theme)} 
      alt={iconName}
      className={cn("object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
};

const IconContainer = ({ 
  iconName, 
  theme, 
  isNew, 
  className 
}: { 
  iconName: string; 
  theme: string; 
  isNew?: boolean; 
  className?: string;
}) => (
  <div className={cn(
    "relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800/50 overflow-hidden border transition-all shrink-0",
    isNew ? "border-orange-500/50 shadow-[0_0_10px_-3px_rgba(249,115,22,0.3)]" : "border-zinc-700/30",
    className
  )}>
    <ModelIcon iconName={iconName} theme={theme} size={22} className={isNew ? "mb-1.5" : ""} />
    {isNew && (
      <div className="absolute bottom-0 left-0 right-0 bg-orange-500 flex justify-center items-center h-3">
        <span className="text-[7px] font-bold text-white leading-none tracking-wider">NEW</span>
      </div>
    )}
  </div>
);

export interface ModelOption {
  name: string;
  slug: string;
  iconUrl: string;
  badge?: string;
  hasApi: boolean;
  isNew?: boolean;
  // Video-specific fields
  duration?: string;
  resolution?: string;
  hasAudio?: boolean;
  supportsImg2Vid?: boolean;
}

export interface ModelCategory {
  name: string;
  iconUrl: string;
  isNew?: boolean;
  models: ModelOption[];
}

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModel: ModelOption;
  onModelChange: (model: ModelOption) => void;
  theme?: string;
  showDetails?: boolean; // Show duration/resolution for video models
  triggerContent?: ReactNode; // Custom trigger content
}

// Group models by their brand/provider
function groupModelsByBrand(models: ModelOption[]): ModelCategory[] {
  const brandMap: Record<string, { models: ModelOption[]; iconUrl: string; isNew?: boolean }> = {};
  
  const brandNames: Record<string, string> = {
    midjourney: "Midjourney",
    flux: "Black Forest Labs",
    google: "Google",
    openai: "OpenAI",
    adobe: "Adobe",
    runway: "Runway",
    ideogram: "Ideogram",
    qwen: "Alibaba",
    bytedance: "ByteDance",
    tencent: "Tencent",
    minimax: "MiniMax",
    leonardo: "Leonardo AI",
    recraft: "Recraft",
    reve: "Reve",
    luma: "Luma",
    kwaivgI: "Kling AI",
    "meituan-longcat": "Meituan",
    "Wan-AI": "Wan AI",
    genmo: "Genmo",
    Lightricks: "Lightricks",
    "zai-org": "Zhipu AI",
  };

  const newBrands = ["google", "flux"];

  models.forEach((model) => {
    const brand = model.iconUrl;
    if (!brandMap[brand]) {
      brandMap[brand] = { 
        models: [], 
        iconUrl: brand,
        isNew: newBrands.includes(brand)
      };
    }
    brandMap[brand].models.push(model);
  });

  return Object.entries(brandMap).map(([key, value]) => ({
    name: brandNames[key] || key.charAt(0).toUpperCase() + key.slice(1),
    iconUrl: value.iconUrl,
    isNew: value.isNew,
    models: value.models,
  }));
}

export function ModelSelector({ 
  models, 
  selectedModel, 
  onModelChange, 
  theme = "dark",
  showDetails = false,
  triggerContent
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  const categories = groupModelsByBrand(models);

  const handleModelSelect = (model: ModelOption) => {
    onModelChange(model);
    setOpen(false);
    setHoveredCategory(null);
  };

  // Get the hovered category's models
  const hoveredCategoryData = categories.find(cat => cat.name === hoveredCategory);

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setHoveredCategory(null);
    }}>
      <PopoverTrigger asChild>
        {triggerContent ? (
          <Button 
            variant="outline" 
            className="gap-2 bg-zinc-900/80 border-zinc-700/50 hover:bg-zinc-800/80 hover:border-zinc-600/50 text-white dark:bg-zinc-900/80 dark:border-zinc-700/50"
          >
            {triggerContent}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="gap-2 bg-zinc-900/80 border-zinc-700/50 hover:bg-zinc-800/80 hover:border-zinc-600/50 text-white dark:bg-zinc-900/80 dark:border-zinc-700/50"
          >
            <ModelIcon iconName={selectedModel.iconUrl} theme={theme} size={20} />
            <span className="font-medium">{selectedModel.name}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-transparent border-0 shadow-none"
        align="start"
        sideOffset={8}
      >
        <div className="flex gap-2">
          {/* Categories Panel (Left) */}
          <div className="w-64 bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
            <ScrollArea className="h-[500px]">
              <div className="p-2 space-y-1">
                {categories.map((category) => {
                  const isHovered = hoveredCategory === category.name;
                  const hasSelectedModel = category.models.some(m => m.slug === selectedModel.slug);
                  
                  return (
                    <button
                      key={category.name}
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onClick={() => {
                        // If only one model in category, select it directly
                        if (category.models.length === 1) {
                          handleModelSelect(category.models[0]);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center gap-4 px-3 py-2 rounded-xl transition-all duration-200 group",
                        isHovered ? "bg-blue-600 shadow-lg shadow-blue-900/20" : "hover:bg-zinc-800/50",
                        !isHovered && hasSelectedModel && "bg-zinc-800/80"
                      )}
                    >
                      <IconContainer 
                        iconName={category.iconUrl} 
                        theme={theme} 
                        isNew={category.isNew}
                        className={cn(
                          "bg-zinc-900",
                          isHovered ? "border-blue-400/30" : ""
                        )}
                      />
                      
                      <span className={cn(
                        "flex-1 text-left text-[15px] font-medium tracking-tight",
                        isHovered ? "text-white" : "text-zinc-300 group-hover:text-zinc-100"
                      )}>
                        {category.name}
                      </span>
                      
                      <ChevronRight className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isHovered ? "text-white translate-x-0.5" : "text-zinc-600 group-hover:text-zinc-400"
                      )} />
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Models Panel (Right) - Shows on hover */}
          {hoveredCategoryData && hoveredCategoryData.models.length > 0 && (
            <div 
              className="w-72 bg-[#09090b] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-left-2 duration-200"
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-1">
                  {hoveredCategoryData.models.map((model) => {
                    const isSelected = model.slug === selectedModel.slug;
                    const isNewModel = model.name.includes("FLUX.2") || model.name.includes("Imagen-4") || model.name.includes("Flex");
                    
                    return (
                      <button
                        key={model.slug}
                        onClick={() => handleModelSelect(model)}
                        className={cn(
                          "w-full flex flex-col gap-1 px-3 py-3 rounded-xl transition-all duration-200 group",
                          isSelected ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                        )}
                      >
                        <div className="flex items-center w-full gap-4">
                          <IconContainer 
                            iconName={hoveredCategoryData.iconUrl} 
                            theme={theme} 
                            isNew={isNewModel}
                            className="w-9 h-9"
                          />
                          
                          <span className={cn(
                            "flex-1 text-left text-[15px] font-medium tracking-tight",
                            isSelected ? "text-white" : "text-zinc-300 group-hover:text-zinc-100"
                          )}>
                            {model.name}
                          </span>
                          
                          {isSelected && (
                            <div className="bg-blue-600 rounded-full p-1">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        
                        {showDetails && (model.duration || model.resolution) && (
                          <div className="flex items-center gap-3 text-xs text-zinc-500 pl-[52px]">
                            {model.resolution && (
                              <span className="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-0.5 rounded-md border border-zinc-800/50">
                                <Monitor className="h-3 w-3" />
                                {model.resolution}
                              </span>
                            )}
                            {model.duration && (
                              <span className="flex items-center gap-1.5 bg-zinc-900/50 px-2 py-0.5 rounded-md border border-zinc-800/50">
                                <Clock className="h-3 w-3" />
                                {model.duration}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ModelSelector;
