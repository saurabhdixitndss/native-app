import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './rn/Button';
import { Card, CardContent, CardHeader, CardTitle } from './rn/Card';
import { Wallet, Pickaxe, TrendingUp, Coins, LogOut } from './rn/Icons';
import type { User } from '../services/api';

interface HomeScreenProps {
  user: User | null;
  onStartMining: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export function HomeScreen({ 
  user, 
  onStartMining,
  onRefresh,
  onLogout
}: HomeScreenProps) {
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
    <LinearGradient
      colors={['#1a0033', '#0a0a2e', '#16213e', '#000000']}
      style={styles.container}
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
                <CardTitle>Wallet</CardTitle>
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
                <View style={[styles.statusDot, styles.statusDotIdle]} />
                <Text style={styles.statusText}>Ready to Mine</Text>
              </View>

              <Button 
                onPress={onStartMining}
                gradient={['#8B5CF6', '#3B82F6']}
                style={styles.actionButton}
              >
                <View style={styles.buttonContent}>
                  <Pickaxe size={16} color="#FFFFFF" />
                  <Text style={[styles.buttonText, styles.buttonTextWhite]}>Start Mining</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
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
    padding: 12,
    borderRadius: 20,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 1,
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
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FBBF24',
    textShadowColor: '#F97316',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
    shadowRadius: 10,
    elevation: 5,
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
