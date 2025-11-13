import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './rn/Button';
import { Card, CardContent, CardHeader, CardTitle } from './rn/Card';
import { Progress } from './rn/Progress';
import { Pickaxe, Coins, Clock, X, Zap } from './rn/Icons';
import type { MiningSession } from '../../App';

interface MiningScreenProps {
  session: MiningSession;
  onComplete: (minedTokens: number) => void;
  onCancel: () => void;
}

export function MiningScreen({ session, onComplete, onCancel }: MiningScreenProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [minedTokens, setMinedTokens] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      // Calculate mined tokens based on elapsed time
      const elapsedMs = now - session.startTime;
      const elapsedSeconds = elapsedMs / 1000;
      const tokensPerSecond = session.baseRate * session.multiplier;
      const tokens = Math.min(
        elapsedSeconds * tokensPerSecond,
        session.duration * tokensPerSecond
      );
      setMinedTokens(tokens);

      // Check if mining is complete
      if (now >= session.endTime) {
        clearInterval(interval);
        onComplete(session.duration * tokensPerSecond);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [session, onComplete]);

  const getRemainingTime = () => {
    const remaining = Math.max(0, session.endTime - currentTime);
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const getProgress = () => {
    const elapsed = currentTime - session.startTime;
    const total = session.endTime - session.startTime;
    return Math.min(100, (elapsed / total) * 100);
  };

  const { hours, minutes, seconds } = getRemainingTime();
  const progress = getProgress();

  return (
    <LinearGradient
      colors={['#1a0033', '#0a0a2e', '#16213e', '#000000']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <LinearGradient
              colors={['#FBBF24', '#F97316', '#EF4444']}
              style={styles.iconGradient}
            >
              <Pickaxe size={48} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.headerTitle}>⛏️ MINING IN PROGRESS ⛏️</Text>
            <Text style={styles.headerSubtitle}>💎 Your tokens are being generated... 💎</Text>
          </View>

          {/* Timer Card */}
          <Card style={styles.card}>
            <CardHeader>
              <View style={styles.cardTitleCenter}>
                <Clock size={20} color="#FFFFFF" />
                <CardTitle>Time Remaining</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.timerContainer}>
                <View style={styles.timerUnit}>
                  <Text style={styles.timerValue}>{String(hours).padStart(2, '0')}</Text>
                  <Text style={styles.timerLabel}>Hours</Text>
                </View>
                <Text style={styles.timerSeparator}>:</Text>
                <View style={styles.timerUnit}>
                  <Text style={styles.timerValue}>{String(minutes).padStart(2, '0')}</Text>
                  <Text style={styles.timerLabel}>Minutes</Text>
                </View>
                <Text style={styles.timerSeparator}>:</Text>
                <View style={styles.timerUnit}>
                  <Text style={styles.timerValue}>{String(seconds).padStart(2, '0')}</Text>
                  <Text style={styles.timerLabel}>Seconds</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card style={styles.card}>
            <CardContent style={styles.progressContent}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Mining Progress</Text>
                <Text style={styles.progressValue}>{progress.toFixed(1)}%</Text>
              </View>
              <Progress value={progress} style={styles.progressBar} />
            </CardContent>
          </Card>

          {/* Mined Tokens Card */}
          <Card style={StyleSheet.flatten([styles.card, styles.tokensCard])} glow>
            <CardHeader>
              <View style={styles.cardTitleCenter}>
                <Coins size={20} color="#FBBF24" />
                <CardTitle>🪙 Tokens Mined</CardTitle>
              </View>
            </CardHeader>
            <CardContent style={styles.tokensContent}>
              <View style={styles.tokensRow}>
                <Text style={styles.tokensAmount}>{minedTokens.toFixed(2)}</Text>
                <Text style={styles.tokensLabel}>TOKENS</Text>
              </View>
              <Text style={styles.rateText}>
                Rate: {(session.baseRate * session.multiplier).toFixed(4)} tokens/sec
              </Text>
            </CardContent>
          </Card>

          {/* Mining Stats */}
          <View style={styles.statsGrid}>
            <Card style={styles.statCard}>
              <CardContent style={styles.statContent}>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>
                  {session.duration / 3600} <Text style={styles.statUnit}>hours</Text>
                </Text>
              </CardContent>
            </Card>
            
            <Card style={styles.statCard}>
              <CardContent style={styles.statContent}>
                <View style={styles.statLabelRow}>
                  <Zap size={16} color="#FBBF24" />
                  <Text style={styles.statLabel}>Multiplier</Text>
                </View>
                <Text style={styles.statValue}>
                  {session.multiplier}<Text style={styles.statUnit}>x</Text>
                </Text>
              </CardContent>
            </Card>
          </View>

          {/* Cancel Button */}
          <Button
            onPress={onCancel}
            variant="outline"
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          >
            <View style={styles.buttonContent}>
              <X size={16} color="#FCA5A5" />
              <Text style={styles.cancelButtonText}>Cancel Mining</Text>
            </View>
          </Button>
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
    paddingTop: 32,
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  iconGradient: {
    padding: 16,
    borderRadius: 20,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
  },
  card: {
    marginBottom: 0,
  },
  tokensCard: {
    borderColor: 'rgba(251, 191, 36, 0.3)',
    backgroundColor: 'rgba(120, 53, 15, 0.2)',
  },
  cardTitleCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  timerUnit: {
    alignItems: 'center',
    gap: 4,
  },
  timerValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  timerLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  timerSeparator: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressContent: {
    paddingTop: 24,
    gap: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  progressValue: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  progressBar: {
    height: 12,
  },
  tokensContent: {
    alignItems: 'center',
    gap: 8,
  },
  tokensRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  tokensAmount: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  tokensLabel: {
    fontSize: 18,
    color: '#FBBF24',
  },
  rateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    paddingTop: 24,
    alignItems: 'center',
    gap: 4,
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statUnit: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cancelButton: {
    backgroundColor: 'rgba(127, 29, 29, 0.2)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  cancelButtonText: {
    color: '#FCA5A5',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
