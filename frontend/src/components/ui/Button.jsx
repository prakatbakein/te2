import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: cn(
        // Base styles
        "bg-gray-900 text-white shadow-lg",
        // Hover effects
        "hover:bg-gray-800 hover:shadow-xl",
        // Dark mode
        "dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
        // Active state
        "active:scale-95"
      ),
      secondary: cn(
        "bg-gray-100 text-gray-900 border border-gray-200 shadow-sm",
        "hover:bg-gray-200 hover:shadow-md",
        "dark:bg-gray-800 dark:text-white dark:border-gray-700",
        "dark:hover:bg-gray-700"
      ),
      outline: cn(
        "border border-gray-300 bg-white/50 backdrop-blur-sm text-gray-700 shadow-sm",
        "hover:bg-gray-50 hover:border-gray-400 hover:shadow-md",
        "dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-300",
        "dark:hover:bg-gray-800/50 dark:hover:border-gray-500"
      ),
      ghost: cn(
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        "dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      ),
      link: "text-gray-600 underline-offset-4 hover:underline dark:text-gray-400",
      destructive: cn(
        "bg-red-600 text-white shadow-lg",
        "hover:bg-red-700 hover:shadow-xl"
      ),
    };

    const sizes = {
      default: "h-12 px-6 py-3",
      sm: "h-9 rounded-md px-4 text-sm",
      lg: "h-14 rounded-xl px-8 text-lg",
      icon: "h-12 w-12",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
          "dark:focus:ring-offset-gray-900",
          // Disabled state
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          // Variants and sizes
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
