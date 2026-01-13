import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { View, Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Scissors } from "lucide-react-native";
import { Text, Heading } from "../components/ui";

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after splash
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <StatusBar style="light" />

      <Animated.View
        className="items-center"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {/* Icon */}
        <View className="w-22 h-22 bg-secondary/10 border border-secondary/30 rounded-3xl items-center justify-center mb-5">
          <Scissors size={48} color="#f5b700" strokeWidth={1.5} />
        </View>

        {/* Brand Name */}
        <Text className="text-4xl font-bold text-white tracking-wide">
          FolioCuts
        </Text>

        {/* Tagline */}
        <Text className="text-base text-secondary font-medium mt-2 uppercase tracking-widest">
          Employee Portal
        </Text>
      </Animated.View>

      {/* Footer */}
      <View className="absolute bottom-12">
        <Text className="text-sm text-white/30">Digital Barbershop Platform</Text>
      </View>
    </View>
  );
}
