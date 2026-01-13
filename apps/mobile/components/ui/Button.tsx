import { forwardRef } from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
} from "react-native";
import { cn } from "../../utils/cn";

export interface ButtonProps extends PressableProps {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  textClassName?: string;
}

const Button = forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  (
    {
      variant = "default",
      size = "md",
      isLoading = false,
      children,
      className,
      textClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const baseStyles = "flex-row items-center justify-center rounded-lg";

    const variantStyles = {
      default: "bg-accent active:opacity-80",
      secondary: "bg-secondary active:opacity-80",
      outline: "border border-border bg-transparent active:bg-muted",
      ghost: "bg-transparent active:bg-muted",
      destructive: "bg-destructive active:opacity-80",
    };

    const sizeStyles = {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-6 py-4",
    };

    const textVariantStyles = {
      default: "text-white",
      secondary: "text-primary",
      outline: "text-foreground",
      ghost: "text-foreground",
      destructive: "text-white",
    };

    const textSizeStyles = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    return (
      <Pressable
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "opacity-50",
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === "secondary" ? "#1c1e26" : "#ffffff"}
            size="small"
          />
        ) : typeof children === "string" ? (
          <Text
            className={cn(
              "font-semibold",
              textVariantStyles[variant],
              textSizeStyles[size],
              textClassName
            )}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button };

