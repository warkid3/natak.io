
"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { 
  Paperclip, 
  Send, 
  BrainCog,
  User,
  Ratio,
  Settings2,
  ChevronDown,
  Check
} from "lucide-react";
import { Textarea } from "./textarea";
import { cn } from "../../lib/utils";
import { useAutoResizeTextarea } from "../hooks/use-auto-resize-textarea";
import { mockStore } from "../../services/mockStore";
import { CharacterModel } from "../../types";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * PopoverContent shape: rounded-md (Structured/Substantial)
 */
const PopoverContent = React.forwardRef<React.ElementRef<typeof PopoverPrimitive.Content>, React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-[100] w-64 rounded-md border border-white/10 bg-[#0F0F11] p-2 text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.8)] outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

/**
 * Item shape: rounded-[2px]
 */
const DropdownItem = ({ children, onClick, active, icon: Icon }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between px-4 py-2.5 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all group text-left italic",
      active ? "bg-[#CCFF00] text-black" : "text-slate-500 hover:bg-white/5 hover:text-white"
    )}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon className={cn("w-3.5 h-3.5", active ? "text-black" : "text-slate-600 group-hover:text-[#CCFF00]")} />}
      {children}
    </div>
    {active && <Check className="w-3.5 h-3.5" />}
  </button>
);

interface AIInputWithSearchProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string, config: any) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function AIInputWithSearch({
  id = "ai-input-with-search",
  placeholder = "Describe your imagination...",
  minHeight = 48,
  maxHeight = 164,
  onSubmit,
  onFileSelect,
  className
}: AIInputWithSearchProps) {
  const [value, setValue] = React.useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const [selectedChar, setSelectedChar] = React.useState<CharacterModel | null>(null);
  const [selectedRatio, setSelectedRatio] = React.useState("16:9");
  const [selectedModel, setSelectedModel] = React.useState("Nano Banana Pro");
  
  const [characters, setCharacters] = React.useState<CharacterModel[]>([]);

  React.useEffect(() => {
    setCharacters(mockStore.getCharacters().filter(c => c.status === 'ready'));
  }, []);

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit?.(value, { character: selectedChar, ratio: selectedRatio, model: selectedModel });
      setValue("");
      adjustHeight(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-2xl w-full mx-auto">
        {/* Main Input shape: rounded-[2px] */}
        <div className="relative flex flex-col bg-[#1A1A1D] border border-white/10 rounded-[2px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          
          <div
            className="overflow-y-auto"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            <Textarea
              id={id}
              value={value}
              placeholder={placeholder}
              className="w-full px-5 py-6 bg-transparent border-none text-white placeholder:text-slate-800 resize-none focus-visible:ring-0 text-lg leading-relaxed italic"
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-black/40 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-1.5">
              <label className="cursor-pointer rounded-[2px] p-2 bg-white/5 hover:bg-white/10 transition-colors text-slate-500 hover:text-white mr-1">
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <Paperclip className="w-4.5 h-4.5" />
              </label>

              {/* Selector Buttons: rounded-[2px] */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all italic">
                    <User className="w-3 h-3 text-[#CCFF00]" />
                    {selectedChar ? selectedChar.name : "Persona"}
                    <ChevronDown className="w-3 h-3 opacity-30" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Identity Selection</div>
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {characters.map(c => (
                      <DropdownItem key={c.id} active={selectedChar?.id === c.id} onClick={() => setSelectedChar(c)}>{c.name}</DropdownItem>
                    ))}
                    <div className="border-t border-white/5 my-1 pt-1">
                       <DropdownItem onClick={() => setSelectedChar(null)} active={!selectedChar}>Universal</DropdownItem>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all italic">
                    <Ratio className="w-3 h-3 text-[#CCFF00]" />
                    {selectedRatio}
                    <ChevronDown className="w-3 h-3 opacity-30" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48">
                  <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Aspect Ratio</div>
                  {["1:1", "16:9", "9:16", "4:3"].map(r => (
                    <DropdownItem key={r} active={selectedRatio === r} onClick={() => setSelectedRatio(r)}>{r}</DropdownItem>
                  ))}
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all italic">
                    <Settings2 className="w-3 h-3 text-[#CCFF00]" />
                    Engine
                    <ChevronDown className="w-3 h-3 opacity-30" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">Diffusion Logic</div>
                  {["Nano Banana Pro", "Pony Realism (SDXL)", "Seedream 4.5"].map(m => (
                    <DropdownItem key={m} active={selectedModel === m} onClick={() => setSelectedModel(m)}>{m}</DropdownItem>
                  ))}
                </PopoverContent>
              </Popover>

              <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

              <button className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-[#CCFF00]/5 border border-[#CCFF00]/10 text-[9px] font-black uppercase tracking-widest text-[#CCFF00] hover:bg-[#CCFF00]/10 transition-all italic">
                <BrainCog className="w-3.5 h-3.5" />
                Enhance
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim()}
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-[2px] transition-all",
                  value.trim()
                    ? "bg-[#CCFF00] text-black shadow-lg shadow-[#CCFF00]/20 hover:scale-[1.05] active:scale-95"
                    : "bg-white/5 text-slate-800 cursor-not-allowed"
                )}
              >
                <Send className="w-5 h-5 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
