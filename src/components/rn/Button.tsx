import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  disabled?: boolean;
  gradient?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({ 
  onPress, 
  children, 
  variant = 'default', 
  disabled = false,
  gradient,
  style,
  textStyle
}: ButtonProps) {
  if (gradient) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, style]}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <Text style={[styles.text, styles.gradientText, textStyle]}>{children}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === 'outline' ? styles.outline : styles.default,
        disabled && styles.disabled,
        style
      ]}
    >
      <Text style={[styles.text, variant === 'outline' ? styles.outlineText : styles.defaultText, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: '#FFFFFF',
  },
  gradientText: {
    color: '#000000',
  },
});
