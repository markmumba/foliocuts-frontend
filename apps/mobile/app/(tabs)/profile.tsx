import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Calendar,
  Award,
  Moon,
  Sun,
} from "lucide-react-native";
import { Card, Text, Heading } from "../../components/ui";
import { useTheme } from "../../context/ThemeContext";

export default function ProfileTab() {
  const router = useRouter();
  const { isDark, themeMode, setThemeMode } = useTheme();

  const user = {
    name: "James Ochieng",
    email: "james.ochieng@folio.co.ke",
    role: "Senior Barber",
    shop: "FolioCuts Westlands",
    joinedDate: "Member since Jan 2024",
    rating: 4.8,
    totalServices: 1250,
    yearsExperience: 5,
  };

  const handleLogout = () => {
    router.replace("/login");
  };

  const cycleTheme = () => {
    const modes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case "light": return "Light";
      case "dark": return "Dark";
      case "system": return "System";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="items-center pt-6 pb-8">
          <View className="relative mb-4">
            <View className="w-24 h-24 rounded-full bg-card border-[3px] border-secondary items-center justify-center">
              <User size={48} color="#f5b700" />
            </View>
            <View className="absolute bottom-0 right-0 flex-row items-center gap-0.5 bg-yellow-500 px-2 py-1 rounded-full">
              <Star size={12} color="#ffffff" fill="#ffffff" />
              <Text className="text-xs font-bold text-white">{user.rating}</Text>
            </View>
          </View>
          <Heading level={2}>{user.name}</Heading>
          <Text className="text-accent font-medium mt-1">{user.role}</Text>
          <Text variant="caption" className="mt-1">{user.shop}</Text>
        </View>

        {/* Quick Stats */}
        <Card className="mx-6 flex-row mb-6">
          <View className="flex-1 items-center">
            <Award size={20} color="#2eb67d" />
            <Text className="text-lg font-bold mt-2">{user.yearsExperience} yrs</Text>
            <Text variant="caption">Experience</Text>
          </View>
          <View className="w-px bg-border" />
          <View className="flex-1 items-center">
            <Calendar size={20} color="#f5b700" />
            <Text className="text-lg font-bold mt-2">{user.totalServices.toLocaleString()}</Text>
            <Text variant="caption">Services</Text>
          </View>
          <View className="w-px bg-border" />
          <View className="flex-1 items-center">
            <Star size={20} color="#f59e0b" />
            <Text className="text-lg font-bold mt-2">{user.rating}</Text>
            <Text variant="caption">Rating</Text>
          </View>
        </Card>

        {/* Account Menu */}
        <View className="px-6 mb-6">
          <Text variant="caption" className="font-semibold uppercase tracking-wide mb-2">
            Account
          </Text>
          <MenuItem icon={User} label="Edit Profile" onPress={() => {}} />
          <MenuItem icon={Bell} label="Notifications" onPress={() => {}} badge="3" />
          <MenuItem icon={Shield} label="Privacy & Security" onPress={() => {}} />
        </View>

        {/* Appearance Menu */}
        <View className="px-6 mb-6">
          <Text variant="caption" className="font-semibold uppercase tracking-wide mb-2">
            Appearance
          </Text>
          <MenuItem
            icon={isDark ? Moon : Sun}
            label="Theme"
            onPress={cycleTheme}
            rightText={getThemeLabel()}
          />
        </View>

        {/* Support Menu */}
        <View className="px-6 mb-6">
          <Text variant="caption" className="font-semibold uppercase tracking-wide mb-2">
            Support
          </Text>
          <MenuItem icon={HelpCircle} label="Help Center" onPress={() => {}} />
          <MenuItem icon={Settings} label="Settings" onPress={() => {}} />
        </View>

        {/* Logout */}
        <View className="px-6 mb-6">
          <Pressable
            className="flex-row items-center justify-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg p-4"
            onPress={handleLogout}
          >
            <LogOut size={20} color="#ef4444" />
            <Text className="font-semibold text-destructive">Sign Out</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View className="items-center pb-8">
          <Text variant="caption">{user.joinedDate}</Text>
          <Text variant="caption" className="opacity-60 mt-1">Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onPress,
  badge,
  rightText,
}: {
  icon: typeof User;
  label: string;
  onPress: () => void;
  badge?: string;
  rightText?: string;
}) {
  return (
    <Pressable
      className="flex-row items-center justify-between bg-card border border-border rounded-lg p-4 mb-2"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <Icon size={20} color="#9ca3af" />
        <Text className="font-medium">{label}</Text>
      </View>
      <View className="flex-row items-center gap-2">
        {badge && (
          <View className="bg-accent px-2 py-0.5 rounded-full">
            <Text className="text-xs font-bold text-white">{badge}</Text>
          </View>
        )}
        {rightText && <Text variant="caption">{rightText}</Text>}
        <ChevronRight size={20} color="#9ca3af" className="opacity-50" />
      </View>
    </Pressable>
  );
}
