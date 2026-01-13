import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingUp, TrendingDown, Users, Scissors, DollarSign, Star } from "lucide-react-native";
import { Card, Text, Heading, Badge } from "../../components/ui";

export default function StatsTab() {
  const weeklyStats = {
    earnings: 32500,
    earningsChange: 12,
    clients: 45,
    clientsChange: -3,
    services: 52,
    servicesChange: 8,
    rating: 4.8,
    ratingChange: 0.2,
  };

  const topServices = [
    { name: "Fade Cut", count: 18, revenue: 9000 },
    { name: "Haircut + Beard", count: 15, revenue: 12000 },
    { name: "Full Grooming", count: 8, revenue: 8000 },
    { name: "Beard Trim", count: 6, revenue: 1800 },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Heading level={2}>Performance</Heading>
        <Text variant="caption" className="mt-1">This Week</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Grid */}
        <View className="flex-row flex-wrap gap-2 px-6 mb-6">
          <StatCard
            icon={<DollarSign size={22} color="#f5b700" />}
            label="Total Earnings"
            value={`KES ${weeklyStats.earnings.toLocaleString()}`}
            change={weeklyStats.earningsChange}
            color="#f5b700"
          />
          <StatCard
            icon={<Users size={22} color="#2eb67d" />}
            label="Clients Served"
            value={weeklyStats.clients.toString()}
            change={weeklyStats.clientsChange}
            color="#2eb67d"
          />
          <StatCard
            icon={<Scissors size={22} color="#8b5cf6" />}
            label="Services Done"
            value={weeklyStats.services.toString()}
            change={weeklyStats.servicesChange}
            color="#8b5cf6"
          />
          <StatCard
            icon={<Star size={22} color="#f59e0b" />}
            label="Avg Rating"
            value={weeklyStats.rating.toString()}
            change={weeklyStats.ratingChange}
            color="#f59e0b"
          />
        </View>

        {/* Top Services */}
        <View className="px-6 mb-6">
          <Heading level={4} className="mb-4">Top Services</Heading>
          {topServices.map((service, index) => (
            <Card key={service.name} className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-accent/15 items-center justify-center">
                <Text className="text-sm font-bold text-accent">{index + 1}</Text>
              </View>
              <View className="flex-1 ml-3">
                <Text className="font-medium">{service.name}</Text>
                <Text variant="caption">{service.count} services</Text>
              </View>
              <Text className="font-semibold text-secondary">
                KES {service.revenue.toLocaleString()}
              </Text>
            </Card>
          ))}
        </View>

        {/* Insights */}
        <View className="px-6 pb-8">
          <Heading level={4} className="mb-4">Insights</Heading>
          <Card className="flex-row mb-2">
            <View className="w-10 h-10 rounded-lg bg-accent/15 items-center justify-center">
              <TrendingUp size={20} color="#2eb67d" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-semibold">Great Week!</Text>
              <Text variant="caption" className="mt-1">
                Your earnings are up 12% compared to last week. Keep up the excellent work!
              </Text>
            </View>
          </Card>
          <Card className="flex-row">
            <View className="w-10 h-10 rounded-lg bg-secondary/15 items-center justify-center">
              <Star size={20} color="#f5b700" />
            </View>
            <View className="flex-1 ml-3">
              <Text className="font-semibold">Top Performer</Text>
              <Text variant="caption" className="mt-1">
                You're in the top 10% of stylists this week based on client satisfaction.
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  color: string;
}) {
  const isPositive = change >= 0;

  return (
    <Card className="flex-1 min-w-[45%]">
      <View
        className="w-10 h-10 rounded-lg items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </View>
      <Text className="text-xl font-bold">{value}</Text>
      <Text variant="caption">{label}</Text>
      <View className="flex-row items-center gap-1 mt-2">
        {isPositive ? (
          <TrendingUp size={12} color="#2eb67d" />
        ) : (
          <TrendingDown size={12} color="#ef4444" />
        )}
        <Text
          className={`text-xs font-medium ${
            isPositive ? "text-accent" : "text-destructive"
          }`}
        >
          {isPositive ? "+" : ""}
          {change}%
        </Text>
      </View>
    </Card>
  );
}
