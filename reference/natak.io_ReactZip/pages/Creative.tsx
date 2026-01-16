
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { 
  Paperclip, X, Square, BrainCog, 
  Sparkles, ImageIcon, User, Ratio, Settings2, ChevronDown, Check
} from "lucide-react";
import { BlurFade } from "../components/ui/blur-fade";
import AnimatedShaderBackground from "../components/ui/animated-shader-background";
import { cn } from "../lib/utils";
import { mockStore } from "../services/mockStore";
import { CharacterModel } from "../types";

// --- UI COMPONENTS ---

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

/**
 * Popover/Modal shape: rounded-md
 * Structured, substantial feel.
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
      "w-full flex items-center justify-between px-4 py-2.5 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all group",
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

// --- MOCK DATA ---
const DEMO_CARDS = [
  { title: 'Neon Cyberpunk', imageSrc: 'https://images.unsplash.com/photo-1605218427368-35b0266dc99e?q=80&w=768&auto=format&fit=crop' },
  { title: 'Abstract Fluid', imageSrc: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=768&auto=format&fit=crop' },
  { title: 'Digital Portrait', imageSrc: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=768&auto=format&fit=crop' },
  { title: 'Synthwave City', imageSrc: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=768&auto=format&fit=crop' },
  { title: 'Ethereal Space', imageSrc: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=768&auto=format&fit=crop' },
];

const styles = `
  *:focus-visible { outline-offset: 0 !important; --ring-offset: 0 !important; }
  textarea::-webkit-scrollbar { width: 4px; }
  textarea::-webkit-scrollbar-track { background: transparent; }
  textarea::-webkit-scrollbar-thumb { background-color: #333333; }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
  .animate-float {
    animation: float 8s ease-in-out infinite;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  if (!document.head.querySelector('style[data-prism-styles]')) {
    styleSheet.setAttribute('data-prism-styles', 'true');
    document.head.appendChild(styleSheet);
  }
}

/**
 * Textarea shape: rounded-[2px]
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex w-full rounded-[2px] border-none bg-transparent px-3 py-2.5 text-lg text-white placeholder:text-slate-800 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] resize-none font-medium",
      className
    )}
    ref={ref}
    rows={1}
    {...props}
  />
));
Textarea.displayName = "Textarea";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger as any;

/**
 * Tooltip shape: rounded-[2px]
 */
const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-[2px] border border-white/10 bg-[#1A1A1D] px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white shadow-xl animate-in fade-in-0 zoom-in-95",
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/**
 * Button shape: rounded-[2px]
 */
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "prism", size?: "default" | "sm" | "lg" | "icon" }>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-white hover:bg-white/80 text-black",
      outline: "border border-white/10 bg-transparent hover:bg-white/5 text-white",
      ghost: "bg-transparent hover:bg-white/5 text-slate-500 hover:text-white",
      prism: "bg-[#CCFF00] text-black border-0 shadow-[0_10px_40px_rgba(204,255,0,0.2)] font-black italic",
    };
    const sizeClasses = {
      default: "h-12 px-6",
      sm: "h-9 px-4 text-[10px]",
      lg: "h-14 px-8 text-sm",
      icon: "h-10 w-10",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-[2px] uppercase tracking-widest",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface PromptInputContextType {
  isLoading: boolean;
  value: string;
  setValue: (value: string) => void;
  maxHeight: number | string;
  onSubmit?: () => void;
  disabled?: boolean;
}
const PromptInputContext = React.createContext<PromptInputContextType>({ isLoading: false, value: "", setValue: () => {}, maxHeight: 240 });
function usePromptInput() { return React.useContext(PromptInputContext)!; }

/**
 * Card/Container shape: rounded-[2px]
 */
const PromptInput = React.forwardRef<HTMLDivElement, any>(({ className, isLoading = false, maxHeight = 240, value, onValueChange, onSubmit, children, disabled, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value || "");
  const handleChange = (newValue: string) => { setInternalValue(newValue); onValueChange?.(newValue); };
  
  return (
    <TooltipProvider>
      <PromptInputContext.Provider value={{ isLoading, value: value ?? internalValue, setValue: onValueChange ?? handleChange, maxHeight, onSubmit, disabled }}>
        <div ref={ref} className={cn("rounded-[2px] border border-white/10 bg-[#1A1A1D] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-all duration-500", isLoading && "border-[#CCFF00]/50 shadow-[0_0_40px_rgba(204,255,0,0.1)]", className)} {...props}>
          {children}
        </div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
});
PromptInput.displayName = "PromptInput";

const PromptInputTextarea: React.FC<any> = ({ className, onKeyDown, disableAutosize = false, placeholder, ...props }) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (disableAutosize || !textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = typeof maxHeight === "number" ? `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px` : `min(${textareaRef.current.scrollHeight}px, ${maxHeight})`;
  }, [value, maxHeight, disableAutosize]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit?.(); }
    onKeyDown?.(e);
  };

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className={cn("text-xl leading-snug min-h-[60px] italic", className)}
      disabled={disabled}
      placeholder={placeholder}
      {...props}
    />
  );
};

