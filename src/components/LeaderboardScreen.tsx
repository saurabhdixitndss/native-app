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
                <LinearGradient
                  colors={['rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.2)']}
                  style={styles.userRankCard}
                >
                  <View style={styles.userRankContent}>
                    <View style={styles.userRankLeft}>
                      <Text style={styles.userRankLabel}>YOUR RANK</Text>
                      <Text style={styles.userRankValue}>#{userRank.rank}</Text>
                      <Text style={styles.userRankTotal}>of {userRank.totalUsers} miners</Text>
                    </View>
                    <View style={styles.userRankRight}>
                      <Coins size={32} color="#FBBF24" />
                      <Text style={styles.userTokens}>{userRank.totalTokens.toFixed(2)}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            )}

            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <View style={styles.podiumSection}>
                <Animated.Text
                  style={[
                    styles.sectionTitle,
                    {
                      opacity: fadeAnim,
                      transform: [{ scale: pulseAnim }],
                    },
                  ]}
                >
                  🌟 TOP MINERS 🌟
                </Animated.Text>
                
                <View style={styles.podiumContainer}>
                  {/* Reorder for visual podium: 2nd, 1st, 3rd */}
                  {[top3[1], top3[0], top3[2]].filter(Boolean).map((entry, visualIndex) => {
                    const actualRank = entry.rank;
                    const colors = getPodiumColor(actualRank);
                    const height = getPodiumHeight(actualRank);
                    const emoji = getPodiumEmoji(actualRank);
                    const isUser = isCurrentUser(entry.walletAddress);
                    const animIndex = actualRank === 1 ? 1 : actualRank === 2 ? 0 : 2;

                    return (
                      <Animated.View
                        key={entry.walletAddress}
                        style={[
                          styles.podiumItem,
                          {
                            opacity: podiumAnims[animIndex],
                            transform: [
                              {
                                scale: podiumAnims[animIndex].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.3, 1],
                                }),
                              },
                              {
                                translateY: podiumAnims[animIndex].interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [100, 0],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        {/* Trophy/Medal */}
                        <Animated.View
                          style={[
                            styles.podiumTrophy,
                            actualRank === 1 && {
                              transform: [{ scale: pulseAnim }],
                            },
                          ]}
                        >
                          <Text style={styles.podiumEmoji}>{emoji}</Text>
                        </Animated.View>

                        {/* User Card */}
                        <LinearGradient
                          colors={colors}
                          style={[
                            styles.podiumCard,
                            { height },
                            isUser && styles.podiumCardHighlight,
                          ]}
                        >
                          {/* Shine Effect */}
                          {actualRank === 1 && (
                            <Animated.View
                              style={[
                                styles.shineEffect,
                                {
                                  transform: [
                                    {
                                      translateX: shineAnim.interpolate({
                                        inputRange: [-1, 2],
                                        outputRange: [-100, 300],
                                      }),
                                    },
                                  ],
                                },
                              ]}
                            />
                          )}

                          <View style={styles.podiumRank}>
                            <Text style={styles.podiumRankText}>#{actualRank}</Text>
                          </View>
                          
                          <View style={styles.podiumInfo}>
                            <Text style={[styles.podiumWallet, isUser && styles.podiumWalletHighlight]}>
                              {isUser ? 'YOU' : formatWallet(entry.walletAddress)}
                            </Text>
                            <View style={styles.podiumTokens}>
                              <Coins size={16} color="#FFFFFF" />
                              <Text style={styles.podiumTokensText}>
                                {entry.totalTokens.toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        </LinearGradient>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Rest of Leaderboard */}
            {rest.length > 0 && (
              <Animated.View
                style={[
                  styles.listSection,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>ALL MINERS</Text>
                
                {rest.map((entry, index) => {
                  const isUser = isCurrentUser(entry.walletAddress);
                  
                  return (
                    <Animated.View
                      key={entry.walletAddress}
                      style={{
                        opacity: fadeAnim,
                        transform: [
                          {
                            translateX: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0],
                            }),
                          },
                        ],
                      }}
                    >
                      <LinearGradient
                        colors={
                          isUser
                            ? ['rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.2)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                        }
                        style={[styles.listItem, isUser && styles.listItemHighlight]}
                      >
                        <View style={styles.listRank}>
                          <Text style={[styles.listRankText, isUser && styles.listRankTextHighlight]}>
                            #{entry.rank}
                          </Text>
                        </View>
                        
                        <View style={styles.listInfo}>
                          <Text style={[styles.listWallet, isUser && styles.listWalletHighlight]}>
                            {isUser ? 'YOU' : formatWallet(entry.walletAddress)}
                          </Text>
                        </View>
                        
                        <View style={styles.listTokens}>
                          <Coins size={14} color="#FBBF24" />
                          <Text style={styles.listTokensText}>{entry.totalTokens.toFixed(2)}</Text>
                        </View>
                      </LinearGradient>
                    </Animated.View>
                  );
                })}
              </Animated.View>
            )}
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
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.5)',
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
    fontSize: 12,
    fontWeight: '700',
    color: '#D1D5DB',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  userRankValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
    marginBottom: 4,
  },
  userRankTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  userRankRight: {
    alignItems: 'center',
    gap: 8,
  },
  userTokens: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FBBF24',
  },
  podiumSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 24,
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 12,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 8,
  },
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  podiumTrophy: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  podiumEmoji: {
    fontSize: 28,
  },
  podiumCard: {
    width: '100%',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  podiumCardHighlight: {
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  shineEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  podiumRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  podiumRankText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  podiumInfo: {
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  podiumWallet: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  podiumWalletHighlight: {
    fontSize: 14,
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  podiumTokens: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  podiumTokensText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  listSection: {
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  listItemHighlight: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
    borderWidth: 2,
  },
  listRank: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  listRankText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#9CA3AF',
  },
  listRankTextHighlight: {
    color: '#FFFFFF',
  },
  listInfo: {
    flex: 1,
  },
  listWallet: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D1D5DB',
    letterSpacing: 0.5,
  },
  listWalletHighlight: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  listTokens: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  listTokensText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FBBF24',
  },
});
