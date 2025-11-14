import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from './rn/Button';
import { Card, CardContent, CardHeader, CardTitle } from './rn/Card';
import { Progress } from './rn/Progress';
import { Pickaxe, Coins, Clock, Zap } from './rn/Icons';
import { Home } from './rn/Icons';
import { miningAPI, MiningSession, Config } from '../services/api';

interface MiningScreenProps {
  session: MiningSession;
  config: Config | null;
  onComplete: () => void;
  onGoHome: () => void;
  onUpgradeMultiplier: (newMultiplier: number) => void;
}

export function MiningScreen({ session, config, onComplete, onGoHome, onUpgradeMultiplier }: MiningScreenProps) {
  const [currentReward, setCurrentReward] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentSession, setCurrentSession] = useState(session);

  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  useEffect(() => {
    updateMiningStatus();
    
    const interval = setInterval(() => {
      updateMiningStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession]);

  const updateMiningStatus = async () => {
    try {
      const response = await miningAPI.getMiningStatus(currentSession._id);
      const { status, session: updatedSession } = response;

      // Update local session if multiplier changed on backend
      if (updatedSession && updatedSession.multiplier !== currentSession.multiplier) {
        setCurrentSession(updatedSession);
      }

      setCurrentReward(status.currentReward);
      setRemainingSeconds(status.remainingSeconds);
      setIsComplete(status.isComplete);

      if (status.isComplete && !isComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error updating mining status:', error);
      calculateLocalStatus();
    }
  };

  const calculateLocalStatus = () => {
    if (!config) return;

    const startTime = parseDate(currentSession.miningStartTime);
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const totalSeconds = currentSession.selectedHour * 3600;
    
    const reward = Math.min(
      config.baseRate * currentSession.multiplier * elapsedSeconds,
      config.baseRate * currentSession.multiplier * totalSeconds
    );
    
    setCurrentReward(reward);
    setRemainingSeconds(Math.max(0, totalSeconds - elapsedSeconds));
    setIsComplete(elapsedSeconds >= totalSeconds);
  };

  const parseDate = (dateStr: string): Date => {
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('/');
    const [hours, minutes, seconds] = timePart.split(':');
    
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      parseInt(seconds)
    );
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      hours: h,
      minutes: m,
      seconds: s,
    };
  };

  const getProgress = () => {
    const totalSeconds = session.selectedHour * 3600;
    const elapsed = totalSeconds - remainingSeconds;
    return Math.min(100, (elapsed / totalSeconds) * 100);
  };

  const handleUpgrade = () => {
    if (!config) return;

    const currentMultiplier = session.multiplier;
    const nextMultiplier = currentMultiplier + 1;

    if (nextMultiplier > 6) {
      Alert.alert('🎯 Max Multiplier', 'You are already at the maximum multiplier (6×)!');
      return;
    }

    const nextOption = config.multiplierOptions.find(opt => opt.value === nextMultiplier);

    if (!nextOption) {
      Alert.alert('Error', 'Invalid multiplier option');
      return;
    }

    Alert.alert(
      `⚡ Upgrade to ${nextMultiplier}×`,
      `Upgrade your multiplier from ${currentMultiplier}× to ${nextMultiplier}×?\n\n${
        nextOption.requiresAd ? '📺 Watch an ad to unlock' : '✅ Free upgrade'
      }\n\nYour mining rate will increase immediately!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: nextOption.requiresAd ? 'Watch Ad & Upgrade' : 'Upgrade',
          onPress: () => {
            // TODO: Show ad if required
            onUpgradeMultiplier(nextMultiplier);
          },
        },
      ]
    );
  };

  const { hours, minutes, seconds: secs } = formatTime(remainingSeconds);
  const progress = getProgress();

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
          {/* Home Button */}
          <TouchableOpacity onPress={onGoHome} style={styles.homeButton}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)']}
              style={styles.homeGradient}
            >
              <Home size={20} color="#8B5CF6" />
              <Text style={styles.homeText}>Home</Text>
            </LinearGradient>
          </TouchableOpacity>

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
                  <Text style={styles.timerValue}>{String(secs).padStart(2, '0')}</Text>
                  <Text style={styles.timerLabel}>Seconds</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          <Card style={StyleSheet.flatten([styles.card, styles.rewardCard])} glow>
            <CardHeader>
              <View style={styles.cardTitleCenter}>
                <Coins size={20} color="#FBBF24" />
                <CardTitle>💰 Tokens Mined</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardAmount}>🪙 {currentReward.toFixed(4)}</Text>
                <Text style={styles.rewardLabel}>TOKENS</Text>
              </View>
              <Progress value={progress} style={styles.progress} />
              <Text style={styles.progressText}>{progress.toFixed(1)}% Complete</Text>
            </CardContent>
          </Card>

          <Card style={styles.card}>
            <CardHeader>
              <View style={styles.cardTitleCenter}>
                <Zap size={20} color="#FBBF24" />
                <CardTitle>Mining Details</CardTitle>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailValue}>{currentSession.selectedHour}h</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Multiplier</Text>
                  <Text style={styles.detailValue}>{currentSession.multiplier}×</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Rate</Text>
                  <Text style={styles.detailValue}>
                    {config ? (config.baseRate * currentSession.multiplier).toFixed(4) : '0.00'}/s
                  </Text>
                </View>
              </View>

              <Button
                onPress={handleUpgrade}
                gradient={['#8B5CF6', '#3B82F6']}
                style={styles.upgradeButton}
              >
                <View style={styles.buttonContent}>
                  <Zap size={16} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Upgrade Multiplier</Text>
                </View>
              </Button>
            </CardContent>
          </Card>
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
  homeButton: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  homeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
  },
  homeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  header: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconGradient: {
    padding: 20,
    borderRadius: 32,
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 35,
    // elevation: 18,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
    letterSpacing: 2,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  card: {
    marginBottom: 0,
  },
  rewardCard: {
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
    gap: 8,
  },
  timerUnit: {
    alignItems: 'center',
    minWidth: 70,
  },
  timerValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    letterSpacing: -1,
  },
  timerLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  timerSeparator: {
    fontSize: 36,
    fontWeight: '900',
    color: '#8B5CF6',
    marginBottom: 20,
  },
  rewardContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardAmount: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 25,
    letterSpacing: -1,
  },
  rewardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FBBF24',
    marginTop: 4,
  },
  progress: {
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  upgradeButton: {
    marginTop: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
