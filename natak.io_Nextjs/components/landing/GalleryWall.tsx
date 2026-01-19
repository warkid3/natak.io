"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
    Clock,
    DollarSign,
    Zap,
    Download,
    Maximize2,
    ArrowUpRight,
    Aperture,
    Grid,
    Activity
} from 'lucide-react';

const GalleryWall = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Smooth cursor movement
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.animate({
                    left: `${e.clientX}px`,
                    top: `${e.clientY}px`
                }, { duration: 500, fill: "forwards" });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const galleryItems = [
        { id: 1, type: 'Studio', time: '12s', cost: '$0.02', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
        { id: 2, type: 'Urban', time: '14s', cost: '$0.02', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1539109136881-3be4116ac121?auto=format&fit=crop&w=800&q=80' },
        { id: 3, type: 'Outdoor', time: '09s', cost: '$0.01', aspect: 'landscape', img: 'https://images.unsplash.com/photo-1506634572416-0174bb08063f?auto=format&fit=crop&w=800&q=80' },
        { id: 4, type: 'Editorial', time: '18s', cost: '$0.03', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80' },
        { id: 5, type: 'Studio', time: '11s', cost: '$0.02', aspect: 'square', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80' },
        { id: 6, type: 'Urban', time: '15s', cost: '$0.02', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80' },
        { id: 7, type: 'Outdoor', time: '13s', cost: '$0.02', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80' },
        { id: 8, type: 'Editorial', time: '21s', cost: '$0.04', aspect: 'landscape', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80' },
        { id: 9, type: 'Studio', time: '10s', cost: '$0.02', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?auto=format&fit=crop&w=800&q=80' },
        { id: 10, type: 'Urban', time: '16s', cost: '$0.02', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1611601679655-7c8dd197f0c6?auto=format&fit=crop&w=800&q=80' },
        { id: 11, type: 'Outdoor', time: '12s', cost: '$0.02', aspect: 'square', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80' },
        { id: 12, type: 'Editorial', time: '19s', cost: '$0.03', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=800&q=80' },
        { id: 13, type: 'Studio', time: '12s', cost: '$0.02', aspect: 'portrait', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80' },
    ];

    const filters = ['All', 'Studio', 'Urban', 'Outdoor', 'Editorial'];

    // Add type filter
    const filteredItems = activeFilter === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.type === activeFilter);

    return (
        <div className="relative min-h-screen bg-void text-white selection:bg-lime selection:text-black overflow-x-hidden group/gallery">

            {/* --- CUSTOM CURSOR --- */}
            <div
                ref={cursorRef}
                className="fixed pointer-events-none z-[100] w-4 h-4 rounded-full bg-lime mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hidden md:group-hover/gallery:block shadow-[0_0_20px_rgba(223,255,0,0.5)]"
                style={{
                    width: hoveredIndex !== null ? '80px' : '12px',
                    height: hoveredIndex !== null ? '80px' : '12px',
                    backgroundColor: hoveredIndex !== null ? 'rgba(223, 255, 0, 0.1)' : '#DFFF00',
                    border: hoveredIndex !== null ? '1px solid #DFFF00' : 'none',
                    backdropFilter: hoveredIndex !== null ? 'blur(2px)' : 'none',
                }}
            >
                {hoveredIndex !== null && (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-lime animate-pulse">
                        VIEW
                    </div>
                )}
            </div>

            {/* --- SCROLLING MARQUEE HEADER --- */}
            <div className="relative pt-20 pb-12 overflow-hidden border-b border-white/5 bg-void">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/2 left-0 w-[200%] -translate-y-1/2 flex whitespace-nowrap animate-marquee-fast">
                        {Array(10).fill(" CONSISTENCY // SPEED // COST // PRECISION // ").map((text, i) => (
                            <span key={i} className="text-[10rem] font-black text-transparent stroke-text">{text}</span>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-lime animate-ping"></div>
                            <span className="font-mono text-lime text-xs tracking-[0.2em]">LIVE_GENERATION_FEED_V.2.0</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                            THE ARCHIVE
                        </h1>
                    </div>

                    <div className="flex flex-col items-end gap-6">
                        <div className="flex gap-4 text-xs font-mono text-neutral-400">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-lime" />
                                <span>SYSTEM: STABLE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Grid className="w-4 h-4 text-lime" />
                                <span>ASSETS: 48,291</span>
                            </div>
                        </div>

                        {/* Minimalist Filter */}
                        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full backdrop-blur-md border border-white/5">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-500 relative overflow-hidden group
                        ${activeFilter === filter ? 'text-black' : 'text-neutral-400 hover:text-white'}`}
                                >
                                    {activeFilter === filter && (
                                        <div className="absolute inset-0 bg-lime rounded-full"></div>
                                    )}
                                    <span className="relative z-10">{filter}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MASONRY GALLERY --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 min-h-screen">
                <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {filteredItems.map((item, idx) => (
                        <div
                            key={`${item.id}-${idx}`}
                            className="relative group break-inside-avoid"
                            onMouseEnter={() => setHoveredIndex(item.id)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Card Container */}
                            <div
                                className={`relative overflow-hidden bg-neutral-900 border border-white/5 rounded-[20px] transition-all duration-700 ease-out
                  ${hoveredIndex === item.id ? 'z-20 scale-[1.02] shadow-[0_20px_50px_-12px_rgba(223,255,0,0.15)] border-lime/30' : 'grayscale opacity-80'}
                  ${hoveredIndex !== null && hoveredIndex !== item.id ? 'blur-[2px] opacity-30 scale-95' : ''}
                `}
                            >
                                {/* Image */}
                                <img
                                    src={item.img}
                                    alt={item.type}
                                    className={`w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]
                      ${item.aspect === 'portrait' ? 'aspect-[3/4]' : item.aspect === 'square' ? 'aspect-square' : 'aspect-[16/10]'}
                      ${hoveredIndex === item.id ? 'scale-110' : 'scale-100'}
                    `}
                                />

                                {/* Tech Overlay (Visible on Hover) */}
                                <div className={`absolute inset-0 p-6 flex flex-col justify-between transition-opacity duration-300 ${hoveredIndex === item.id ? 'opacity-100' : 'opacity-0'}`}>

                                    {/* Top Bar */}
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-2">
                                            <span className="px-2 py-1 bg-lime text-black text-[10px] font-black font-mono uppercase tracking-wider">
                                                GEN_ID_0{item.id}
                                            </span>
                                        </div>
                                        <ArrowUpRight className="text-white w-6 h-6" />
                                    </div>

                                    {/* Bottom Info */}
                                    <div className="bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                                        <div className="w-full h-[1px] bg-gradient-to-r from-lime to-transparent mb-4"></div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-2">{item.type}</h3>

                                        <div className="grid grid-cols-2 gap-4 text-[10px] font-mono font-black text-neutral-300">
                                            <div>
                                                <span className="block text-neutral-500 uppercase tracking-widest">RENDER_TIME</span>
                                                <span className="text-lime">{item.time}</span>
                                            </div>
                                            <div>
                                                <span className="block text-neutral-500 uppercase tracking-widest">EST_COST</span>
                                                <span className="text-lime">{item.cost}</span>
                                            </div>
                                            <div>
                                                <span className="block text-neutral-500 uppercase tracking-widest">MODEL</span>
                                                <span className="text-white">NANO_V2</span>
                                            </div>
                                            <div>
                                                <span className="block text-neutral-500 uppercase tracking-widest">STATUS</span>
                                                <span className="text-white">VERIFIED</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Corner Accents */}
                                <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-lime transition-all duration-300 ${hoveredIndex === item.id ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-2 -translate-y-2'}`}></div>
                                <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-lime transition-all duration-300 ${hoveredIndex === item.id ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-2 translate-y-2'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="py-24 flex justify-center">
                    <button className="relative px-12 py-6 bg-transparent border border-neutral-800 text-neutral-500 hover:text-black hover:bg-lime transition-all duration-500 uppercase font-black tracking-widest text-sm group overflow-hidden rounded-xl">
                        <span className="relative z-10 flex items-center gap-4">
                            Load More From Database <Aperture className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                        </span>
                    </button>
                </div>
            </div>

            <style jsx>{`
        .stroke-text {
           -webkit-text-stroke: 1px rgba(255, 255, 255, 0.05);
        }
        @keyframes marquee-fast {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
        }
        .animate-marquee-fast {
           animation: marquee-fast 60s linear infinite;
        }
      `}</style>
        </div>
    );
};

export { GalleryWall };
