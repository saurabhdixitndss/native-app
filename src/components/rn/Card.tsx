import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
}

export function Card({ children, style, glow }: CardProps) {
  return (
    <View style={[styles.card, glow && styles.cardGlow, style]}>
      {children}
    </View>
  );
}

export function CardHeader({ children, style }: CardProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}

export function CardTitle({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

export function CardDescription({ children, style }: { children: React.ReactNode; style?: any }) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

export function CardContent({ children, style }: CardProps) {
  return <View style={[styles.content, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 15, 35, 0.85)',
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    // elevation: 12,
  },
  cardGlow: {
    backgroundColor: 'rgba(30, 20, 10, 0.9)',
    borderColor: 'rgba(251, 191, 36, 0.7)',
    borderWidth: 3,
    shadowColor: '#FBBF24',
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(139, 92, 246, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingTop: 0,
  },
});
