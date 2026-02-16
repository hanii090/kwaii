export const Colors = {
  background: '#FFF9F0',
  primary: '#8B5E3C',
  secondary: '#A67C52',
  accent: '#B8D8BA',
  warm: '#F4A261',
  white: '#FFFFFF',
  card: '#FFF5E6',
  border: '#E8D5C0',
  inactive: '#D4C4B0',
  text: '#5C3D2E',
  lightText: '#C4A882',
  tabActive: '#D4E7D6',
  takenGreen: '#D4E7D6',
  success: '#6BBF6B',
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.secondary,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.lightText,
  },
  button: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.white,
  },
};
