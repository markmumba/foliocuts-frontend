import { View, Text } from "react-native";
import { cn } from "../../utils/cn";

export interface BadgeProps {
  variant?: "default" | "secondary" | "success" | "warning" | "destructive";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-accent/15",
  secondary: "bg-secondary/15",
  success: "bg-green-500/15",
  warning: "bg-yellow-500/15",
  destructive: "bg-destructive/15",
};

const textVariantStyles = {
  default: "text-accent",
  secondary: "text-secondary",
  success: "text-green-600",
  warning: "text-yellow-600",
  destructive: "text-destructive",
};

function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <View
      className={cn(
        "px-2.5 py-1 rounded-full self-start",
        variantStyles[variant],
        className
      )}
    >
      <Text
        className={cn(
          "text-xs font-semibold",
          textVariantStyles[variant]
        )}
      >
        {children}
      </Text>
    </View>
  );
}

export { Badge };

