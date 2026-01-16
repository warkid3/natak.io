"use client";

import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import React from "react";

// --- Configuration ---
const DEFAULT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]; // Premium "Expo Out" feel
const DEFAULT_DURATION = 0.5;

// --- Primitives ---

interface FadeInProps extends HTMLMotionProps<"div"> {
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none"; // Simplified slide logic
    distance?: number; // How far to slide
}

export const FadeIn = ({
    children,
    delay = 0,
    duration = DEFAULT_DURATION,
    direction = "none",
    distance = 20,
    className,
    ...props
}: FadeInProps) => {
    let initial: any = { opacity: 0 };
    if (direction === "up") initial.y = distance;
    if (direction === "down") initial.y = -distance;
    if (direction === "left") initial.x = distance;
    if (direction === "right") initial.x = -distance;

    return (
        <motion.div
            initial={initial}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration, delay, ease: DEFAULT_EASE }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const StaggerContainer = ({
    children,
    delayChildren = 0,
    staggerChildren = 0.05,
    className,
    ...props
}: HTMLMotionProps<"div"> & { delayChildren?: number; staggerChildren?: number }) => {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: {},
                show: {
                    transition: {
                        delayChildren,
                        staggerChildren,
                    },
                },
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Use this for direct children of StaggerContainer
export const StaggerItem = ({ children, className, ...props }: HTMLMotionProps<"div">) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: DEFAULT_EASE } },
            }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const HoverCard = ({ children, className, ...props }: HTMLMotionProps<"div">) => {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
};
