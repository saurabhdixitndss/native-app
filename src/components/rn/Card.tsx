import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    overflow: 'hidden',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
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
