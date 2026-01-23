"use client";

import * as React from "react";
import {
    Paperclip, X, Square, BrainCog,
    Sparkles, ImageIcon, User, Ratio, Settings2, ChevronDown, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";

import { BlurFade } from "@/components/ui/blur-fade";
import AnimatedShaderBackground from "@/components/ui/animated-shader-background";
import { cn } from "@/lib/utils";
import { realStore } from "@/services/realStore";
import { CharacterModel } from "@/types";

const DEMO_CARDS = [
    { title: 'Neon Cyberpunk', imageSrc: 'https://images.unsplash.com/photo-1605218427368-35b0266dc99e?q=80&w=768&auto=format&fit=crop' },
    { title: 'Abstract Fluid', imageSrc: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=768&auto=format&fit=crop' },
    { title: 'Digital Portrait', imageSrc: 'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=768&auto=format&fit=crop' },
    { title: 'Synthwave City', imageSrc: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=768&auto=format&fit=crop' },
    { title: 'Ethereal Space', imageSrc: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=768&auto=format&fit=crop' },
];

const DropdownItem = ({ children, onClick, active, icon: Icon }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between px-4 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all group hover:bg-white/5",
            active ? "bg-primary text-black hover:bg-primary/90" : "text-slate-500 hover:text-white"
        )}
    >
        <div className="flex items-center gap-3">
            {Icon && <Icon className={cn("w-3.5 h-3.5", active ? "text-black" : "text-slate-600 group-hover:text-primary")} />}
            {children}
        </div>
        {active && <Check className="w-3.5 h-3.5" />}
    </button>
);

const PromptInputBox = React.forwardRef<HTMLDivElement, any>(({ onSend, isLoading, placeholder, className }, ref) => {
    const [input, setInput] = React.useState("");
    const [files, setFiles] = React.useState<File[]>([]);
    const uploadInputRef = React.useRef<HTMLInputElement>(null);

    const [selectedChar, setSelectedChar] = React.useState<CharacterModel | null>(null);
    const [selectedRatio, setSelectedRatio] = React.useState("16:9");
    const [selectedModel, setSelectedModel] = React.useState("Nano Banana Pro");
    const [characters, setCharacters] = React.useState<CharacterModel[]>([]);

    React.useEffect(() => {
        const loadCharacters = async () => {
            const chars = await realStore.getCharacters();
            setCharacters(chars.filter(c => c.status === 'ready'));
        };
        loadCharacters();
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
        <div className={cn("rounded-sm border border-white/10 bg-[#1A1A1D] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-all duration-500", isLoading && "border-primary/50 shadow-[0_0_40px_rgba(204,255,0,0.1)]", className)}>
            <div className="flex flex-wrap gap-2 mb-4">
                {files.map((file, i) => (
                    <div key={i} className="relative group rounded-sm overflow-hidden w-20 h-20 border border-white/10">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/80 p-1 text-white hover:text-primary rounded-sm"><X className="h-3 w-3" /></button>
                    </div>
                ))}
            </div>

            <Textarea
                placeholder={placeholder || "Describe your extraction sequence..."}
                className="text-xl leading-snug min-h-[60px] italic bg-transparent border-none text-white placeholder:text-slate-800 resize-none focuc-visible:ring-0 focus-visible:ring-offset-0 px-0"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit();
                    }
                }}
            />

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => uploadInputRef.current?.click()} className="text-slate-500 hover:text-white hover:bg-white/5">
                                    <Paperclip className="h-5 w-5" />
                                    <input ref={uploadInputRef} type="file" className="hidden" onChange={(e) => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} accept="image/*" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Inject Reference</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="h-4 w-[1px] bg-white/10 mx-2" />

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="font-black italic text-slate-400 hover:text-white hover:bg-white/5">
                                <User className="h-3.5 w-3.5 mr-2 text-primary" />
                                {selectedChar ? selectedChar.name : "Persona"}
                                <ChevronDown className="h-3 w-3 ml-2 opacity-30" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-64 p-2 bg-[#0F0F11] border-white/10 text-white">
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
                            <Button variant="ghost" size="sm" className="font-black italic text-slate-400 hover:text-white hover:bg-white/5">
                                <Ratio className="h-3.5 w-3.5 mr-2 text-primary" />
                                {selectedRatio}
                                <ChevronDown className="h-3 w-3 ml-2 opacity-30" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-40 p-2 bg-[#0F0F11] border-white/10 text-white">
                            <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 px-1">Aspect Ratio</div>
                            <DropdownItem active={selectedRatio === "1:1"} onClick={() => setSelectedRatio("1:1")}>Square 1:1</DropdownItem>
                            <DropdownItem active={selectedRatio === "16:9"} onClick={() => setSelectedRatio("16:9")}>Cinema 16:9</DropdownItem>
                            <DropdownItem active={selectedRatio === "9:16"} onClick={() => setSelectedRatio("9:16")}>Portrait 9:16</DropdownItem>
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="font-black italic text-slate-400 hover:text-white hover:bg-white/5">
                                <Settings2 className="h-3.5 w-3.5 mr-2 text-primary" />
                                Engine
                                <ChevronDown className="h-3 w-3 ml-2 opacity-30" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-64 p-2 bg-[#0F0F11] border-white/10 text-white">
                            <div className="p-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1 px-1">Diffusion Logic</div>
                            <DropdownItem active={selectedModel === "Nano Banana Pro"} onClick={() => setSelectedModel("Nano Banana Pro")}>Nano Banana Pro</DropdownItem>
                            <DropdownItem active={selectedModel === "Pony Realism (SDXL)"} onClick={() => setSelectedModel("Pony Realism (SDXL)")}>Pony Realism</DropdownItem>
                            <DropdownItem active={selectedModel === "Seedream 4.5"} onClick={() => setSelectedModel("Seedream 4.5")}>Seedream 4.5</DropdownItem>
                        </PopoverContent>
                    </Popover>

                    <div className="h-4 w-[1px] bg-white/10 mx-2" />

                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 font-black italic hover:text-primary">
                        <BrainCog className="h-3.5 w-3.5 mr-2" /> Enhance
                    </Button>
                </div>

                <Button
                    variant="natak"
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
        </div>
    );
});
PromptInputBox.displayName = "PromptInputBox";

export default function CreativePage() {
    const [hour, setHour] = React.useState(12);

    React.useEffect(() => {
        setHour(new Date().getHours());
    }, []);

    const timeOfDay = hour < 12 ? 'MORNING' : hour < 18 ? 'AFTERNOON' : 'EVENING';

    const handleGeneration = (data: any) => {
        console.log("Generating with:", data);
        alert('Creative extraction initiated. Dispatching to natak.io...');
    };

    return (
        <div className="h-full text-white p-0 relative overflow-hidden flex flex-col bg-black font-sans select-none">
            <AnimatedShaderBackground />

            <div className="flex-1 overflow-y-auto custom-scrollbar pt-20 pb-24 px-6 md:px-12 relative z-10 w-full">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <BlurFade delay={0.1}>
                        <h1 className="text-7xl md:text-[6rem] font-[900] tracking-tighter mb-4 uppercase italic leading-[0.85] drop-shadow-[0_20px_40px_rgba(0,0,0,1)]">
                            GOOD {timeOfDay},<br /><span className="text-primary">OPERATOR.</span>
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
                                <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                                    <ImageIcon className="h-5 w-5 text-black" />
                                </div>
                                <h2 className="text-2xl font-[900] italic tracking-tighter uppercase text-white">Recent Artifacts</h2>
                            </div>
                            <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">View All Extractions</button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                            {DEMO_CARDS.map((card, i) => (
                                <div key={i} className="group relative rounded-sm overflow-hidden cursor-pointer aspect-[2/3] border border-white/5 hover:border-primary/40 transition-all duration-700 hover:scale-[1.01] bg-[#1A1A1D]">
                                    <img
                                        src={card.imageSrc}
                                        alt={card.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 grayscale group-hover:opacity-100 group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                                        <span className="text-[8px] font-black text-primary mb-2 uppercase tracking-[0.3em] italic">Seed Analysis Active</span>
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
}
