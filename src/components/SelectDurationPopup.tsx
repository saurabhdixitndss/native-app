import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from './rn/Button';
import { Card, CardContent } from './rn/Card';
import { Clock, Zap, PlayCircle, X } from './rn/Icons';

interface SelectDurationPopupProps {
  visible: boolean;
  onClose: () => void;
  onStartMining: (durationHours: number, multiplier: number) => void;
}

const DURATION_OPTIONS = [
  { hours: 1, label: '1 Hour' },
  { hours: 2, label: '2 Hours' },
  { hours: 4, label: '4 Hours' },
  { hours: 12, label: '12 Hours' },
  { hours: 24, label: '24 Hours' },
];

const MULTIPLIER_OPTIONS = [
  { value: 1, cost: 0, label: 'Free' },
  { value: 2, cost: 100, label: '100 tokens' },
  { value: 3, cost: 250, label: '250 tokens' },
  { value: 4, cost: 500, label: '500 tokens' },
  { value: 5, cost: 1000, label: '1000 tokens' },
  { value: 6, cost: 2000, label: '2000 tokens' },
];

export function SelectDurationPopup({ visible, onClose, onStartMining }: SelectDurationPopupProps) {
  const [selectedDuration, setSelectedDuration] = useState(4);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);

  const handleStart = () => {
    onStartMining(selectedDuration, selectedMultiplier);
  };

  const calculateReward = () => {
    const durationSeconds = selectedDuration * 3600;
    const baseRate = 0.01;
    return (durationSeconds * baseRate * selectedMultiplier).toFixed(2);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(88, 28, 135, 0.95)', 'rgba(30, 58, 138, 0.95)']}
            style={styles.modalContent}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <Clock size={22} color="#FBBF24" />
                  <Text style={styles.title}>⏰ Select Duration</Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.description}>
                ⚡ Choose how long you want to mine tokens ⚡
              </Text>

              {/* Duration Selection */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Duration</Text>
                <View style={styles.optionsGrid}>
                  {DURATION_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.hours}
                      onPress={() => setSelectedDuration(option.hours)}
                      style={styles.optionButton}
                    >
                      {selectedDuration === option.hours ? (
                        <LinearGradient
                          colors={['#8B5CF6', '#3B82F6']}
                          style={styles.optionGradient}
                        >
                          <Text style={styles.optionTextSelected}>{option.label}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.optionOutline}>
                          <Text style={styles.optionText}>{option.label}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Multiplier Selection */}
              <View style={styles.section}>
                <View style={styles.sectionLabelRow}>
                  <Zap size={16} color="#FBBF24" />
                  <Text style={styles.sectionLabel}>Multiplier (Boost Mining Speed)</Text>
                </View>
                <View style={styles.optionsGrid}>
                  {MULTIPLIER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => setSelectedMultiplier(option.value)}
                    >
                      <Card style={StyleSheet.flatten([
                        styles.multiplierCard,
                        selectedMultiplier === option.value && styles.multiplierCardSelected
                      ])}>
                        <CardContent style={styles.multiplierContent}>
                          <Text style={styles.multiplierValue}>{option.value}x</Text>
                          <Text style={styles.multiplierLabel}>{option.label}</Text>
                        </CardContent>
                      </Card>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.hint}>
                  Higher multipliers increase token generation rate
                </Text>
              </View>

              {/* Estimated Reward */}
              <Card style={styles.rewardCard}>
                <CardContent style={styles.rewardContent}>
                  <Text style={styles.rewardLabel}>Estimated Reward</Text>
                  <View style={styles.rewardRow}>
                    <Text style={styles.rewardAmount}>{calculateReward()}</Text>
                    <Text style={styles.rewardToken}>TOKENS</Text>
                  </View>
                  <View style={styles.rewardDetails}>
                    <Text style={styles.rewardDetail}>Duration: {selectedDuration} hours</Text>
                    <Text style={styles.rewardDetail}>Multiplier: {selectedMultiplier}x</Text>
                    <Text style={styles.rewardDetail}>Rate: {(0.01 * selectedMultiplier).toFixed(4)} tokens/sec</Text>
                  </View>
                </CardContent>
              </Card>

              {/* Start Button */}
              <Button
                onPress={handleStart}
                gradient={['#FBBF24', '#F97316']}
                style={styles.startButton}
              >
                <View style={styles.buttonContent}>
                  <PlayCircle size={16} color="#000000" />
                  <Text style={styles.startButtonText}>Start Mining</Text>
                </View>
              </Button>
            </ScrollView>
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
    maxHeight: '90%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.6)',
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 12,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  optionOutline: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 8,
  },
  optionTextSelected: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  multiplierCard: {
    minWidth: 100,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  multiplierCardSelected: {
    borderColor: '#FBBF24',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  multiplierContent: {
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  multiplierValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  multiplierLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  rewardCard: {
    borderColor: 'rgba(251, 191, 36, 0.3)',
    backgroundColor: 'rgba(120, 53, 15, 0.2)',
    marginBottom: 24,
  },
  rewardContent: {
    padding: 16,
    gap: 8,
  },
  rewardLabel: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  rewardAmount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: '#FBBF24',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rewardToken: {
    fontSize: 16,
    color: '#FBBF24',
  },
  rewardDetails: {
    gap: 4,
  },
  rewardDetail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  startButton: {
    marginBottom: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
});
