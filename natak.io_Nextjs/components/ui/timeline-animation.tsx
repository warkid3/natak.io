"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';

interface TimelineContentProps {
    children?: React.ReactNode;
    as?: any;
    animationNum?: number;
    timelineRef?: React.RefObject<any>;
    customVariants?: Variants;
    className?: string;
    [key: string]: any;
}

export const TimelineContent = ({ children, as = "div", animationNum, timelineRef, customVariants, className, ...props }: TimelineContentProps) => {
    // If 'as' is a string (e.g., 'div', 'p'), use the corresponding motion component (e.g., motion.div)
    // If 'as' is already a component (e.g., motion.div), use it directly.
    const Component = typeof as === 'string' ? (motion as any)[as] || motion.div : as;

    return (
        <Component
            variants={customVariants}
            custom={animationNum}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={className}
            {...props}
        >
            {children}
        </Component>
    );
};
