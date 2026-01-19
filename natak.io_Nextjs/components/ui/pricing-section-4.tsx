"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const plans = [
    {
        name: "Starter",
        description:
            "Great for small businesses and startups looking to get started with AI",
        price: 12,
        yearlyPrice: 99,
        buttonText: "Get started",
        buttonVariant: "outline" as const,
        includes: [
            "200 Generation Credits/mo",
            "1 Identity Model (LoRA)",
            "Basic Kanban Pipeline",
            "Standard Queue Priority",
            "Community Support",
        ],
    },
    {
        name: "Business",
        description:
            "Best value for growing businesses that need more advanced features",
        price: 48,
        yearlyPrice: 399,
        buttonText: "Get started",
        buttonVariant: "default" as const,
        popular: true,
        includes: [
            "Everything in Starter, plus:",
            "800 Generation Credits/mo",
            "3 Identity Models (LoRA)",
            "Vibe Stealer Extension",
            "Advanced Flow Control",
            "Priority Queue Access",
        ],
    },
    {
        name: "Enterprise",
        description:
            "Advanced plan with enhanced security and unlimited access for large teams",
        price: 96,
        yearlyPrice: 899,
        buttonText: "Get started",
        buttonVariant: "outline" as const,
        includes: [
            "Everything in Business, plus:",
            "Unlimited Generation Credits",
            "10 Identity Models (LoRA)",
            "Dedicated GPU Instance",
            "Custom Integrations",
            "SLA Support",
        ],
    },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
    const [selected, setSelected] = useState("0");

    const handleSwitch = (value: string) => {
        setSelected(value);
        onSwitch(value);
    };

    return (
        <div className="flex justify-center">
            <div className="relative z-10 mx-auto flex w-fit rounded-full bg-neutral-900 border border-gray-700 p-1">
                <button
                    onClick={() => handleSwitch("0")}
                    className={cn(
                        "relative z-10 w-fit h-10  rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
                        selected === "0" ? "text-white" : "text-gray-200",
                    )}
                >
                    {selected === "0" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-lime-600 border-lime-600 bg-gradient-to-t from-lime-500 to-lime-600"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className={cn("relative", selected === "0" ? "text-black font-bold" : "")}>Monthly</span>
                </button>

                <button
                    onClick={() => handleSwitch("1")}
                    className={cn(
                        "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
                        selected === "1" ? "text-white" : "text-gray-200",
                    )}
                >
                    {selected === "1" && (
                        <motion.span
                            layoutId={"switch"}
                            className="absolute top-0 left-0 h-10 w-full  rounded-full border-4 shadow-sm shadow-lime-600 border-lime-600 bg-gradient-to-t from-lime-500 to-lime-600"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    <span className={cn("relative flex items-center gap-2", selected === "1" ? "text-black font-bold" : "")}>Yearly</span>
                </button>
            </div>
        </div>
    );
};

export default function PricingSection6() {
    const [isYearly, setIsYearly] = useState(false);
    const pricingRef = useRef<HTMLDivElement>(null);

    const revealVariants = {
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            transition: {
                delay: i * 0.2, // Faster delay
                duration: 0.5,
            },
        }),
        hidden: {
            filter: "blur(10px)",
            y: -20,
            opacity: 0,
        },
    };

    const togglePricingPeriod = (value: string) =>
        setIsYearly(Number.parseInt(value) === 1);

    return (
        <div
            className=" mx-auto relative overflow-x-hidden pb-32"
            ref={pricingRef}
        >
            <TimelineContent
                animationNum={4}
                timelineRef={pricingRef}
                customVariants={revealVariants}
                className="absolute top-0  h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] "
            >
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2c_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px] "></div>
                <SparklesComp
                    density={1800}
                    direction="bottom"
                    speed={1}
                    color="#DFFF00"
                    className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
                />
            </TimelineContent>


            <article className="text-center mb-6 pt-32 max-w-3xl mx-auto space-y-2 relative z-50 px-4">
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">
                    <VerticalCutReveal
                        splitBy="words"
                        staggerDuration={0.15}
                        staggerFrom="first"
                        reverse={true}
                        containerClassName="justify-center "
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 40,
                            delay: 0, // First element
                        }}
                    >
                        Choose Your Capacity
                    </VerticalCutReveal>
                </h2>

                <TimelineContent
                    as="p"
                    animationNum={0}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="text-neutral-500 font-mono text-lg"
                >
                    Scale your infrastructure as your content empire grows.
                </TimelineContent>

                <TimelineContent
                    as="div"
                    animationNum={1}
                    timelineRef={pricingRef}
                    customVariants={revealVariants}
                    className="pt-8"
                >
                    <PricingSwitch onSwitch={togglePricingPeriod} />
                </TimelineContent>
            </article>

            <div
                className="absolute top-0 left-[10%] right-[10%] w-[80%] h-full z-0"
                style={{
                    backgroundImage: `
        radial-gradient(circle at center, #DFFF00 0%, transparent 70%)
      `,
                    opacity: 0.1,
                    mixBlendMode: "screen",
                }}
            />

            <div className="grid md:grid-cols-3 max-w-6xl gap-6 py-12 mx-auto px-6 relative z-10">
                {plans.map((plan, index) => (
                    <TimelineContent
                        key={plan.name}
                        as="div"
                        animationNum={2 + index}
                        timelineRef={pricingRef}
                        customVariants={revealVariants}
                    >
                        <Card
                            className={`relative h-full text-white border-white/10 ${plan.popular
                                    ? "bg-neutral-900/80 shadow-[0px_0px_50px_-10px_rgba(223,255,0,0.15)] z-20 border-lime/30"
                                    : "bg-neutral-950/50 backdrop-blur-sm z-10"
                                }`}
                        >
                            <CardHeader className="text-left ">
                                <div className="flex justify-between">
                                    <h3 className="text-xl font-bold font-mono uppercase tracking-wider text-neutral-400 mb-2">{plan.name}</h3>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-black italic tracking-tighter text-white">
                                        $
                                        <NumberFlow
                                            format={{
                                                currency: "USD",
                                            }}
                                            value={isYearly ? plan.yearlyPrice : plan.price}
                                            className="text-5xl font-black italic tracking-tighter"
                                        />
                                    </span>
                                    <span className="text-neutral-500 ml-1 font-mono text-sm">
                                        /{isYearly ? "year" : "month"}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-400 mb-4 h-10">{plan.description}</p>
                            </CardHeader>

                            <CardContent className="pt-0">
                                <button
                                    className={`w-full mb-8 py-3 text-sm font-black uppercase tracking-widest rounded transition-all duration-300 ${plan.popular
                                            ? "bg-lime text-black hover:shadow-[0_0_30px_rgba(223,255,0,0.4)] hover:-translate-y-1"
                                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <h4 className="font-bold text-xs uppercase tracking-widest text-neutral-500">
                                        INCLUDES:
                                    </h4>
                                    <ul className="space-y-3">
                                        {plan.includes.map((feature, featureIndex) => (
                                            <li
                                                key={featureIndex}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="h-1.5 w-1.5 mt-1.5 bg-lime rounded-full grid place-content-center shrink-0 shadow-[0_0_10px_#DFFF00]"></span>
                                                <span className="text-sm text-neutral-300 font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </TimelineContent>
                ))}
            </div>
        </div>
    );
}
