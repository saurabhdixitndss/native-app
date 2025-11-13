import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './rn/Button';
import { Input } from './rn/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './rn/Card';
import { Wallet, Pickaxe } from './rn/Icons';

interface SignupScreenProps {
  onSignup: (walletAddress: string) => void;
}

export function SignupScreen({ onSignup }: SignupScreenProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }
    
    if (walletAddress.length < 10) {
      setError('Please enter a valid wallet address');
      return;
    }
    
    onSignup(walletAddress.trim());
  };

  return (
    <LinearGradient
      colors={['#1a0033', '#0a0a2e', '#000000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card} glow>
              <CardHeader style={styles.header}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#FBBF24', '#F97316', '#EF4444']}
                    style={styles.iconGradient}
                  >
                    <Pickaxe size={48} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <CardTitle style={styles.title}>⚡ CRYPTO MINER ⚡</CardTitle>
                <CardDescription style={styles.description}>
                  Start mining tokens and build your crypto wealth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <View style={styles.labelContainer}>
                      <Wallet size={16} color="#D1D5DB" />
                      <Text style={styles.label}>Wallet Address</Text>
                    </View>
                    <Input
                      placeholder="Enter your wallet address"
                      value={walletAddress}
                      onChangeText={(text) => {
                        setWalletAddress(text);
                        setError('');
                      }}
                    />
                    {error && (
                      <Text style={styles.error}>{error}</Text>
                    )}
                  </View>
                  
                  <Button 
                    onPress={handleSubmit}
                    gradient={['#FBBF24', '#F97316']}
                    style={styles.button}
                  >
                    Start Mining
                  </Button>
                </View>
              </CardContent>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    padding: 16,
    borderRadius: 20,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  description: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  error: {
    fontSize: 14,
    color: '#F87171',
  },
  button: {
    marginTop: 8,
  },
});
