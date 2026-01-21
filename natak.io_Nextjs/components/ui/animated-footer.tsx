"use client"
import React, { useEffect, useRef, useState } from "react";
import { Command } from "lucide-react";

interface LinkItem {
    href: string;
    label: string;
}

interface FooterProps {
    leftLinks: LinkItem[];
    rightLinks: LinkItem[];
    copyrightText: string;
    barCount?: number;
}

const Footer: React.FC<FooterProps> = ({
    leftLinks,
    rightLinks,
    copyrightText,
    barCount = 23,
}) => {
    const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
    const footerRef = useRef<HTMLDivElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const animationFrameRef = useRef<number | null>(null);


    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);


    useEffect(() => {
        let t = 0;

        const animateWave = () => {
            const waveElements = waveRefs.current;
            let offset = 0;

            waveElements.forEach((element, index) => {
                if (element) {
                    offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
                    element.style.transform = `translateY(${index + offset}px)`;
                }
            });

            t += 0.1;
            animationFrameRef.current = requestAnimationFrame(animateWave);
        };

        if (isVisible) {
            animateWave();
        } else if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [isVisible]);

    return (
        <footer
            ref={footerRef}
            className="bg-black text-white relative flex flex-col w-full h-full justify-between select-none overflow-hidden pb-10"
        >
            <div className="container mx-auto flex flex-col md:flex-row justify-between w-full gap-4 pb-12 pt-8 px-4 relative z-10">
                <div className="space-y-2">
                    <ul className="flex flex-wrap gap-4">
                        {leftLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.href} className="text-sm font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm mt-4 flex items-center gap-x-2 text-slate-500 font-mono">
                        <Command className="w-4 h-4" />
                        {copyrightText}
                    </p>
                </div>
                <div className="space-y-4">
                    <ul className="flex flex-wrap gap-4 md:justify-end">
                        {rightLinks.map((link, index) => (
                            <li key={index}>
                                <a href={link.href} className="text-sm font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="text-right mt-4">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-xs font-black uppercase tracking-widest text-lime/50 hover:text-lime hover:underline inline-flex items-center"
                        >
                            Back to top
                        </button>
                    </div>
                </div>
            </div>
            <div
                id="waveContainer"
                aria-hidden="true" // Hidden from screen readers
                style={{ overflow: "hidden", height: 120 }}
            >
                <div style={{ marginTop: 0 }}>
                    {Array.from({ length: barCount }).map((_, index) => (
                        <div
                            key={index}
                            ref={(el) => { waveRefs.current[index] = el; }}
                            className="wave-segment"
                            style={{
                                height: `${index + 1}px`,
                                backgroundColor: "#ccff00",
                                transition: "transform 0.1s ease",
                                willChange: "transform",
                                marginTop: "-2px",
                            }}
                        />
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
