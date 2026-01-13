import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Scissors } from "lucide-react-native";
import { Button, Input, Text, Heading, Divider } from "../components/ui";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement actual login with shared API
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow px-6 pt-16 pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mb-8">
          <View className="w-16 h-16 bg-secondary/10 border-2 border-secondary rounded-xl items-center justify-center mb-4">
            <Scissors size={32} color="#f5b700" strokeWidth={2} />
          </View>
          <Heading level={2}>FolioCuts</Heading>
          <Text variant="caption" className="mt-1">
            Employee Portal
          </Text>
        </View>

        {/* Welcome Text */}
        <View className="mb-8">
          <Heading level={1} className="mb-2">
            Welcome Back
          </Heading>
          <Text variant="caption" className="text-base">
            Sign in to your account to continue
          </Text>
        </View>

        {/* Form */}
        <View className="flex-1">
          <Input
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            isPassword
            autoComplete="password"
          />

          <View className="flex-row justify-end mb-4">
            <Text className="text-accent text-sm font-medium">
              Forgot password?
            </Text>
          </View>

          <Button
            variant="secondary"
            size="lg"
            isLoading={isLoading}
            onPress={handleLogin}
            className="w-full"
          >
            Sign In
          </Button>

          <Divider text="Or continue with" />

          <Button variant="outline" size="lg" className="w-full">
            📱  Sign in with Phone
          </Button>
        </View>

        {/* Footer */}
        <View className="items-center pt-8">
          <Text variant="caption" className="text-center">
            Having trouble? Contact your shop administrator
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
