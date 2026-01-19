"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface NavProps {
    isSystemActive: boolean;
}

const AnimatedNavLink = ({ href, children, isSystemActive }: { href: string; children: React.ReactNode; isSystemActive: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    // Color logic based on system state
    const defaultTextColor = isSystemActive
        ? (isActive ? 'text-black' : 'text-black/50')
        : (isActive ? 'text-lime' : 'text-gray-400');

    const hoverTextColor = isSystemActive ? 'text-black font-black' : 'text-white';
    const textSizeClass = 'text-[11px] font-bold uppercase tracking-widest';

    return (
        <Link
            href={href}
            className={`group relative block overflow-hidden h-6 ${textSizeClass} transition-colors duration-700`}
        >
            <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform group-hover:-translate-y-1/2">
                <span className={`${defaultTextColor} h-6 flex items-center justify-center leading-none whitespace-nowrap transition-colors duration-700`}>
                    {children}
                </span>
                <span className={`${hoverTextColor} h-6 flex items-center justify-center leading-none whitespace-nowrap transition-colors duration-700`}>
                    {children}
                </span>
            </div>
        </Link>
    );
};

export function Navbar({ isSystemActive }: NavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
    const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (shapeTimeoutRef.current) {
            clearTimeout(shapeTimeoutRef.current);
        }

        if (isOpen) {
            setHeaderShapeClass('rounded-2xl');
        } else {
            shapeTimeoutRef.current = setTimeout(() => {
                setHeaderShapeClass('rounded-full');
            }, 300);
        }

        return () => {
            if (shapeTimeoutRef.current) {
                clearTimeout(shapeTimeoutRef.current);
            }
        };
    }, [isOpen]);

    const logoElement = (
        <Link href="/" className="relative w-6 h-6 flex items-center justify-center group mr-4 shrink-0">
            <span className={`absolute w-1.5 h-1.5 rounded-full ${isSystemActive ? 'bg-black' : 'bg-lime'} top-0 left-1/2 transform -translate-x-1/2 opacity-80 group-hover:scale-125 transition-all duration-700`}></span>
            <span className={`absolute w-1.5 h-1.5 rounded-full ${isSystemActive ? 'bg-black' : 'bg-lime'} left-0 top-1/2 transform -translate-y-1/2 opacity-80 group-hover:scale-125 transition-all duration-700`}></span>
            <span className={`absolute w-1.5 h-1.5 rounded-full ${isSystemActive ? 'bg-black' : 'bg-lime'} right-0 top-1/2 transform -translate-y-1/2 opacity-80 group-hover:scale-125 transition-all duration-700`}></span>
            <span className={`absolute w-1.5 h-1.5 rounded-full ${isSystemActive ? 'bg-black' : 'bg-lime'} bottom-0 left-1/2 transform -translate-x-1/2 opacity-80 group-hover:scale-125 transition-all duration-700`}></span>
        </Link>
    );

    const navLinksData = [
        { label: 'Home', href: '/' },
        { label: 'Plans', href: '/pricing' },
        { label: 'Blog', href: '/blogs' },
        { label: 'About', href: '/about' },
    ];

    const loginButtonElement = (
        <button className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest border transition-all duration-700 rounded-full backdrop-blur-md w-full sm:w-auto
      ${isSystemActive
                ? 'border-black/20 bg-black/5 text-black hover:bg-black/10'
                : 'border-white/10 bg-white/5 text-gray-400 hover:border-lime/50 hover:text-white'}
    `}>
            Log In
        </button>
    );

    const signupButtonElement = (
        <div className="relative group w-full sm:w-auto">
            <div className={`absolute inset-0 -m-1.5 rounded-full hidden sm:block opacity-20 filter blur-lg pointer-events-none transition-all duration-300 ease-out group-hover:opacity-40 group-hover:blur-xl group-hover:-m-3
         ${isSystemActive ? 'bg-black' : 'bg-lime'}
       `}></div>
            <button className={`relative z-10 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all duration-700 w-full sm:w-auto shadow-lg
         ${isSystemActive
                    ? 'text-lime bg-black hover:bg-zinc-800'
                    : 'text-black bg-lime hover:bg-white'}
       `}>
                Get Started
            </button>
        </div>
    );

    return (
        <header className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[300]
                       flex flex-col items-center
                       px-6 py-2.5 backdrop-blur-2xl
                       ${headerShapeClass}
                       border transition-all duration-700
                       w-[calc(100%-3rem)] sm:w-auto
                       shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]
                       ${isSystemActive
                ? 'border-black/10 bg-black/5'
                : 'border-white/10 bg-white/[0.02]'}
                       `}>

            <div className="flex items-center justify-between w-full gap-x-8 sm:gap-x-12">
                <div className="flex items-center">
                    {logoElement}
                </div>

                <nav className="hidden md:flex items-center space-x-10">
                    {navLinksData.map((link) => (
                        <AnimatedNavLink key={link.href} href={link.href} isSystemActive={isSystemActive}>
                            {link.label}
                        </AnimatedNavLink>
                    ))}
                </nav>

                <div className="hidden sm:flex items-center gap-4">
                    {loginButtonElement}
                    {signupButtonElement}
                </div>

                <button
                    className={`md:hidden flex items-center justify-center w-8 h-8 transition-colors duration-700 focus:outline-none
            ${isSystemActive ? 'text-black' : 'text-gray-300'}
          `}
                    onClick={toggleMenu}
                    aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
                >
                    {isOpen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    )}
                </button>
            </div>

            <div className={`md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-8 pb-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
                <nav className="flex flex-col items-center space-y-6 text-base w-full pb-8">
                    {navLinksData.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-700 w-full text-center
                ${isSystemActive ? 'text-black/60 hover:text-black' : 'text-gray-400 hover:text-lime'}
              `}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex flex-col items-center space-y-4 w-full border-t border-white/5 pt-8">
                    {loginButtonElement}
                    {signupButtonElement}
                </div>
            </div>
        </header>
    );
}
