import { View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock, User, Scissors } from "lucide-react-native";
import { Card, Text, Heading, Badge, Button } from "../../components/ui";

export default function AppointmentsTab() {
  const appointments = [
    { id: 1, customer: "John Kamau", service: "Haircut + Beard", time: "2:30 PM", duration: "45 min", status: "upcoming" },
    { id: 2, customer: "Peter Njoroge", service: "Fade Cut", time: "3:15 PM", duration: "30 min", status: "upcoming" },
    { id: 3, customer: "David Mwangi", service: "Full Grooming", time: "4:00 PM", duration: "60 min", status: "upcoming" },
    { id: 4, customer: "Michael Otieno", service: "Haircut", time: "11:00 AM", duration: "30 min", status: "completed" },
    { id: 5, customer: "James Wanjiku", service: "Beard Trim", time: "10:00 AM", duration: "20 min", status: "completed" },
  ];

  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming");
  const completedAppointments = appointments.filter((a) => a.status === "completed");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-6 pt-4 pb-6">
        <Heading level={2}>Today's Bookings</Heading>
        <Text variant="caption" className="mt-1">Monday, Jan 13</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Upcoming Section */}
        <View className="px-6 mb-6">
          <Text variant="caption" className="font-semibold mb-4">
            Upcoming ({upcomingAppointments.length})
          </Text>
          {upcomingAppointments.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} />
          ))}
        </View>

        {/* Completed Section */}
        <View className="px-6 pb-8">
          <Text variant="caption" className="font-semibold mb-4">
            Completed ({completedAppointments.length})
          </Text>
          {completedAppointments.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} isCompleted />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AppointmentCard({
  appointment,
  isCompleted = false,
}: {
  appointment: {
    id: number;
    customer: string;
    service: string;
    time: string;
    duration: string;
  };
  isCompleted?: boolean;
}) {
  return (
    <Card
      className={`flex-row items-center mb-2 border-l-[3px] ${
        isCompleted ? "border-l-muted-foreground opacity-70" : "border-l-accent"
      }`}
    >
      {/* Time */}
      <View className="items-center pr-3 border-r border-border">
        <View className="flex-row items-center gap-1">
          <Clock size={14} color={isCompleted ? "#9ca3af" : "#2eb67d"} />
          <Text
            className={`text-sm font-semibold ${
              isCompleted ? "text-muted-foreground" : "text-accent"
            }`}
          >
            {appointment.time}
          </Text>
        </View>
        <Text variant="caption" className="mt-0.5">{appointment.duration}</Text>
      </View>

      {/* Details */}
      <View className="flex-1 px-3">
        <View className="flex-row items-center gap-1.5">
          <User size={14} color="#9ca3af" />
          <Text className="font-semibold">{appointment.customer}</Text>
        </View>
        <View className="flex-row items-center gap-1.5 mt-1">
          <Scissors size={14} color="#9ca3af" />
          <Text variant="caption">{appointment.service}</Text>
        </View>
      </View>

      {/* Action */}
      {!isCompleted ? (
        <Button size="sm">Start</Button>
      ) : (
        <Badge variant="default" className="bg-muted">
          Done
        </Badge>
      )}
    </Card>
  );
}
