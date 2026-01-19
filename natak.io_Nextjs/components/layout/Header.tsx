"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/roadmap", label: "Roadmap" },
    { href: "/about", label: "About" },
];

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-[2px] bg-void z-[60]">
                <motion.div
                    className="h-full bg-lime"
                    style={{ width: "0%" }}
                    id="scroll-progress"
                />
            </div>

            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? "bg-void/95 backdrop-blur-md border-b border-industrial/10"
                        : "bg-transparent"
                    }`}
            >
                <div className="container-wide mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                className="text-2xl font-black tracking-tighter"
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className="text-industrial">NATAK</span>
                                <span className="text-lime">.io</span>
                            </motion.div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative text-sm font-medium text-industrial/80 hover:text-industrial transition-colors group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-lime transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </nav>

                        {/* CTA Button */}
                        <div className="hidden md:block">
                            <Link
                                href="#pricing"
                                className="btn btn-primary text-sm"
                            >
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-industrial"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-void/98 backdrop-blur-lg md:hidden"
                    >
                        <motion.nav
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center justify-center h-full gap-8"
                        >
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-3xl font-bold text-industrial hover:text-lime transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Link
                                    href="#pricing"
                                    className="btn btn-primary mt-4"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </motion.div>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
