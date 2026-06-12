"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface PremiumButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  /** Optional leading/trailing icons. */
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-glow hover:shadow-glow focus-visible:ring-accent",
  secondary:
    "glass text-foreground hover:bg-white/80 dark:hover:bg-white/[0.08] focus-visible:ring-ring",
  ghost:
    "bg-transparent text-foreground hover:bg-muted focus-visible:ring-ring",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-6 text-sm gap-2",
  lg: "h-14 px-8 text-base gap-2.5",
};

/**
 * The single button primitive for the whole storefront. Framer Motion handles
 * the press/hover micro-interactions; visual variants are driven by props so
 * call sites stay declarative (`<PremiumButton variant="primary" size="lg" />`).
 */
export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    { className, variant = "primary", size = "md", leftIcon, rightIcon, children, ...props },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "inline-flex select-none items-center justify-center rounded-full font-medium",
          "outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </motion.button>
    );
  },
);

PremiumButton.displayName = "PremiumButton";
