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
        <View style={styles.content}>
          {/* Header with Logout */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <LinearGradient
                colors={['#FBBF24', '#F97316', '#EF4444']}
                style={styles.iconGradient}
              >
                <Pickaxe size={36} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.headerTitle}>⚡ CRYPTO MINER ⚡</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <LinearGradient
                colors={['rgba(239, 68, 68, 0.2)', 'rgba(220, 38, 38, 0.2)']}
                style={styles.logoutGradient}
              >
                <LogOut size={18} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Wallet Info - Compact */}
          <Card style={styles.walletCard}>
            <CardContent style={styles.walletContent}>
              <Wallet size={18} color="#8B5CF6" />
              <Text style={styles.walletAddress}>{user.walletAddress}</Text>
            </CardContent>
          </Card>

          {/* Balance - Prominent */}
          <Card style={styles.balanceCard} glow>
            <CardContent style={styles.balanceContent}>
              <View style={styles.balanceHeader}>
                <Coins size={24} color="#FBBF24" />
                <Text style={styles.balanceTitle}>💰 BALANCE</Text>
              </View>
              <View style={styles.balanceAmountContainer}>
                <Text style={styles.balanceAmount}>{user.totalTokens.toFixed(2)}</Text>
              </View>
              <Text style={styles.balanceLabel}>TOKENS</Text>
            </CardContent>
          </Card>

          {/* Mining Status - Game Style */}
          <LinearGradient
            colors={hasActiveSession 
              ? ['rgba(74, 222, 128, 0.3)', 'rgba(34, 197, 94, 0.2)']
              : ['rgba(107, 114, 128, 0.3)', 'rgba(75, 85, 99, 0.2)']
            }
            style={styles.statusCard}
          >
            <Text style={styles.statusIcon}>{hasActiveSession ? '⛏️' : '💤'}</Text>
            <Text style={styles.statusLabel}>MINING STATUS</Text>
            <View style={styles.statusIndicator}>
              <Animated.View style={[
                styles.statusDot,
                hasActiveSession ? styles.statusDotActive : styles.statusDotIdle,
                hasActiveSession && { transform: [{ scale: pulseAnim }] }
              ]} />
              <Text style={styles.statusValue}>
                {hasActiveSession ? 'Active' : 'Idle'}
              </Text>
            </View>
            {hasActiveSession && (
              <Text style={styles.statusSubtext}>session running</Text>
            )}
          </LinearGradient>

          {/* Action Button */}
          <Button 
            onPress={onStartMining}
            gradient={hasActiveSession ? ['#FBBF24', '#F97316'] : ['#8B5CF6', '#3B82F6']}
            style={styles.actionButton}
          >
            <View style={styles.buttonContent}>
              <Pickaxe size={20} color={hasActiveSession ? '#000000' : '#FFFFFF'} />
              <Text style={[
                styles.buttonText,
                hasActiveSession ? styles.buttonTextBlack : styles.buttonTextWhite
              ]}>
                {hasActiveSession ? 'CONTINUE MINING' : 'START MINING'}
              </Text>
            </View>
          </Button>

          {/* Info Cards - Game Style */}
          <View style={styles.infoGrid}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.2)']}
              style={styles.infoCard}
            >
              <Text style={styles.infoIcon}>⚡</Text>
              <Text style={styles.infoLabel}>BASE RATE</Text>
              <Text style={styles.infoValue}>0.01</Text>
              <Text style={styles.infoUnit}>tokens/sec</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(251, 191, 36, 0.3)', 'rgba(249, 115, 22, 0.2)']}
              style={styles.infoCard}
            >
              <Text style={styles.infoIcon}>🚀</Text>
              <Text style={styles.infoLabel}>MAX BOOST</Text>
              <Text style={styles.infoValue}>6×</Text>
              <Text style={styles.infoUnit}>multiplier</Text>
            </LinearGradient>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
    gap: 14,
  },
  headerContainer: {
    gap: 10,
  },
  header: {
    alignItems: 'center',
    gap: 8,
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
    padding: 12,
    borderRadius: 24,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 25,
    // elevation: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 25,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  walletCard: {
    backgroundColor: 'rgba(15, 15, 35, 0.7)',
  },
  walletContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  walletAddress: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D1D5DB',
    letterSpacing: 1,
    flex: 1,
  },
  balanceCard: {
    borderColor: 'rgba(251, 191, 36, 0.5)',
    backgroundColor: 'rgba(120, 53, 15, 0.3)',
  },
  balanceContent: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  balanceAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 35,
    letterSpacing: -2,
  },
  balanceLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FBBF24',
    textShadowColor: '#F97316',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 18,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  statusCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statusIcon: {
    fontSize: 32,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D1D5DB',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusDotActive: {
    backgroundColor: '#4ADE80',
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // elevation: 8,
  },
  statusDotIdle: {
    backgroundColor: '#6B7280',
  },
  statusValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  statusSubtext: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
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
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  buttonTextWhite: {
    color: '#FFFFFF',
  },
  buttonTextBlack: {
    color: '#000000',
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  infoCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoIcon: {
    fontSize: 32,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D1D5DB',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  infoUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
