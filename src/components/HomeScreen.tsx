import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ImageBackground, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './rn/Button';
import { Card, CardContent, CardHeader, CardTitle } from './rn/Card';
import { Wallet, Pickaxe, TrendingUp, Coins, LogOut } from './rn/Icons';
import type { User } from '../services/api';

interface HomeScreenProps {
  user: User | null;
  hasActiveSession: boolean;
  onStartMining: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export function HomeScreen({ 
  user,
  hasActiveSession,
  onStartMining,
  onRefresh,
  onLogout
}: HomeScreenProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (hasActiveSession) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasActiveSession]);

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      '🚪 Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header with Logout */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <LinearGradient
                colors={['#FBBF24', '#F97316', '#EF4444']}
                style={styles.iconGradient}
              >
                <Pickaxe size={40} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.headerTitle}>⚡ CRYPTO MINER ⚡</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.2)', 'rgba(220, 38, 38, 0.2)']}
                style={styles.logoutGradient}
              >
                <LogOut size={20} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Wallet Info */}
          <Card style={styles.card}>
            <CardHeader>
              <View style={styles.cardTitleRow}>
                <Wallet size={20} color="#FFFFFF" />
                <CardTitle>Wallet Address</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <Text style={styles.walletAddress}>{user.walletAddress}</Text>
            </CardContent>
          </Card>

          {/* Balance */}
          <Card style={StyleSheet.flatten([styles.card, styles.balanceCard])} glow>
            <CardHeader>
              <View style={styles.cardTitleRow}>
                <Coins size={20} color="#FBBF24" />
                <CardTitle>💰 Balance</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceAmount}>🪙 {user.totalTokens.toFixed(2)}</Text>
                <Text style={styles.balanceLabel}>TOKENS</Text>
              </View>
            </CardContent>
          </Card>

          {/* Mining Status */}
          <Card style={styles.card}>
            <CardHeader>
              <View style={styles.cardTitleRow}>
                <TrendingUp size={20} color="#FFFFFF" />
                <CardTitle>Mining Status</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.statusRow}>
                <Animated.View style={[
                  styles.statusDot,
                  hasActiveSession ? styles.statusDotActive : styles.statusDotIdle,
                  hasActiveSession && { transform: [{ scale: pulseAnim }] }
                ]} />
                <Text style={styles.statusText}>
                  {hasActiveSession ? 'Mining Active' : 'Ready to Mine'}
                </Text>
              </View>

              {hasActiveSession && (
                <Text style={styles.miningNote}>
                  ⛏️ You have an active mining session running in the background
                </Text>
              )}

              <Button 
                onPress={onStartMining}
                gradient={hasActiveSession ? ['#FBBF24', '#F97316'] : ['#8B5CF6', '#3B82F6']}
                style={styles.actionButton}
              >
                <View style={styles.buttonContent}>
                  <Pickaxe size={16} color={hasActiveSession ? '#000000' : '#FFFFFF'} />
                  <Text style={[
                    styles.buttonText,
                    hasActiveSession ? styles.buttonTextBlack : styles.buttonTextWhite
                  ]}>
                    {hasActiveSession ? 'Continue Mining' : 'Start Mining'}
                  </Text>
                </View>
              </Button>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <View style={styles.infoGrid}>
            <Card style={styles.infoCard}>
              <CardContent style={styles.infoCardContent}>
                <Text style={styles.infoLabel}>Base Rate</Text>
                <Text style={styles.infoValue}>
                  0.01 <Text style={styles.infoUnit}>tokens/sec</Text>
                </Text>
              </CardContent>
            </Card>
            
            <Card style={styles.infoCard}>
              <CardContent style={styles.infoCardContent}>
                <Text style={styles.infoLabel}>Max Multiplier</Text>
                <Text style={styles.infoValue}>
                  6<Text style={styles.infoUnit}>x</Text>
                </Text>
              </CardContent>
            </Card>
          </View>
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
  scrollContent: {
    padding: 16,
    paddingTop: 16,
    gap: 24,
  },
  headerContainer: {
    gap: 16,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  iconGradient: {
    padding: 16,
    borderRadius: 28,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 30,
    // elevation: 15,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
    letterSpacing: 2,
  },
  card: {
    marginBottom: 0,
  },
  balanceCard: {
    borderColor: 'rgba(251, 191, 36, 0.3)',
    backgroundColor: 'rgba(120, 53, 15, 0.2)',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletAddress: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 25,
    letterSpacing: -1,
  },
  balanceLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FBBF24',
    textShadowColor: '#F97316',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 15,
    letterSpacing: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusDotActive: {
    backgroundColor: '#4ADE80',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    // elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.5)',
  },
  statusDotCompleted: {
    backgroundColor: '#FBBF24',
  },
  statusDotIdle: {
    backgroundColor: '#6B7280',
  },
  statusText: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  miningNote: {
    fontSize: 13,
    color: '#FBBF24',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionButton: {
    marginTop: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  buttonTextWhite: {
    color: '#FFFFFF',
  },
  buttonTextBlack: {
    color: '#000000',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  infoCard: {
    flex: 1,
  },
  infoCardContent: {
    paddingTop: 24,
    alignItems: 'center',
    gap: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoUnit: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
