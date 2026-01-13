/**
 * Digital Barbershop - Shared Color Theme
 * Modern Afro-Urban Color Palette
 * 
 * Used across web and mobile apps for consistent branding
 */

// Core Brand Colors
export const brandColors = {
  // Primary - Deep Navy (professional, tech-forward)
  primary: '#1c1e26',
  primaryLight: '#2a2d38',
  
  // Secondary - Warm Gold (premium service, crown-like)
  secondary: '#f5b700',
  secondaryLight: '#f7c52d',
  
  // Accent - Emerald Green (fresh, growth, M-Pesa familiar)
  accent: '#2eb67d',
  accentLight: '#4ecdc4',
  
  // Error/Destructive
  error: '#e63946',
  destructive: '#ef4444',
} as const;

// Light Theme
export const lightTheme = {
  // Background & Surface
  background: '#ffffff',
  foreground: '#1c1e26',
  
  // Cards & Popovers
  card: '#ffffff',
  cardForeground: '#1c1e26',
  popover: '#ffffff',
  popoverForeground: '#1c1e26',
  
  // Primary
  primary: '#1c1e26',
  primaryForeground: '#ffffff',
  
  // Secondary
  secondary: '#f5b700',
  secondaryForeground: '#1c1e26',
  
  // Muted
  muted: '#f5f5f5',
  mutedForeground: '#6b7280',
  
  // Accent
  accent: '#2eb67d',
  accentForeground: '#ffffff',
  
  // Destructive
  destructive: '#e63946',
  
  // Border & Input
  border: '#e5e7eb',
  input: '#f5f5f5',
  ring: '#2eb67d',
  
  // Neutral
  neutral: '#f5f5f5',
} as const;

// Dark Theme
export const darkTheme = {
  // Background & Surface
  background: '#1e1e22',
  foreground: '#f4f4f5',
  
  // Cards & Popovers
  card: '#262629',
  cardForeground: '#f4f4f5',
  popover: '#262629',
  popoverForeground: '#f4f4f5',
  
  // Primary
  primary: '#f4f4f5',
  primaryForeground: '#1e1e22',
  
  // Secondary
  secondary: '#2e2e33',
  secondaryForeground: '#f4f4f5',
  
  // Muted
  muted: '#2e2e33',
  mutedForeground: '#a1a1aa',
  
  // Accent
  accent: '#2eb67d',
  accentForeground: '#f4f4f5',
  
  // Destructive
  destructive: '#ef4444',
  
  // Border & Input
  border: '#404048',
  input: '#2e2e33',
  ring: '#2eb67d',
  
  // Neutral
  neutral: '#2e2e33',
} as const;

// Chart Colors (same for both themes)
export const chartColors = {
  chart1: '#2eb67d', // Accent green
  chart2: '#f5b700', // Secondary gold
  chart3: '#3b82f6', // Blue
  chart4: '#8b5cf6', // Purple
  chart5: '#ec4899', // Pink
} as const;

// Sidebar Colors
export const sidebarLight = {
  sidebar: '#ffffff',
  sidebarForeground: '#1c1e26',
  sidebarPrimary: '#1c1e26',
  sidebarPrimaryForeground: '#ffffff',
  sidebarAccent: '#f5f5f5',
  sidebarAccentForeground: '#1c1e26',
  sidebarBorder: '#e5e7eb',
  sidebarRing: '#2eb67d',
} as const;

export const sidebarDark = {
  sidebar: '#1e1e22',
  sidebarForeground: '#f4f4f5',
  sidebarPrimary: '#2eb67d',
  sidebarPrimaryForeground: '#f4f4f5',
  sidebarAccent: '#2e2e33',
  sidebarAccentForeground: '#f4f4f5',
  sidebarBorder: '#404048',
  sidebarRing: '#2eb67d',
} as const;

// Type exports
export type BrandColors = typeof brandColors;
export type LightTheme = typeof lightTheme;
export type DarkTheme = typeof darkTheme;
export type ChartColors = typeof chartColors;

