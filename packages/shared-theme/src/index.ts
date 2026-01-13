// Colors
export {
  brandColors,
  lightTheme,
  darkTheme,
  chartColors,
  sidebarLight,
  sidebarDark,
  type BrandColors,
  type LightTheme,
  type DarkTheme,
  type ChartColors,
} from './colors';

// Spacing & Typography
export {
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
} from './spacing';

// Helper to get theme based on mode
export function getTheme(isDark: boolean) {
  return isDark
    ? require('./colors').darkTheme
    : require('./colors').lightTheme;
}

