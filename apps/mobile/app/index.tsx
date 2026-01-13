import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { brandColors, fontSize, fontWeight } from '@digital-barbershop/shared-theme';
import { Scissors } from 'lucide-react-native';

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
      // TODO: Check auth status and navigate accordingly
      // If authenticated, go to (tabs), else go to login
      router.replace('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Scissors size={48} color={brandColors.secondary} strokeWidth={1.5} />
        </View>
        
        {/* Brand Name */}
        <Text style={styles.brandName}>FolioCuts</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>Employee Portal</Text>
      </Animated.View>

      {/* Subtle footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Digital Barbershop Platform</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brandColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 88,
    height: 88,
    backgroundColor: 'rgba(245, 183, 0, 0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 183, 0, 0.3)',
  },
  brandName: {
    fontSize: 36,
    fontWeight: fontWeight.bold,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: fontSize.base,
    color: brandColors.secondary,
    marginTop: 8,
    fontWeight: fontWeight.medium,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.3)',
  },
});
