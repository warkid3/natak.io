"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "What exactly is an Identity Model (LoRA)?",
        answer:
            "A LoRA (Low-Rank Adaptation) is a custom AI model trained specifically on your face. We train it using 10-20 photos of you from different angles and lighting. Once trained, this model can generate images of you in any context, outfit, or setting while maintaining perfect face consistency. Training takes about 30 minutes and the model is stored securely in your account.",
    },
    {
        question: "How is this different from other AI image generators?",
        answer:
            "Standard AI generators create random faces that change every time. NATAK.io uses your personal Identity Model to maintain consistent facial features across unlimited generations. Plus, our Kanban Factory lets you batch process 50+ images at once, and the Vibe Stealer captures styles from anywhere on the web. It's industrial-grade content infrastructure, not a toy.",
    },
    {
        question: "What's a 'generation credit' and how are they used?",
        answer:
            "One generation credit = one image generation. Most images cost 1 credit. Higher resolution or multi-face generations may cost 2-3 credits. Unused credits roll over for 60 days. Our typical cost per image is around $0.02 at the Director tier.",
    },
    {
        question: "Can I use the images commercially?",
        answer:
            "Absolutely. All generated images are yours to use commercially without attribution. This includes social media, marketing materials, e-commerce, advertisements—anywhere you need content. Your Identity Model, your images, your rights.",
    },
    {
        question: "How does the Vibe Stealer Chrome Extension work?",
        answer:
            "When you see an image with a style you love (on Instagram, Pinterest, anywhere), right-click and select 'Send to NATAK'. We extract the visual DNA—composition, lighting, color palette, mood—and save it as a reusable style template. Then apply that style to your Identity Model for consistent on-brand content.",
    },
    {
        question: "What's the Founder's Syndicate?",
        answer:
            "The Syndicate is our founding member program, limited to 100 spots. Members lock in Executive-tier features at Director-tier pricing for life, get priority feature requests, early access to new capabilities, and a direct line to the founding team. Once spots are filled, they're gone.",
    },
    {
        question: "Is my data and Identity Model secure?",
        answer:
            "Yes. Your training photos are encrypted and deleted after model training. Your Identity Model is stored encrypted at rest and never shared with other users. We don't use your images to train our base models. Your identity belongs to you.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="section bg-charcoal">
            <div className="container-narrow mx-auto max-w-3xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-4 py-1 bg-lime/10 text-lime text-sm mono uppercase tracking-wider mb-4 rounded">
                        FAQ
                    </span>
                    <h2 className="text-industrial mb-6">
                        Common <span className="text-lime">Questions</span>
                    </h2>
                </motion.div>

                {/* FAQ Accordion */}
                <div className="space-y-3">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-void border border-industrial/10 rounded"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                            >
                                <span className="font-medium text-industrial pr-4">
                                    {faq.question}
                                </span>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-shrink-0"
                                >
                                    <ChevronDown className="w-5 h-5 text-lime" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-5 pb-5 text-muted text-sm leading-relaxed border-t border-industrial/10 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
