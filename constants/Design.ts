// Comprehensive Design System
export const Colors = {
  // Primary Colors (Black-based theme)
  primary: '#000000',
  primaryLight: '#1A1A1A',
  primaryDark: '#000000',
  
  // Secondary Colors
  secondary: '#FFFFFF',
  accent: '#4A4A4A',
  
  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
    disabled: '#CCCCCC',
  },
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
    dark: '#000000',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Border Colors
  border: {
    primary: '#E5E5E5',
    secondary: '#F0F0F0',
    dark: '#333333',
    light: '#F5F5F5',
  },
  
  // Component-specific Colors
  card: {
    background: '#FFFFFF',
    border: '#E5E5E5',
    shadow: 'rgba(0, 0, 0, 0.05)',
  },
  
  button: {
    primary: '#000000',
    primaryText: '#FFFFFF',
    secondary: '#FFFFFF',
    secondaryText: '#000000',
    outline: '#000000',
    disabled: '#CCCCCC',
  },
};

export const Typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Font Weights
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Layout = {
  // Container Widths
  container: {
    sm: 480,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  
  // Header Heights
  header: {
    sm: 56,
    md: 64,
    lg: 72,
  },
  
  // Tab Bar Heights
  tabBar: {
    height: 60,
    paddingBottom: 8,
  },
};

// Common Styles
export const CommonStyles = {
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
    height: Layout.header.md,
  },
  
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  
  card: {
    backgroundColor: Colors.card.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.card.border,
    ...Shadow.small,
  },
  
  section: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  
  buttonPrimary: {
    backgroundColor: Colors.button.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  buttonPrimaryText: {
    color: Colors.button.primaryText,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.button.secondary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.button.outline,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  
  buttonSecondaryText: {
    color: Colors.button.secondaryText,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  
  input: {
    borderWidth: 1,
    borderColor: Colors.border.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
    backgroundColor: Colors.background.primary,
  },
  
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  
  tabBar: {
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
    height: Layout.tabBar.height,
    paddingBottom: Layout.tabBar.paddingBottom,
  },
};

// Icon Standards
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 40,
};

// Standard Icons for Different Modes
export const StandardIcons = {
  // Navigation Icons
  home: 'home',
  shop: 'storefront',
  orders: 'clipboard-list',
  messages: 'message-text',
  profile: 'account',
  products: 'package-variant',
  support: 'help-circle',
  
  // Action Icons
  add: 'plus',
  edit: 'pencil',
  delete: 'delete',
  search: 'magnify',
  filter: 'tune',
  cart: 'cart',
  heart: 'heart',
  share: 'share-variant',
  bell: 'bell-outline',
  
  // Status Icons
  success: 'check-circle',
  warning: 'alert-circle',
  error: 'close-circle',
  info: 'information',
  
  // Common Icons
  back: 'arrow-left',
  forward: 'arrow-right',
  up: 'chevron-up',
  down: 'chevron-down',
  close: 'close',
  menu: 'menu',
};
