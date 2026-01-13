import { View, Text } from "react-native";
import { cn } from "../../utils/cn";

export interface DividerProps {
  text?: string;
  className?: string;
}

function Divider({ text, className }: DividerProps) {
  if (text) {
    return (
      <View className={cn("flex-row items-center my-4", className)}>
        <View className="flex-1 h-px bg-border" />
        <Text className="px-4 text-xs text-muted-foreground uppercase">
          {text}
        </Text>
        <View className="flex-1 h-px bg-border" />
      </View>
    );
  }

  return <View className={cn("h-px bg-border my-4", className)} />;
}

export { Divider };