const PromptInputBox = React.forwardRef<HTMLDivElement, any>(({ onSend, isLoading, placeholder, className }, ref) => {
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);

  const [selectedChar, setSelectedChar] = React.useState<CharacterModel | null>(null);
  const [selectedRatio, setSelectedRatio] = React.useState("16:9");
  const [selectedModel, setSelectedModel] = React.useState("Nano Banana Pro");
  const [characters, setCharacters] = React.useState<CharacterModel[]>([]);

  React.useEffect(() => {
    setCharacters(mockStore.getCharacters().filter(c => c.status === 'ready'));
  }, []);

  const handleSubmit = () => {
    if (input.trim() || files.length > 0) {
      onSend?.({ prompt: input, files, config: { character: selectedChar, ratio: selectedRatio, model: selectedModel } });
      setInput("");
      setFiles([]);
    }
  };

  const hasContent = input.trim() !== "" || files.length > 0;

  return (
    <PromptInput
      value={input}
      onValueChange={setInput}
      isLoading={isLoading}
      onSubmit={handleSubmit}
      className={cn("w-full max-w-4xl mx-auto", className)}
    >
      <div className="flex flex-wrap gap-2 mb-4">
          {files.map((file, i) => (
            <div key={i} className="relative group rounded-[2px] overflow-hidden w-20 h-20 border border-white/10">
              <img src={URL.createObjectURL(file)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/80 p-1 text-white hover:text-[#CCFF00] rounded-[2px]"><X className="h-3 w-3"/></button>
            </div>
          ))}
      </div>

      <PromptInputTextarea 
        placeholder={placeholder || "Describe your extraction sequence..."}
        className="text-white placeholder:text-slate-800 italic"
      />

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 flex-wrap">
           <Tooltip>
             <TooltipTrigger asChild>
               <Button variant="ghost" size="icon" onClick={() => uploadInputRef.current?.click()}>
                 <Paperclip className="h-5 w-5" />
                 <input ref={uploadInputRef} type="file" className="hidden" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} accept="image/*" />
               </Button>
             </TooltipTrigger>
             <TooltipContent>Inject Reference</TooltipContent>
           </Tooltip>
           
           <div className="h-4 w-[1px] bg-white/10 mx-2" />

           <Popover>
             <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="font-black italic">
                  <User className="h-3.5 w-3.5 mr-2 text-[#CCFF00]" /> 
                  {selectedChar ? selectedChar.name : "Persona"} 
                  <ChevronDown className="h-3 w-3 ml-2 opacity-30" />
                </Button>
             </PopoverTrigger>
             <PopoverContent align="start">
                <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 px-1">Identity Selection</div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar px-1">
                  {characters.length === 0 ? (
                    <div className="px-3 py-2 text-[10px] italic text-slate-700">No ready models</div>
                  ) : (
                    characters.map(c => (
                      <DropdownItem key={c.id} active={selectedChar?.id === c.id} onClick={() => setSelectedChar(c)}>{c.name}</DropdownItem>
                    ))
                  )}
                  <div className="border-t border-white/5 my-1 pt-1">
                    <DropdownItem onClick={() => setSelectedChar(null)} active={!selectedChar}>Universal</DropdownItem>
                  </div>
                </div>
             </PopoverContent>
           </Popover>

           <Popover>
             <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="font-black italic">
                  <Ratio className="h-3.5 w-3.5 mr-2 text-[#CCFF00]" /> 
                  {selectedRatio} 
                  <ChevronDown className="h-3 w-3 ml-2 opacity-30" />
                </Button>
             </PopoverTrigger>
             <PopoverContent align="start" className="w-40">
                <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 px-1">Aspect Ratio</div>
                <DropdownItem active={selectedRatio === "1:1"} onClick={() => setSelectedRatio("1:1")}>Square 1:1</DropdownItem>
                <DropdownItem active={selectedRatio === "16:9"} onClick={() => setSelectedRatio("16:9")}>Cinema 16:9</DropdownItem>
                <DropdownItem active={selectedRatio === "9:16"} onClick={() => setSelectedRatio("9:16")}>Portrait 9:16</DropdownItem>
             </PopoverContent>
           </Popover>

           <Popover>
             <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="font-black italic">
                  <Settings2 className="h-3.5 w-3.5 mr-2 text-[#CCFF00]" /> 
                  Engine 
                  <ChevronDown className="h-3 w-3 ml-2 opacity-30" />
                </Button>
             </PopoverTrigger>
             <PopoverContent align="start">
                <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 px-1">Diffusion Logic</div>
                <DropdownItem active={selectedModel === "Nano Banana Pro"} onClick={() => setSelectedModel("Nano Banana Pro")}>Nano Banana Pro</DropdownItem>
                <DropdownItem active={selectedModel === "Pony Realism (SDXL)"} onClick={() => setSelectedModel("Pony Realism (SDXL)")}>Pony Realism</DropdownItem>
                <DropdownItem active={selectedModel === "Seedream 4.5"} onClick={() => setSelectedModel("Seedream 4.5")}>Seedream 4.5</DropdownItem>
             </PopoverContent>
           </Popover>

           <div className="h-4 w-[1px] bg-white/10 mx-2" />
           
           <Button variant="ghost" size="sm" className="text-[#CCFF00] hover:bg-[#CCFF00]/5 font-black italic">
             <BrainCog className="h-3.5 w-3.5 mr-2" /> Enhance
           </Button>
        </div>

        <Button 
          variant="prism" 
          onClick={handleSubmit} 
          disabled={isLoading || !hasContent}
          className="px-10 h-14"
        >
          {isLoading ? (
             <><Square className="h-4 w-4 animate-spin mr-2" /> RENDERING...</>
          ) : (
             <><Sparkles className="h-4 w-4 fill-black mr-2" /> EXECUTE</>
          )}
        </Button>
      </div>
    </PromptInput>
  );
});
PromptInputBox.displayName = "PromptInputBox";

