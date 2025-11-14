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
        <View style={styles.content}>
          {/* Header with Home Button */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <LinearGradient
                colors={['#FBBF24', '#F97316', '#EF4444']}
                style={styles.iconGradient}
              >
                <Pickaxe size={36} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.headerTitle}>⛏️ MINING ⛏️</Text>
            </View>
            <TouchableOpacity onPress={onGoHome} style={styles.homeButton}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.2)']}
                style={styles.homeGradient}
              >
                <Home size={18} color="#8B5CF6" />
                <Text style={styles.homeText}>Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Timer - Compact */}
          <Card style={styles.timerCard}>
            <CardContent style={styles.timerContent}>
              <View style={styles.timerHeader}>
                <Clock size={18} color="#8B5CF6" />
                <Text style={styles.timerTitle}>TIME REMAINING</Text>
              </View>
              <View style={styles.timerContainer}>
                <View style={styles.timerUnit}>
                  <Text style={styles.timerValue}>{String(hours).padStart(2, '0')}</Text>
                  <Text style={styles.timerLabel}>H</Text>
                </View>
                <Text style={styles.timerSeparator}>:</Text>
                <View style={styles.timerUnit}>
                  <Text style={styles.timerValue}>{String(minutes).padStart(2, '0')}</Text>
                  <Text style={styles.timerLabel}>M</Text>
                </View>
                <Text style={styles.timerSeparator}>:</Text>
                <View style={styles.timerUnit}>
                  <Text style={styles.timerValue}>{String(secs).padStart(2, '0')}</Text>
                  <Text style={styles.timerLabel}>S</Text>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* Tokens Mined - Prominent */}
          <Card style={styles.rewardCard} glow>
            <CardContent style={styles.rewardContent}>
              <View style={styles.rewardHeader}>
                <Coins size={24} color="#FBBF24" />
                <Text style={styles.rewardTitle}>💰 TOKENS MINED</Text>
              </View>
              <Text style={styles.rewardAmount}>{currentReward.toFixed(2)}</Text>
              <Text style={styles.rewardLabel}>TOKENS</Text>
              <Progress value={progress} style={styles.progress} />
              <Text style={styles.progressText}>{progress.toFixed(1)}% Complete</Text>
            </CardContent>
          </Card>

          {/* Mining Details - Game Style */}
          <View style={styles.detailsGrid}>
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.3)', 'rgba(59, 130, 246, 0.2)']}
              style={styles.detailCard}
            >
              <Text style={styles.detailIcon}>⏱️</Text>
              <Text style={styles.detailLabel}>DURATION</Text>
              <Text style={styles.detailValue}>{currentSession.selectedHour}h</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(251, 191, 36, 0.3)', 'rgba(249, 115, 22, 0.2)']}
              style={styles.detailCard}
            >
              <Text style={styles.detailIcon}>⚡</Text>
              <Text style={styles.detailLabel}>MULTIPLIER</Text>
              <Text style={styles.detailValue}>{currentSession.multiplier}×</Text>
            </LinearGradient>
            
            <LinearGradient
              colors={['rgba(34, 197, 94, 0.3)', 'rgba(22, 163, 74, 0.2)']}
              style={styles.detailCard}
            >
              <Text style={styles.detailIcon}>🚀</Text>
              <Text style={styles.detailLabel}>RATE</Text>
              <Text style={styles.detailValue}>
                {config ? (config.baseRate * currentSession.multiplier).toFixed(3) : '0.00'}
              </Text>
              <Text style={styles.detailUnit}>tokens/s</Text>
            </LinearGradient>
          </View>

          {/* Upgrade Button */}
          <Button
            onPress={handleUpgrade}
            gradient={['#8B5CF6', '#3B82F6']}
            style={styles.upgradeButton}
          >
            <View style={styles.buttonContent}>
              <Zap size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>UPGRADE MULTIPLIER</Text>
            </View>
          </Button>
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
  homeButton: {
    alignSelf: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
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
    gap: 8,
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
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  timerCard: {
    backgroundColor: 'rgba(15, 15, 35, 0.7)',
  },
  timerContent: {
    paddingVertical: 12,
    gap: 8,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  timerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  rewardCard: {
    borderColor: 'rgba(251, 191, 36, 0.5)',
    backgroundColor: 'rgba(120, 53, 15, 0.3)',
  },
  rewardContent: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  timerUnit: {
    alignItems: 'center',
    minWidth: 50,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
    letterSpacing: 1,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 2,
  },
  timerSeparator: {
    fontSize: 28,
    fontWeight: '900',
    color: '#8B5CF6',
    marginBottom: 12,
  },
  rewardAmount: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 35,
    letterSpacing: -2,
  },
  rewardLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 4,
    textTransform: 'uppercase',
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
    gap: 10,
  },
  detailCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailIcon: {
    fontSize: 24,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#D1D5DB',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  detailUnit: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  upgradeButton: {
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
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
