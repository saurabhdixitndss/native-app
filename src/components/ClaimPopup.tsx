import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from './rn/Button';
import { Coins, PartyPopper, TrendingUp } from './rn/Icons';

interface ClaimPopupProps {
  minedTokens: number;
  onClaim: () => void;
}

export function ClaimPopup({ minedTokens, onClaim }: ClaimPopupProps) {
  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(120, 53, 15, 0.95)', 'rgba(154, 52, 18, 0.95)']}
            style={styles.modalContent}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <PartyPopper size={24} color="#FDE68A" />
                <Text style={styles.title}>Mining Complete!</Text>
              </View>
              <Text style={styles.description}>
                Your mining session has finished successfully
              </Text>
            </View>

            {/* Reward Display */}
            <View style={styles.rewardSection}>
              <LinearGradient
                colors={['#FBBF24', '#F97316']}
                style={styles.iconCircle}
              >
                <Coins size={64} color="#FFFFFF" />
              </LinearGradient>
              
              <View style={styles.earnedSection}>
                <Text style={styles.earnedLabel}>You Earned</Text>
                <Text style={styles.earnedAmount}>{minedTokens.toFixed(2)}</Text>
                <View style={styles.tokenRow}>
                  <TrendingUp size={20} color="#FDE68A" />
                  <Text style={styles.tokenLabel}>TOKENS</Text>
                </View>
              </View>
            </View>

            {/* Claim Button */}
            <Button
              onPress={onClaim}
              gradient={['#FBBF24', '#F97316']}
              style={styles.claimButton}
            >
              <View style={styles.buttonContent}>
                <Coins size={20} color="#000000" />
                <Text style={styles.claimButtonText}>Claim Rewards</Text>
              </View>
            </Button>

            <Text style={styles.hint}>
              Claiming will add tokens to your balance and start a new mining session
            </Text>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  rewardSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  earnedSection: {
    alignItems: 'center',
    gap: 8,
  },
  earnedLabel: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  earnedAmount: {
    fontSize: 60,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tokenLabel: {
    fontSize: 20,
    color: '#FDE68A',
  },
  claimButton: {
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  claimButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  hint: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});
