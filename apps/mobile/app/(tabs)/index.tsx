import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Scissors, TrendingUp, Users, DollarSign, Clock } from "lucide-react-native";
import { Card, Text, Heading, Badge, Button } from "../../components/ui";

export default function HomeTab() {
  const todayStats = {
    appointments: 8,
    completed: 5,
    earnings: 4500,
    avgTime: "32 min",
  };

  const upcomingAppointments = [
    { id: 1, customer: "John Kamau", service: "Haircut + Beard", time: "2:30 PM" },
    { id: 2, customer: "Peter Njoroge", service: "Fade Cut", time: "3:15 PM" },
    { id: 3, customer: "David Mwangi", service: "Full Grooming", time: "4:00 PM" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 pt-4 pb-6">
          <View>
            <Text variant="caption" className="text-base">Good afternoon,</Text>
            <Heading level={2} className="mt-1">James Ochieng</Heading>
          </View>
          <View className="w-12 h-12 bg-secondary/10 border border-secondary rounded-lg items-center justify-center">
            <Scissors size={24} color="#f5b700" />
          </View>
        </View>

        {/* Today's Stats */}
        <View className="px-6 mb-6">
          <Heading level={4} className="mb-4">Today's Overview</Heading>
          <View className="flex-row flex-wrap gap-2">
            <StatCard
              icon={<Users size={20} color="#2eb67d" />}
              label="Appointments"
              value={todayStats.appointments.toString()}
              subValue={`${todayStats.completed} completed`}
            />
            <StatCard
              icon={<DollarSign size={20} color="#f5b700" />}
              label="Earnings"
              value={`KES ${todayStats.earnings.toLocaleString()}`}
              subValue="Commission"
            />
            <StatCard
              icon={<Clock size={20} color="#8b5cf6" />}
              label="Avg Time"
              value={todayStats.avgTime}
              subValue="Per service"
            />
            <StatCard
              icon={<TrendingUp size={20} color="#10b981" />}
              label="Performance"
              value="92%"
              subValue="This week"
            />
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Heading level={4}>Upcoming</Heading>
            <Text className="text-accent font-medium">See All</Text>
          </View>

          {upcomingAppointments.map((apt) => (
            <Card key={apt.id} className="flex-row items-center mb-2">
              <Badge variant="default">{apt.time}</Badge>
              <View className="flex-1 ml-3">
                <Text className="font-semibold">{apt.customer}</Text>
                <Text variant="caption">{apt.service}</Text>
              </View>
              <Button size="sm">Start</Button>
            </Card>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="px-6 pb-8">
          <Heading level={4} className="mb-4">Quick Actions</Heading>
          <View className="flex-row flex-wrap gap-2">
            <ActionButton label="Walk-in Client" emoji="🚶" />
            <ActionButton label="View History" emoji="📋" />
            <ActionButton label="My Schedule" emoji="📅" />
            <ActionButton label="Support" emoji="💬" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
}) {
  return (
    <Card className="flex-1 min-w-[45%]">
      <View className="mb-2">{icon}</View>
      <Text className="text-xl font-bold">{value}</Text>
      <Text variant="caption">{label}</Text>
      <Text variant="caption" className="opacity-70">{subValue}</Text>
    </Card>
  );
}

function ActionButton({ label, emoji }: { label: string; emoji: string }) {
  return (
    <Pressable className="flex-1 min-w-[45%] bg-card border border-border rounded-lg p-4 items-center">
      <Text className="text-2xl mb-2">{emoji}</Text>
      <Text variant="caption" className="text-foreground font-medium">{label}</Text>
    </Pressable>
  );
}
