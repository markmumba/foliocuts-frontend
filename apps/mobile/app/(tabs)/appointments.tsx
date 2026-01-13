import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  brandColors, 
  spacing, 
  fontSize, 
  fontWeight, 
  borderRadius 
} from '@digital-barbershop/shared-theme';
import { Clock, User, Scissors } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function AppointmentsTab() {
  const { theme, isDark } = useTheme();
  
  // Mock data
  const appointments = [
    { id: 1, customer: 'John Kamau', service: 'Haircut + Beard', time: '2:30 PM', duration: '45 min', status: 'upcoming' },
    { id: 2, customer: 'Peter Njoroge', service: 'Fade Cut', time: '3:15 PM', duration: '30 min', status: 'upcoming' },
    { id: 3, customer: 'David Mwangi', service: 'Full Grooming', time: '4:00 PM', duration: '60 min', status: 'upcoming' },
    { id: 4, customer: 'Michael Otieno', service: 'Haircut', time: '11:00 AM', duration: '30 min', status: 'completed' },
    { id: 5, customer: 'James Wanjiku', service: 'Beard Trim', time: '10:00 AM', duration: '20 min', status: 'completed' },
  ];

  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  const styles = createStyles(theme, isDark);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Bookings</Text>
        <Text style={styles.headerSubtitle}>Monday, Jan 13</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Upcoming Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming ({upcomingAppointments.length})</Text>
          {upcomingAppointments.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} theme={theme} />
          ))}
        </View>

        {/* Completed Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed ({completedAppointments.length})</Text>
          {completedAppointments.map((apt) => (
            <AppointmentCard key={apt.id} appointment={apt} theme={theme} isCompleted />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AppointmentCard({ 
  appointment, 
  theme,
  isCompleted = false 
}: { 
  appointment: { id: number; customer: string; service: string; time: string; duration: string; status: string };
  theme: typeof import('@digital-barbershop/shared-theme').lightTheme;
  isCompleted?: boolean;
}) {
  return (
    <View style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.card,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: isCompleted ? theme.mutedForeground : brandColors.accent,
        borderWidth: 1,
        borderColor: theme.border,
        opacity: isCompleted ? 0.7 : 1,
      },
    ]}>
      <View style={{ alignItems: 'center', paddingRight: spacing.md, borderRightWidth: 1, borderRightColor: theme.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Clock size={14} color={isCompleted ? theme.mutedForeground : brandColors.accent} />
          <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: isCompleted ? theme.mutedForeground : brandColors.accent }}>
            {appointment.time}
          </Text>
        </View>
        <Text style={{ fontSize: fontSize.xs, color: theme.mutedForeground, marginTop: 2 }}>
          {appointment.duration}
        </Text>
      </View>
      
      <View style={{ flex: 1, paddingHorizontal: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <User size={14} color={theme.mutedForeground} />
          <Text style={{ fontSize: fontSize.base, fontWeight: fontWeight.semibold, color: theme.foreground }}>
            {appointment.customer}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <Scissors size={14} color={theme.mutedForeground} style={{ opacity: 0.6 }} />
          <Text style={{ fontSize: fontSize.sm, color: theme.mutedForeground }}>
            {appointment.service}
          </Text>
        </View>
      </View>

      {!isCompleted && (
        <Pressable style={{
          backgroundColor: brandColors.accent,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: borderRadius.md,
        }}>
          <Text style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, color: '#ffffff' }}>Start</Text>
        </Pressable>
      )}
      
      {isCompleted && (
        <View style={{
          backgroundColor: `${theme.mutedForeground}20`,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderRadius: borderRadius.md,
        }}>
          <Text style={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: theme.mutedForeground }}>Done</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: typeof import('@digital-barbershop/shared-theme').lightTheme, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: theme.foreground,
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    color: theme.mutedForeground,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: theme.mutedForeground,
    marginBottom: spacing.md,
  },
});
