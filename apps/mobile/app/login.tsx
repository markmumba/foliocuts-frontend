import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  brandColors, 
  spacing, 
  fontSize, 
  fontWeight, 
  borderRadius 
} from '@digital-barbershop/shared-theme';
import { Scissors, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function LoginScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Implement actual login with shared API
      // const response = await authService.login({ email, password });
      
      // Simulate login for now
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // On success, navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme, isDark);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Scissors size={32} color={brandColors.secondary} strokeWidth={2} />
          </View>
          <Text style={styles.brandName}>FolioCuts</Text>
          <Text style={styles.tagline}>Employee Portal</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome Back</Text>
          <Text style={styles.subText}>
            Sign in to your account to continue
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={theme.mutedForeground}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>Password</Text>
              <Pressable>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </Pressable>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor={theme.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <Pressable 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.mutedForeground} />
                ) : (
                  <Eye size={20} color={theme.mutedForeground} />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </Pressable>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>📱  Sign in with Phone</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Having trouble? Contact your shop administrator
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: typeof import('@digital-barbershop/shared-theme').lightTheme, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: isDark ? theme.card : '#fff8e6',
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: brandColors.secondary,
  },
  brandName: {
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.bold,
    color: theme.foreground,
  },
  tagline: {
    fontSize: fontSize.sm,
    color: theme.mutedForeground,
    marginTop: 4,
  },
  welcomeSection: {
    marginBottom: spacing.xl,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    color: theme.foreground,
    marginBottom: spacing.sm,
  },
  subText: {
    fontSize: fontSize.base,
    color: theme.mutedForeground,
  },
  formSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: theme.foreground,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: theme.input,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: fontSize.base,
    color: theme.foreground,
    borderWidth: 1,
    borderColor: theme.border,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  forgotPasswordText: {
    color: brandColors.accent,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  loginButton: {
    backgroundColor: brandColors.secondary,
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: brandColors.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border,
  },
  dividerText: {
    paddingHorizontal: spacing.md,
    fontSize: fontSize.xs,
    color: theme.mutedForeground,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.background,
  },
  secondaryButtonText: {
    color: theme.foreground,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  footer: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: theme.mutedForeground,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
});

