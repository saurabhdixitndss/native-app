import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 6000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <ImageBackground
      source={require('../assets/bgimage1.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(26, 0, 51, 0.95)', 'rgba(10, 10, 46, 0.95)', 'rgba(0, 0, 0, 0.98)']}
        style={styles.overlay}
      >
        <View style={styles.content}>
          {/* Crypto Animation with Purple Circle Background */}
          <View style={styles.topSection}>
            {/* Neon Outer Ring */}
            <Animated.View
              style={[
                styles.neonRing,
                {
                  opacity: glowOpacity,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            />

            {/* Soft Radial Light */}
            <View style={styles.radialLight} />

            {/* Crypto Animation */}
            <Animated.View
              style={[
                styles.animationContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <LottieView
                source={require('../assets/Crypto.json')}
                autoPlay
                loop
                style={styles.animation}
              />
            </Animated.View>
          </View>


          {/* Title with Animation */}
          <Animated.View
            style={{
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  }),
                },
              ],
            }}
          >
            <Text style={styles.title}>CRYPTO MINER</Text>
            <Text style={styles.subtitle}>💎 Loading your mining empire... </Text>
          </Animated.View>

          {/* Loading Indicator */}
          <Animated.View
            style={[
              styles.loadingContainer,
              {
                opacity: titleAnim,
              },
            ]}
          >
            <View style={styles.loadingBar}>
              <Animated.View
                style={[
                  styles.loadingProgress,
                  {
                    opacity: glowOpacity,
                  },
                ]}
              />
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    height: width * 0.8,
  },
  glowCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 70,
    elevation: 25,
  },
  neonRing: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    borderWidth: 4,
    borderColor: 'rgba(147, 51, 234, 0.9)',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 35,
    zIndex: -1,
  },

  radialLight: {
    position: 'absolute',
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: 'rgba(167, 139, 250, 0.25)',
    filter: 'blur(40px)',
    opacity: 0.6,
  },

  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  animation: {
    width: width * 0.55,
    height: width * 0.55,
  },

  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 6,
    textShadowColor: 'rgba(255, 215, 0, 0.9)',
    textShadowOffset: { width: 0, height: 5 },
    textShadowRadius: 40,
    marginTop: 10,
    textTransform: 'uppercase',
  },

  subtitle: {
    fontSize: 18,
    color: '#EAB308',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '600',
    opacity: 0.9,
    textShadowColor: 'rgba(234, 179, 8, 0.6)',
    textShadowRadius: 12,
  },

  loadingContainer: {
    width: width * 0.7,
    marginTop: -10,
  },

  loadingBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },

  loadingProgress: {
    height: '100%',
    width: '100%',
    backgroundColor: '#FACC15',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
});
