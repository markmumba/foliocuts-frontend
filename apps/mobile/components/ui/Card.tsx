import { View, type ViewProps } from "react-native";
import { cn } from "../../utils/cn";

export interface CardProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "bg-card border border-border rounded-lg p-4",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <View className={cn("mb-3", className)} {...props}>
      {children}
    </View>
  );
}

function CardContent({ className, children, ...props }: CardProps) {
  return (
    <View className={cn("", className)} {...props}>
      {children}
    </View>
  );
}

function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <View className={cn("mt-3 pt-3 border-t border-border", className)} {...props}>
      {children}
    </View>
  );
}

export { Card, CardHeader, CardContent, CardFooter };

