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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
