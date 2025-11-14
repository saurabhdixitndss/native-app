import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, Animated, Easing } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { Button } from './rn/Button';
import { Coins, PartyPopper, TrendingUp } from './rn/Icons';

interface ClaimPopupProps {
  minedTokens: number;
  onClaim: () => void;
  loading?: boolean;
}

export function ClaimPopup({ minedTokens, onClaim, loading = false }: ClaimPopupProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.timing(coinAnim, {
              toValue: 1,
              duration: 1000,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
            Animated.timing(coinAnim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const coinTranslateY = coinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(120, 53, 15, 0.98)', 'rgba(154, 52, 18, 0.98)']}
            style={styles.modalContent}
          >
            {/* Confetti Animation */}
            <View style={styles.confettiContainer}>
              <LottieView
                source={require('../assets/confetti.json')}
                autoPlay
                loop={true}
                style={styles.confetti}
              />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <PartyPopper size={32} color="#FDE68A" />
                <Text style={styles.title}>🎉 MINING COMPLETE! 🎉</Text>
              </View>
              <Text style={styles.description}>
                ✨ Congratulations! Your mining session is complete! ✨
              </Text>
            </View>

            {/* Animated Coin Display */}
            <View style={styles.rewardSection}>
              <Animated.View
                style={[
                  styles.iconCircle,
                  {
                    transform: [{ rotate }, { translateY: coinTranslateY }],
                  },
                ]}
              >
                <LinearGradient
                  colors={['#FBBF24', '#F97316', '#EF4444']}
                  style={styles.iconGradientCircle}
                >
                  <Coins size={80} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>

              <View style={styles.earnedSection}>
                <Text style={styles.earnedLabel}>💰 You Earned 💰</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.earnedAmount}>
                    {minedTokens.toFixed(2)}
                  </Text>
                  <View style={styles.tokenBadge}>
                    <LinearGradient
                      colors={['#FBBF24', '#F97316']}
                      style={styles.badgeGradient}
                    >
                      <TrendingUp size={16} color="#000000" />
                      <Text style={styles.tokenLabel}>TOKENS</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>+{minedTokens.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Added to Balance</Text>
                </View>
              </View>
            </View>

            {/* Claim Button */}
            <Button
              onPress={onClaim}
              gradient={['#FBBF24', '#F97316']}
              style={styles.claimButton}
              disabled={loading}
            >
              <View style={styles.buttonContent}>
                <Coins size={24} color="#000000" />
                <Text style={styles.claimButtonText}>
                  {loading ? '⏳ Claiming...' : '🎁 Claim Rewards'}
                </Text>
              </View>
            </Button>

            <Text style={styles.hint}>
              🚀 Claim now to add tokens to your balance and start a new mining
              session!
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 32,
    borderWidth: 3,
    borderColor: 'rgba(251, 191, 36, 0.9)',
    borderRadius: 24,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 20,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  confetti: {
    width: '100%',
    height: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 2,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 1.5,
  },
  description: {
    fontSize: 15,
    color: '#FDE68A',
    textAlign: 'center',
    lineHeight: 22,
  },
  rewardSection: {
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 2,
  },
  iconCircle: {
    marginBottom: 24,
  },
  iconGradientCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
    elevation: 25,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  earnedSection: {
    alignItems: 'center',
    gap: 16,
  },
  earnedLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FDE68A',
    textShadowColor: '#F97316',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  amountContainer: {
    alignItems: 'center',
    gap: 12,
  },
  earnedAmount: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
    letterSpacing: -2,
  },
  tokenBadge: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tokenLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
  },
  statsContainer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 2,
    borderTopColor: 'rgba(253, 230, 138, 0.3)',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4ADE80',
    textShadowColor: '#22C55E',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  claimButton: {
    marginBottom: 16,
    zIndex: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    justifyContent: 'center',
  },
  claimButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 0.5,
  },
  hint: {
    fontSize: 14,
    color: '#FDE68A',
    textAlign: 'center',
    lineHeight: 20,
    zIndex: 2,
  },
});
