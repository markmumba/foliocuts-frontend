import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  brandColors, 
  spacing, 
  fontSize, 
  fontWeight, 
  borderRadius 
} from '@digital-barbershop/shared-theme';
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
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileTab() {
  const router = useRouter();
  const { theme, isDark, themeMode, setThemeMode } = useTheme();

  // Mock user data
  const user = {
    name: 'James Ochieng',
    email: 'james.ochieng@folio.co.ke',
    role: 'Senior Barber',
    shop: 'FolioCuts Westlands',
    joinedDate: 'Member since Jan 2024',
    rating: 4.8,
    totalServices: 1250,
    yearsExperience: 5,
  };

  const handleLogout = () => {
    // TODO: Implement actual logout
    router.replace('/login');
  };

  const cycleTheme = () => {
    const modes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
    }
  };

  const styles = createStyles(theme, isDark);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={48} color={brandColors.secondary} />
            </View>
            <View style={styles.ratingBadge}>
              <Star size={12} color="#ffffff" fill="#ffffff" />
              <Text style={styles.ratingText}>{user.rating}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>{user.role}</Text>
          <Text style={styles.userShop}>{user.shop}</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatItem}>
            <Award size={20} color={brandColors.accent} />
            <Text style={styles.quickStatValue}>{user.yearsExperience} yrs</Text>
            <Text style={styles.quickStatLabel}>Experience</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.quickStatItem}>
            <Calendar size={20} color={brandColors.secondary} />
            <Text style={styles.quickStatValue}>{user.totalServices.toLocaleString()}</Text>
            <Text style={styles.quickStatLabel}>Services</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.quickStatItem}>
            <Star size={20} color="#f59e0b" />
            <Text style={styles.quickStatValue}>{user.rating}</Text>
            <Text style={styles.quickStatLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Account</Text>
          <MenuItem 
            theme={theme}
            icon={<User size={20} color={theme.mutedForeground} />}
            label="Edit Profile"
            onPress={() => {}}
          />
          <MenuItem 
            theme={theme}
            icon={<Bell size={20} color={theme.mutedForeground} />}
            label="Notifications"
            onPress={() => {}}
            badge="3"
          />
          <MenuItem 
            theme={theme}
            icon={<Shield size={20} color={theme.mutedForeground} />}
            label="Privacy & Security"
            onPress={() => {}}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Appearance</Text>
          <MenuItem 
            theme={theme}
            icon={isDark ? <Moon size={20} color={theme.mutedForeground} /> : <Sun size={20} color={theme.mutedForeground} />}
            label="Theme"
            onPress={cycleTheme}
            rightText={getThemeLabel()}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          <MenuItem 
            theme={theme}
            icon={<HelpCircle size={20} color={theme.mutedForeground} />}
            label="Help Center"
            onPress={() => {}}
          />
          <MenuItem 
            theme={theme}
            icon={<Settings size={20} color={theme.mutedForeground} />}
            label="Settings"
            onPress={() => {}}
          />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{user.joinedDate}</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ 
  theme,
  icon, 
  label, 
  onPress, 
  badge,
  rightText,
}: { 
  theme: typeof import('@digital-barbershop/shared-theme').lightTheme;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  badge?: string;
  rightText?: string;
}) {
  return (
    <Pressable style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    }} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        {icon}
        <Text style={{ fontSize: fontSize.base, color: theme.foreground, fontWeight: fontWeight.medium }}>{label}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
        {badge && (
          <View style={{
            backgroundColor: brandColors.accent,
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 999,
          }}>
            <Text style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, color: '#ffffff' }}>{badge}</Text>
          </View>
        )}
        {rightText && (
          <Text style={{ fontSize: fontSize.sm, color: theme.mutedForeground }}>{rightText}</Text>
        )}
        <ChevronRight size={20} color={theme.mutedForeground} style={{ opacity: 0.5 }} />
      </View>
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
  profileHeader: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: brandColors.secondary,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#ffffff',
  },
  userName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: theme.foreground,
  },
  userRole: {
    fontSize: fontSize.base,
    color: brandColors.accent,
    marginTop: 4,
    fontWeight: fontWeight.medium,
  },
  userShop: {
    fontSize: fontSize.sm,
    color: theme.mutedForeground,
    marginTop: 4,
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: theme.border,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickStatValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: theme.foreground,
    marginTop: spacing.sm,
  },
  quickStatLabel: {
    fontSize: fontSize.xs,
    color: theme.mutedForeground,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.border,
  },
  menuSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  menuSectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: theme.mutedForeground,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: theme.mutedForeground,
  },
  versionText: {
    fontSize: fontSize.xs,
    color: theme.mutedForeground,
    marginTop: 4,
    opacity: 0.6,
  },
});
