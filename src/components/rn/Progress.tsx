import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ProgressProps {
  value: number;
  style?: ViewStyle;
}

export function Progress({ value, style }: ProgressProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.progress, { width: `${value}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 6,
  },
});
