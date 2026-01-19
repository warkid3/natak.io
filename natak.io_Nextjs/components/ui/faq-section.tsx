"use client";

import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useRef } from "react";
import { motion } from "framer-motion";

const MotionAccordionItem = motion(AccordionItem);

const faqs = [
    {
        question: "What exactly is an Identity Model (LoRA)?",
        answer:
            "A LoRA (Low-Rank Adaptation) is a custom AI model trained specifically on your face. We train it using 10-20 photos of you from different angles and lighting. Once trained, this model can generate images of you in any context, outfit, or setting while maintaining perfect face consistency. Training takes about 30 minutes and the model is stored securely in your account.",
    },
    {
        question: "How is this different from other AI image generators?",
        answer:
            "Standard AI generators create random faces that change every time, making branding impossible for AI influencers. NATAK.io uses your personal Identity Model to maintain consistent facial features across unlimited generations. Plus, our Kanban Factory lets you batch process 50+ images at once, the Vibe Stealer captures styles from anywhere, and our Neural Content Lake provides instant asset search. It's industrial ETL infrastructure for AI creator operations—not a hobbyist tool.",
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
            "When you see an image with a style you love (on Instagram, Pinterest, anywhere), right-click and select 'Send to NATAK'. We extract the visual DNA—composition, lighting, color palette, mood—and save it as a reusable style template. Then apply that style to your AI character's Identity Model for consistent on-brand AI influencer content.",
    },
    {
        question: "What's the Founder's Syndicate?",
        answer:
            "The Syndicate is our founding member program, limited to 100 spots. Members lock in Executive-tier features at Director-tier pricing for life, get priority feature requests, early access to new capabilities, and a direct line to the founding team. Once spots are filled, they're gone.",
    },
    {
        question: "Is my data and Identity Model secure?",
        answer:
            "Yes. Your training photos are encrypted end-to-end and deleted after model training. Your Identity Model (LoRA) is stored encrypted in your private cloud bucket and never shared with other users. We don't use your images to train our base models. Your AI character's identity belongs exclusively to you.",
    },
];

export default function FAQSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.1,
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: 20,
            opacity: 0,
        },
    };

    return (
        <div
            className="mx-auto relative overflow-hidden bg-void pb-32 pt-20"
            ref={containerRef}
        >
            <TimelineContent
                animationNum={4}
                timelineRef={containerRef}
                customVariants={revealVariants}
                className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] pointer-events-none"
            >
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px] "></div>
                <SparklesComp
                    density={800}
                    direction="top"
                    speed={0.5}
                    color="#DFFF00"
                    className="absolute inset-x-0 bottom-0 h-full w-full opacity-20"
                />
            </TimelineContent>

            <article className="text-center mb-16 max-w-3xl mx-auto space-y-4 relative z-10 px-6">
                <h2 className="text-4xl md:text-5xl font-black text-white">
                    <VerticalCutReveal
                        splitBy="characters"
                        staggerDuration={0.02}
                        staggerFrom="center"
                        reverse={true}
                        containerClassName="justify-center"
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 40,
                        }}
                    >
                        Common Questions
                    </VerticalCutReveal>
                </h2>

                <TimelineContent
                    as="p"
                    animationNum={0}
                    timelineRef={containerRef}
                    customVariants={revealVariants}
                    className="text-neutral-500 font-mono text-lg max-w-xl mx-auto"
                >
                    Everything you need to know about the NATAK industrial pipeline.
                </TimelineContent>
            </article>

            <div className="container max-w-4xl mx-auto px-6 relative z-20">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, i) => (
                        <TimelineContent
                            key={i}
                            as={MotionAccordionItem}
                            value={`item-${i}`}
                            animationNum={1 + i}
                            timelineRef={containerRef}
                            customVariants={revealVariants}
                            className="border border-white/10 bg-neutral-900/50 px-6 rounded-lg data-[state=open]:bg-neutral-900/80 data-[state=open]:border-lime/30 transition-all duration-300"
                        >
                            <AccordionTrigger className="text-lg font-bold text-neutral-200 hover:text-lime hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-neutral-400 text-base leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </TimelineContent>
                    ))}
                </Accordion>
            </div>

        </div>
    );
}
