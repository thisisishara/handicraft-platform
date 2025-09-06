import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View
} from 'react-native';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/Design';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary',
  loading = false,
  size = 'medium',
  leftIcon,
  style, 
  disabled,
  ...props 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? Colors.button.primaryText : Colors.text.primary} 
          size="small" 
        />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text style={[styles.text, styles[`${variant}Text`]]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: Colors.button.primary,
  },
  secondary: {
    backgroundColor: Colors.button.secondary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.button.outline,
  },
  small: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  medium: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  large: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  disabled: {
    backgroundColor: Colors.button.disabled,
    borderColor: Colors.button.disabled,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: Spacing.sm,
  },
  text: {
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
  },
  primaryText: {
    color: Colors.button.primaryText,
  },
  secondaryText: {
    color: Colors.button.secondaryText,
  },
  outlineText: {
    color: Colors.text.primary,
  },
});
