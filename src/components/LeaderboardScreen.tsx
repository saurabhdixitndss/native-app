import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Coins } from './rn/Icons';
import { leaderboardAPI, LeaderboardEntry, UserRank } from '../services/api';

interface LeaderboardScreenProps {
  walletAddress: string;
  onBack: () => void;
}

export function LeaderboardScreen({ walletAddress, onBack }: LeaderboardScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const podiumAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    loadData();
    startContinuousAnimations();
  }, []);

  const startContinuousAnimations = () => {
    // Pulse animation for top 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shine animation
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 2,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [leaderboardData, rankData] = await Promise.all([
        leaderboardAPI.getLeaderboard(50),
        leaderboardAPI.getUserRank(walletAddress),
      ]);
      setLeaderboard(leaderboardData.leaderboard);
      setUserRank(rankData);

      // Start entrance animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Stagger podium animations
      Animated.stagger(200, [
        Animated.spring(podiumAnims[0], {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(podiumAnims[1], {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(podiumAnims[2], {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWallet = (wallet: string) => {
    return `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}`;
  };

  const isCurrentUser = (wallet: string) => {
    return wallet.toLowerCase() === walletAddress.toLowerCase();
  };

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1:
        return ['#FFD700', '#FFA500']; // Gold
      case 2:
        return ['#C0C0C0', '#A8A8A8']; // Silver
      case 3:
        return ['#CD7F32', '#B8860B']; // Bronze
      default:
        return ['#8B5CF6', '#3B82F6'];
    }
  };

  const getPodiumEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '👑';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return 180;
      case 2:
        return 140;
      case 3:
        return 120;
      default:
        return 100;
    }
  };

  if (loading) {
    return (
      <ImageBackground
        source={require('../assets/bgimage1.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(26, 0, 51, 0.85)', 'rgba(10, 10, 46, 0.85)', 'rgba(22, 33, 62, 0.85)', 'rgba(0, 0, 0, 0.9)']}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loadingText}>Loading leaderboard...</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <ImageBackground
      source={require('../assets/bgimage1.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(26, 0, 51, 0.85)', 'rgba(10, 10, 46, 0.85)', 'rgba(22, 33, 62, 0.85)', 'rgba(0, 0, 0, 0.9)']}
        style={styles.overlay}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>🏆 LEADERBOARD</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Rank Card */}
            {userRank && (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                }}
              >
                <View style={styles.userRankCard}>
                  <View style={styles.neonBorder} />
                  <View style={styles.userRankContent}>
                    <View style={styles.userRankLeft}>
                      <Text style={styles.userRankLabel}>YOUR RANK</Text>
                      <Text style={styles.userRankValue}>#{userRank.rank}</Text>
                    </View>
                    <View style={styles.userRankRight}>
                      <Text style={styles.userTokensLabel}>TOKENS</Text>
                      <Text style={styles.userTokens}>{userRank.totalTokens.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}

            {/* Leaderboard List */}
            <Animated.View
              style={{
                opacity: fadeAnim,
              }}
            >
              {leaderboard.map((entry, index) => {
                const isUser = isCurrentUser(entry.walletAddress);
                const colors = getPodiumColor(entry.rank);
                const animIndex = entry.rank <= 3 ? entry.rank - 1 : 0;
                const maxTokens = leaderboard[0]?.totalTokens || 1;
                const progress = (entry.totalTokens / maxTokens) * 100;

                return (
                  <Animated.View
                    key={entry.walletAddress}
                    style={{
                      opacity: entry.rank <= 3 ? podiumAnims[animIndex] : fadeAnim,
                      transform: [
                        {
                          scale: entry.rank <= 3
                            ? podiumAnims[animIndex].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1],
                              })
                            : 1,
                        },
                      ],
                    }}
                  >
                    <View style={[styles.leaderCard, isUser && styles.leaderCardHighlight]}>
                      {/* Neon Border */}
                      <View
                        style={[
                          styles.cardNeonBorder,
                          entry.rank === 1 && styles.goldBorder,
                          entry.rank === 2 && styles.silverBorder,
                          entry.rank === 3 && styles.bronzeBorder,
                          isUser && styles.userBorder,
                        ]}
                      />

                      {/* Shine Effect for Top 3 */}
                      {entry.rank <= 3 && (
                        <Animated.View
                          style={[
                            styles.cardShine,
                            {
                              transform: [
                                {
                                  translateX: shineAnim.interpolate({
                                    inputRange: [-1, 2],
                                    outputRange: [-200, 400],
                                  }),
                                },
                              ],
                            },
                          ]}
                        />
                      )}

                      <View style={styles.cardContent}>
                        {/* Left: Avatar & Rank */}
                        <View style={styles.cardLeft}>
                          <View
                            style={[
                              styles.avatar,
                              entry.rank === 1 && styles.goldAvatar,
                              entry.rank === 2 && styles.silverAvatar,
                              entry.rank === 3 && styles.bronzeAvatar,
                            ]}
                          >
                            <Text style={styles.avatarEmoji}>{getPodiumEmoji(entry.rank)}</Text>
                          </View>
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                              {isUser ? 'YOU' : formatWallet(entry.walletAddress)}
                            </Text>
                            <View style={styles.rankBadge}>
                              <Text style={styles.rankText}>#{entry.rank}</Text>
                            </View>
                          </View>
                        </View>

                        {/* Right: Tokens */}
                        <View style={styles.cardRight}>
                          <View style={styles.tokensContainer}>
                            <Text style={styles.tokensValue}>
                              {entry.totalTokens.toFixed(2)}
                            </Text>
                            <Coins size={16} color="#4ADE80" />
                          </View>
                        </View>
                      </View>

                      {/* Progress Bar */}
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBg}>
                          <Animated.View
                            style={[
                              styles.progressBarFill,
                              {
                                width: `${progress}%`,
                                backgroundColor:
                                  entry.rank === 1
                                    ? '#FFD700'
                                    : entry.rank === 2
                                    ? '#C0C0C0'
                                    : entry.rank === 3
                                    ? '#CD7F32'
                                    : '#8B5CF6',
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                );
              })}
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.3)',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userRankCard: {
    backgroundColor: 'rgba(20, 20, 40, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  neonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  userRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userRankLeft: {
    flex: 1,
  },
  userRankLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B5CF6',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  userRankValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  userRankRight: {
    alignItems: 'flex-end',
  },
  userTokensLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4ADE80',
    letterSpacing: 1,
    marginBottom: 4,
  },
  userTokens: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4ADE80',
    textShadowColor: '#4ADE80',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  leaderCard: {
    backgroundColor: 'rgba(20, 25, 45, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  leaderCardHighlight: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  cardNeonBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(100, 116, 139, 0.5)',
  },
  goldBorder: {
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  silverBorder: {
    borderColor: '#C0C0C0',
    shadowColor: '#C0C0C0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  bronzeBorder: {
    borderColor: '#CD7F32',
    shadowColor: '#CD7F32',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  userBorder: {
    borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  cardShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-20deg' }],
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(100, 116, 139, 0.5)',
  },
  goldAvatar: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  silverAvatar: {
    backgroundColor: 'rgba(192, 192, 192, 0.2)',
    borderColor: '#C0C0C0',
    shadowColor: '#C0C0C0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  bronzeAvatar: {
    backgroundColor: 'rgba(205, 127, 50, 0.2)',
    borderColor: '#CD7F32',
    shadowColor: '#CD7F32',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  userInfo: {
    flex: 1,
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  rankBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(100, 116, 139, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.5)',
  },
  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  tokensContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tokensValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4ADE80',
    textShadowColor: '#4ADE80',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(100, 116, 139, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
});
