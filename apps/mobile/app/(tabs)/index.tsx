import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  brandColors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius
} from '@digital-barbershop/shared-theme';
import { Scissors, TrendingUp, Users, DollarSign, Clock } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function HomeTab() {
  const { theme, isDark } = useTheme();

  // Mock data - will be replaced with actual API data
  const todayStats = {
    appointments: 8,
    completed: 5,
    earnings: 4500,
    avgTime: '32 min',
  };

  const upcomingAppointments = [
    { id: 1, customer: 'John Kamau', service: 'Haircut + Beard', time: '2:30 PM' },
    { id: 2, customer: 'Peter Njoroge', service: 'Fade Cut', time: '3:15 PM' },
    { id: 3, customer: 'David Mwangi', service: 'Full Grooming', time: '4:00 PM' },
  ];

  const styles = createStyles(theme, isDark);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.name}>James Ochieng</Text>
          </View>
          <View style={styles.logoContainer}>
            <Scissors size={24} color={brandColors.secondary} />
          </View>
        </View>

        {/* Today's Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              theme={theme}
              isDark={isDark}
              icon={<Users size={20} color={brandColors.accent} />}
              label="Appointments"
              value={todayStats.appointments.toString()}
              subValue={`${todayStats.completed} completed`}
            />
            <StatCard
              theme={theme}
              isDark={isDark}
              icon={<DollarSign size={20} color={brandColors.secondary} />}
              label="Earnings"
              value={`KES ${todayStats.earnings.toLocaleString()}`}
              subValue="Commission"
            />
            <StatCard
              theme={theme}
              isDark={isDark}
              icon={<Clock size={20} color="#8b5cf6" />}
              label="Avg Time"
              value={todayStats.avgTime}
              subValue="Per service"
            />
            <StatCard
              theme={theme}
              isDark={isDark}
              icon={<TrendingUp size={20} color="#10b981" />}
              label="Performance"
              value="92%"
              subValue="This week"
            />
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.upcomingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <Pressable>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>

          {upcomingAppointments.map((apt) => (
            <View key={apt.id} style={styles.appointmentCard}>
              <View style={styles.appointmentTime}>
                <Text style={styles.timeText}>{apt.time}</Text>
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.customerName}>{apt.customer}</Text>
                <Text style={styles.serviceName}>{apt.service}</Text>
              </View>
              <Pressable style={styles.startButton}>
                <Text style={styles.startButtonText}>Start</Text>
              </Pressable>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <ActionButton theme={theme} isDark={isDark} label="Walk-in Client" emoji="🚶" />
            <ActionButton theme={theme} isDark={isDark} label="View History" emoji="📋" />
            <ActionButton theme={theme} isDark={isDark} label="My Schedule" emoji="📅" />
            <ActionButton theme={theme} isDark={isDark} label="Support" emoji="💬" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ theme, isDark, icon, label, value, subValue }: {
  theme: typeof import('@digital-barbershop/shared-theme').lightTheme;
  isDark: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue: string;
}) {
  return (
    <View style={{
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    }}>
      <View style={{ marginBottom: spacing.sm }}>{icon}</View>
      <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: theme.foreground }}>{value}</Text>
      <Text style={{ fontSize: fontSize.sm, color: theme.mutedForeground, marginTop: 2 }}>{label}</Text>
      <Text style={{ fontSize: fontSize.xs, color: theme.mutedForeground, marginTop: 2, opacity: 0.7 }}>{subValue}</Text>
    </View>
  );
}

function ActionButton({ theme, isDark, label, emoji }: {
  theme: typeof import('@digital-barbershop/shared-theme').lightTheme;
  isDark: boolean;
  label: string;
  emoji: string
}) {
  return (
    <Pressable style={{
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    }}>
      <Text style={{ fontSize: 24, marginBottom: spacing.sm }}>{emoji}</Text>
      <Text style={{ fontSize: fontSize.sm, color: theme.foreground, fontWeight: fontWeight.medium }}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (theme: typeof import('@digital-barbershop/shared-theme').lightTheme, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.base,
    color: theme.mutedForeground,
  },
  name: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: theme.foreground,
    marginTop: 4,
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: isDark ? theme.card : '#fff8e6',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: brandColors.secondary,
  },
  statsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: theme.foreground,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  upcomingSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: brandColors.accent,
    fontWeight: fontWeight.medium,
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: theme.border,
  },
  appointmentTime: {
    backgroundColor: `${brandColors.accent}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  timeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: brandColors.accent,
  },
  appointmentDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  customerName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: theme.foreground,
  },
  serviceName: {
    fontSize: fontSize.sm,
    color: theme.mutedForeground,
    marginTop: 2,
  },
  startButton: {
    backgroundColor: brandColors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  startButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: '#ffffff',
  },
  actionsSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
