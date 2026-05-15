"use client";

import { AnimatePresence, motion } from "framer-motion";

interface FadeMotionProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  x?: number;
  className?: string;
}

export function MotionLayout({ children }: { children: React.ReactNode }) {
  return <AnimatePresence>{children}</AnimatePresence>;
}

export default function FadeMotion({
  children,
  duration = 0.3,
  delay = 0,
  x,
  className,
}: FadeMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, ...(x !== undefined && { x }) }}
      animate={{ opacity: 1, ...(x !== undefined && { x: 0 }) }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
