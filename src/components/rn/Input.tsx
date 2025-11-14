import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function Input({ value, onChangeText, style, ...props }: InputProps) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      style={[styles.input, style]}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'rgba(15, 15, 35, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#FFFFFF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
