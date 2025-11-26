"use client";

import { motion, useInView, Variants } from "motion/react";
import { ElementType, useRef } from "react";

interface TimelineContentProps {
  as?: ElementType;
  animationNum?: number;
  timelineRef?: React.RefObject<HTMLElement>;
  customVariants?: {
    visible: (i: number) => any;
    hidden: any;
  };
  className?: string;
  children: React.ReactNode;
}

export const TimelineContent = ({
  as: Component = "div",
  animationNum = 0,
  timelineRef,
  customVariants,
  className,
  children,
}: TimelineContentProps) => {
  const internalRef = useRef(null);
  const ref = timelineRef || internalRef;
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const variants = customVariants || defaultVariants;

  return (
    <Component className={className}>
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        custom={animationNum}
        variants={variants as Variants}
      >
        {children}
      </motion.div>
    </Component>
  );
};
