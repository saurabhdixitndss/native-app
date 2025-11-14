import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={['#1a0033', '#0a0a2e', '#000000']}
      style={styles.container}
    >
      <View style={styles.content}>
        <LottieView
          source={require('../assets/MoneyTransfer.json')}
          autoPlay
          loop={true}
          style={styles.animation}
        />
        <Text style={styles.title}>⚡ CRYPTO MINER ⚡</Text>
        <Text style={styles.subtitle}>Loading your mining empire...</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  animation: {
    width: width * 0.7,
    height: height * 0.4,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});
