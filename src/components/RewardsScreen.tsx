import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ImageBackground,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Gift, Users, Coins } from './rn/Icons';
import { rewardsAPI, referralAPI, DailyRewardsStatus, ReferralStats } from '../services/api';
import { showRewardedAd } from '../services/adMobService';

interface RewardsScreenProps {
  walletAddress: string;
  onBack: () => void;
  onBalanceUpdate: (newBalance: number) => void;
}

export function RewardsScreen({ walletAddress, onBack, onBalanceUpdate }: RewardsScreenProps) {
  const [dailyStatus, setDailyStatus] = useState<DailyRewardsStatus | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralInput, setReferralInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [referring, setReferring] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [daily, referral] = await Promise.all([
        rewardsAPI.getDailyStatus(walletAddress),
        referralAPI.getStats(walletAddress),
      ]);
      setDailyStatus(daily);
      setReferralStats(referral);
    } catch (error) {
      console.error('Error loading rewards data:', error);
      Alert.alert('Error', 'Failed to load rewards data');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDaily = async () => {
    if (!dailyStatus?.canClaim) return;

    try {
      setClaiming(true);

      // Try to show ad first
      try {
        const adShown = await showRewardedAd();
        
        if (!adShown) {
          Alert.alert(
            'Ad Not Ready',
            'Ad is still loading. You can claim without watching the ad this time, or wait a moment and try again.',
            [
              { text: 'Wait', style: 'cancel', onPress: () => setClaiming(false) },
              { 
                text: 'Claim Anyway', 
                style: 'default',
                onPress: async () => {
                  await claimRewardNow();
                }
              },
            ]
          );
          return;
        }
      } catch (adError) {
        console.log('Ad error, allowing claim anyway:', adError);
        // If ad fails, allow claim anyway
      }

      // Claim reward after ad (or if ad failed)
      await claimRewardNow();
    } catch (error: any) {
      console.error('Error claiming daily reward:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to claim reward');
      setClaiming(false);
    }
  };

  const claimRewardNow = async () => {
    try {
      const response = await rewardsAPI.claimDaily(walletAddress);
      
      Alert.alert(
        '🎉 Reward Claimed!',
        `You earned ${response.rewardAmount} tokens!\n\nClaimed today: ${response.claimedToday}/5`,
        [{ text: 'Awesome!', style: 'default' }]
      );

      onBalanceUpdate(response.newBalance);
      await loadData();
    } finally {
      setClaiming(false);
    }
  };

  const handleCreateReferral = async () => {
    if (!referralInput.trim()) {
      Alert.alert('Error', 'Please enter a wallet address');
      return;
    }

    try {
      setReferring(true);
      await referralAPI.createReferral(walletAddress, referralInput.trim());
      
      Alert.alert(
        '✅ Referral Created!',
        `You will now earn 10% of all rewards claimed by ${referralInput.substring(0, 8)}...`,
        [{ text: 'Great!', style: 'default' }]
      );

      setReferralInput('');
      await loadData();
    } catch (error: any) {
      console.error('Error creating referral:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create referral');
    } finally {
      setReferring(false);
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
              <Text style={styles.loadingText}>Loading rewards...</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    );
  }

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
            <Text style={styles.headerTitle}>🎁 REWARDS & EARN</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Daily Rewards Section */}
            <LinearGradient
              colors={['rgba(251, 191, 36, 0.2)', 'rgba(249, 115, 22, 0.15)']}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <Gift size={28} color="#FBBF24" />
                <Text style={styles.sectionTitle}>DAILY REWARDS</Text>
              </View>

              <Text style={styles.sectionDesc}>
                Claim up to 5 random rewards daily! Watch an ad to unlock each reward.
              </Text>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <LinearGradient
                    colors={['#FBBF24', '#F97316']}
                    style={[
                      styles.progressFill,
                      { width: `${(dailyStatus!.claimedToday / 5) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {dailyStatus!.claimedToday} / 5 claimed today
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClaimDaily}
                disabled={!dailyStatus?.canClaim || claiming}
                style={[
                  styles.claimButton,
                  (!dailyStatus?.canClaim || claiming) && styles.claimButtonDisabled,
                ]}
              >
                <LinearGradient
                  colors={
                    dailyStatus?.canClaim && !claiming
                      ? ['#FBBF24', '#F97316']
                      : ['#6B7280', '#4B5563']
                  }
                  style={styles.claimButtonGradient}
                >
                  {claiming ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Gift size={20} color="#FFFFFF" />
                      <Text style={styles.claimButtonText}>
                        {dailyStatus?.canClaim ? 'CLAIM REWARD' : 'LIMIT REACHED'}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {dailyStatus!.rewards.length > 0 && (
                <View style={styles.rewardsHistory}>
                  <Text style={styles.historyTitle}>Today's Claims:</Text>
                  {dailyStatus!.rewards.map((reward, index) => (
                    <View key={index} style={styles.rewardItem}>
                      <Coins size={16} color="#FBBF24" />
                      <Text style={styles.rewardAmount}>+{reward.amount} tokens</Text>
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>

            {/* Referral Section */}
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.15)']}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <Users size={28} color="#8B5CF6" />
                <Text style={styles.sectionTitle}>REFERRAL PROGRAM</Text>
              </View>

              <Text style={styles.sectionDesc}>
                Refer friends and earn 10% of all their rewards automatically!
              </Text>

              {/* Referral Stats */}
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{referralStats!.totalReferrals}</Text>
                  <Text style={styles.statLabel}>Referrals</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{referralStats!.totalEarnings.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>Total Earned</Text>
                </View>
              </View>

              {referralStats!.wasReferred && (
                <View style={styles.referredByCard}>
                  <Text style={styles.referredByLabel}>You were referred by:</Text>
                  <Text style={styles.referredByWallet}>
                    {referralStats!.referredBy?.substring(0, 10)}...
                  </Text>
                </View>
              )}

              {!referralStats!.wasReferred && (
                <View style={styles.referralInputContainer}>
                  <Text style={styles.inputLabel}>Refer a Friend:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter wallet address"
                    placeholderTextColor="#6B7280"
                    value={referralInput}
                    onChangeText={setReferralInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={handleCreateReferral}
                    disabled={referring || !referralInput.trim()}
                    style={[
                      styles.referButton,
                      (referring || !referralInput.trim()) && styles.referButtonDisabled,
                    ]}
                  >
                    <LinearGradient
                      colors={
                        !referring && referralInput.trim()
                          ? ['#8B5CF6', '#3B82F6']
                          : ['#6B7280', '#4B5563']
                      }
                      style={styles.referButtonGradient}
                    >
                      {referring ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <>
                          <Users size={20} color="#FFFFFF" />
                          <Text style={styles.referButtonText}>CREATE REFERRAL</Text>
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {/* Referral List */}
              {referralStats!.referrals.length > 0 && (
                <View style={styles.referralList}>
                  <Text style={styles.listTitle}>Your Referrals:</Text>
                  {referralStats!.referrals.map((ref, index) => (
                    <View key={index} style={styles.referralItem}>
                      <View style={styles.referralInfo}>
                        <Text style={styles.referralWallet}>
                          {ref.wallet.substring(0, 10)}...
                        </Text>
                        <Text style={styles.referralDate}>
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={styles.referralEarnings}>
                        <Coins size={14} color="#4ADE80" />
                        <Text style={styles.referralAmount}>+{ref.earnings.toFixed(2)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>
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
  section: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  sectionDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FBBF24',
    textAlign: 'center',
  },
  claimButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  claimButtonDisabled: {
    opacity: 0.5,
  },
  claimButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  rewardsHistory: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  historyTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FBBF24',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  referredByCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  referredByLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  referredByWallet: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  referralInputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D1D5DB',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  referButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  referButtonDisabled: {
    opacity: 0.5,
  },
  referButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  referButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  referralList: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  listTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  referralItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  referralInfo: {
    flex: 1,
  },
  referralWallet: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  referralDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  referralEarnings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  referralAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4ADE80',
  },
});
