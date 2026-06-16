import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary: 'bg-accent-gold text-text-on-accent hover:brightness-110 shadow-[0_0_15px_rgba(197,164,110,0.3)]',
      secondary: 'bg-transparent border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 shadow-[0_0_10px_rgba(95,179,201,0.1)]',
      ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/5',
      glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-text-primary hover:bg-white/10'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-4 text-lg font-medium tracking-wide'
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-sans transition-colors',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
