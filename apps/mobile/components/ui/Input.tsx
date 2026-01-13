import { forwardRef, useState } from "react";
import { View, TextInput, Text, Pressable, type TextInputProps } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { cn } from "../../utils/cn";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  isPassword?: boolean;
}

const Input = forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  (
    {
      label,
      error,
      containerClassName,
      labelClassName,
      inputClassName,
      isPassword = false,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const shouldBeSecure = isPassword ? !showPassword : secureTextEntry;

    return (
      <View className={cn("mb-4", containerClassName)}>
        {label && (
          <Text
            className={cn(
              "text-sm font-medium text-foreground mb-2",
              labelClassName
            )}
          >
            {label}
          </Text>
        )}
        <View className="relative">
          <TextInput
            ref={ref}
            className={cn(
              "bg-input border border-border rounded-lg px-4 py-3.5 text-base text-foreground",
              error && "border-destructive",
              isPassword && "pr-12",
              inputClassName
            )}
            placeholderTextColor="#9ca3af"
            secureTextEntry={shouldBeSecure}
            {...props}
          />
          {isPassword && (
            <Pressable
              className="absolute right-4 top-0 bottom-0 justify-center"
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color="#9ca3af" />
              ) : (
                <Eye size={20} color="#9ca3af" />
              )}
            </Pressable>
          )}
        </View>
        {error && (
          <Text className="text-destructive text-sm mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

export { Input };

