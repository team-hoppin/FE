'use client';

import { motion } from 'framer-motion';

interface FadeMotionProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}

export default function FadeMotion({ children, duration = 0.3, delay = 0, className }: FadeMotionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
