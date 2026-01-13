import { View, ScrollView, type ViewProps, type ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "../../utils/cn";

export interface ContainerProps extends ViewProps {
  className?: string;
  children: React.ReactNode;
}

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * Basic container with horizontal padding
 */
function Container({ className, children, ...props }: ContainerProps) {
  return (
    <View className={cn("px-6", className)} {...props}>
      {children}
    </View>
  );
}

/**
 * Full screen container with SafeAreaView
 */
function ScreenContainer({
  children,
  scrollable = true,
  className,
  contentClassName,
}: ScreenContainerProps) {
  if (scrollable) {
    return (
      <SafeAreaView className={cn("flex-1 bg-background", className)} edges={["top"]}>
        <ScrollView
          className="flex-1"
          contentContainerClassName={cn("pb-8", contentClassName)}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={cn("flex-1 bg-background", className)} edges={["top"]}>
      <View className={cn("flex-1", contentClassName)}>{children}</View>
    </SafeAreaView>
  );
}

export { Container, ScreenContainer };

