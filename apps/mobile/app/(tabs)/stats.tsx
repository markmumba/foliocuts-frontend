import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  brandColors, 
  spacing, 
  fontSize, 
  fontWeight, 
  borderRadius 
} from '@digital-barbershop/shared-theme';
import { TrendingUp, TrendingDown, Users, Scissors, DollarSign, Star } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function StatsTab() {
  const { theme, isDark } = useTheme();
  
  // Mock data - will be replaced with actual API data
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
    { name: 'Fade Cut', count: 18, revenue: 9000 },
    { name: 'Haircut + Beard', count: 15, revenue: 12000 },
    { name: 'Full Grooming', count: 8, revenue: 8000 },
    { name: 'Beard Trim', count: 6, revenue: 1800 },
  ];

  const styles = createStyles(theme, isDark);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Performance</Text>
        <Text style={styles.headerSubtitle}>This Week</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Main Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            theme={theme}
            icon={<DollarSign size={22} color={brandColors.secondary} />}
            label="Total Earnings"
            value={`KES ${weeklyStats.earnings.toLocaleString()}`}
            change={weeklyStats.earningsChange}
            color={brandColors.secondary}
          />
          <StatCard
            theme={theme}
            icon={<Users size={22} color={brandColors.accent} />}
            label="Clients Served"
            value={weeklyStats.clients.toString()}
            change={weeklyStats.clientsChange}
            color={brandColors.accent}
          />
          <StatCard
            theme={theme}
            icon={<Scissors size={22} color="#8b5cf6" />}
            label="Services Done"
            value={weeklyStats.services.toString()}
            change={weeklyStats.servicesChange}
            color="#8b5cf6"
          />
          <StatCard
            theme={theme}
            icon={<Star size={22} color="#f59e0b" />}
            label="Avg Rating"
            value={weeklyStats.rating.toString()}
            change={weeklyStats.ratingChange}
            color="#f59e0b"
          />
        </View>

        {/* Top Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Services</Text>
          {topServices.map((service, index) => (
            <View key={service.name} style={styles.serviceRow}>
              <View style={styles.serviceRank}>
                <Text style={styles.rankText}>{index + 1}</Text>
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceCount}>{service.count} services</Text>
              </View>
              <Text style={styles.serviceRevenue}>
                KES {service.revenue.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Performance Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: `${brandColors.accent}15` }]}>
              <TrendingUp size={20} color={brandColors.accent} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Great Week!</Text>
              <Text style={styles.insightText}>
                Your earnings are up 12% compared to last week. Keep up the excellent work!
              </Text>
            </View>
          </View>
          <View style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: `${brandColors.secondary}15` }]}>
              <Star size={20} color={brandColors.secondary} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Top Performer</Text>
              <Text style={styles.insightText}>
                You're in the top 10% of stylists this week based on client satisfaction.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ 
  theme,
  icon, 
  label, 
  value, 
  change, 
  color 
}: { 
  theme: typeof import('@digital-barbershop/shared-theme').lightTheme;
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  color: string;
}) {
  const isPositive = change >= 0;
  
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
      <View style={{
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: `${color}15`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
      }}>
        {icon}
      </View>
      <Text style={{ fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: theme.foreground }}>{value}</Text>
      <Text style={{ fontSize: fontSize.sm, color: theme.mutedForeground, marginTop: 2 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm }}>
        {isPositive ? (
          <TrendingUp size={12} color={brandColors.accent} />
        ) : (
          <TrendingDown size={12} color="#ef4444" />
        )}
        <Text style={{ fontSize: fontSize.xs, fontWeight: fontWeight.medium, color: isPositive ? brandColors.accent : '#ef4444' }}>
          {isPositive ? '+' : ''}{change}%
        </Text>
      </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: theme.foreground,
    marginBottom: spacing.md,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: theme.border,
  },
  serviceRank: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: `${brandColors.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: brandColors.accent,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  serviceName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: theme.foreground,
  },
  serviceCount: {
    fontSize: fontSize.sm,
    color: theme.mutedForeground,
    marginTop: 2,
  },
  serviceRevenue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: brandColors.secondary,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: theme.border,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  insightTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: theme.foreground,
  },
  insightText: {
    fontSize: fontSize.sm,
    color: theme.mutedForeground,
    marginTop: 4,
    lineHeight: 20,
  },
});
