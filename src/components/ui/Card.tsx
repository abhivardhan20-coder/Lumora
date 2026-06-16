import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

export const Card = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, ...props }, ref) => (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-xl bg-bg-elevated border border-white/5 shadow-xl backdrop-blur-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';
