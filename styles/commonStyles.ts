import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  // Dark gradient background colors
  background: '#0a0a0f',
  backgroundAlt: '#1a1a2e',
  backgroundCard: '#16213e',
  
  // Vibrant highlight colors
  purple: '#8b5cf6',
  orange: '#f97316',
  green: '#10b981',
  pink: '#ec4899',
  blue: '#3b82f6',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Score colors
  scoreExcellent: '#10b981',
  scoreGood: '#84cc16',
  scoreOkay: '#f59e0b',
  scorePoor: '#f97316',
  scoreBad: '#ef4444',
  
  // Accent colors
  accent: '#8b5cf6',
  accentAlt: '#ec4899',
  
  // Border and divider
  border: '#374151',
  divider: '#4b5563',
};

export const gradients = {
  background: ['#0a0a0f', '#1a1a2e'],
  card: ['#16213e', '#1e293b'],
  purple: ['#8b5cf6', '#a855f7'],
  orange: ['#f97316', '#ea580c'],
  green: ['#10b981', '#059669'],
  pink: ['#ec4899', '#db2777'],
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    elevation: 4,
    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
  },
  secondary: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  floating: {
    backgroundColor: colors.purple,
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 8,
    boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.purple,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginTop: 24,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textMuted: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.purple,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  searchBar: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
});

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const scoreColors = {
  getScoreColor: (score: number) => {
    if (score >= 4.5) return colors.scoreExcellent;
    if (score >= 3.5) return colors.scoreGood;
    if (score >= 2.5) return colors.scoreOkay;
    if (score >= 1.5) return colors.scorePoor;
    return colors.scoreBad;
  },
  getScoreBackground: (score: number) => {
    if (score >= 4.5) return hexToRgba(colors.scoreExcellent, 0.2);
    if (score >= 3.5) return hexToRgba(colors.scoreGood, 0.2);
    if (score >= 2.5) return hexToRgba(colors.scoreOkay, 0.2);
    if (score >= 1.5) return hexToRgba(colors.scorePoor, 0.2);
    return hexToRgba(colors.scoreBad, 0.2);
  },
  getScoreEmoji: (score: number) => {
    if (score >= 4.5) return '😍'; // Excellent - heart eyes
    if (score >= 3.5) return '😊'; // Good - smiling face
    if (score >= 2.5) return '😐'; // Okay - neutral face
    if (score >= 1.5) return '😕'; // Poor - disappointed face
    return '😞'; // Bad - sad face
  },
};