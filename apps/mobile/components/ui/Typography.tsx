import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cn } from "../../utils/cn";

export interface TextProps extends RNTextProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "label";
  className?: string;
  children: React.ReactNode;
}

const variantStyles = {
  h1: "text-3xl font-bold text-foreground",
  h2: "text-2xl font-bold text-foreground",
  h3: "text-xl font-semibold text-foreground",
  h4: "text-lg font-semibold text-foreground",
  body: "text-base text-foreground",
  caption: "text-sm text-muted-foreground",
  label: "text-sm font-medium text-foreground",
};

function Text({ variant = "body", className, children, ...props }: TextProps) {
  return (
    <RNText className={cn(variantStyles[variant], className)} {...props}>
      {children}
    </RNText>
  );
}

function Heading({
  level = 1,
  className,
  children,
  ...props
}: { level?: 1 | 2 | 3 | 4 } & Omit<TextProps, "variant">) {
  const variant = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return (
    <Text variant={variant} className={className} {...props}>
      {children}
    </Text>
  );
}

export { Text, Heading };