export const CreativePage: React.FC = () => {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'MORNING' : hour < 18 ? 'AFTERNOON' : 'EVENING';

  const handleGeneration = (data: any) => {
    console.log("Generating with:", data);
    alert('Creative extraction initiated. Dispatching to natak.io...');
  };

  return (
    <div className="h-full text-white p-0 relative overflow-hidden flex flex-col bg-black font-inter select-none">
      <AnimatedShaderBackground />
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-24 px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <BlurFade delay={0.1}>
            <h1 className="text-7xl md:text-[6rem] font-[900] tracking-tighter mb-4 uppercase italic leading-[0.85] animate-float drop-shadow-[0_20px_40px_rgba(0,0,0,1)]">
              GOOD {timeOfDay},<br/><span className="text-[#CCFF00]">OPERATOR.</span>
            </h1>
          </BlurFade>
          <BlurFade delay={0.3}>
            <div className="flex items-center justify-center gap-4 py-4 border-y border-white/5 my-8">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
                ORCHESTRATE HIGH-FIDELITY EXTRACTIONS AND TEMPORAL SEQUENCES
              </p>
            </div>
          </BlurFade>
        </div>

        <div className="max-w-4xl mx-auto mb-28">
          <BlurFade delay={0.4}>
            <PromptInputBox 
              onSend={handleGeneration}
              placeholder="Input cinematic parameters..." 
            />
          </BlurFade>
        </div>

        <section className="max-w-7xl mx-auto mb-24">
          <BlurFade delay={0.6}>
            <div className="flex items-center justify-between mb-12 px-2 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-[2px] bg-[#CCFF00] flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                    <ImageIcon className="h-5 w-5 text-black"/>
                 </div>
                 <h2 className="text-2xl font-[900] italic tracking-tighter uppercase text-white">Recent Artifacts</h2>
              </div>
              <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">View All Extractions</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {DEMO_CARDS.map((card, i) => (
                <div key={i} className="group relative rounded-[2px] overflow-hidden cursor-pointer aspect-[2/3] border border-white/5 hover:border-[#CCFF00]/40 transition-all duration-700 hover:scale-[1.01] bg-[#1A1A1D]">
                  <img 
                    src={card.imageSrc} 
                    alt={card.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="text-[8px] font-black text-[#CCFF00] mb-2 uppercase tracking-[0.3em] italic">Seed Analysis Active</span>
                    <h3 className="font-[900] text-white leading-tight italic uppercase text-lg tracking-tighter">{card.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </BlurFade>
        </section>
      </div>
    </div>
  );
};
