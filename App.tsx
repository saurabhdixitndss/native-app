import React, { useState, useEffect } from 'react';
import { StatusBar, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from './src/components/SplashScreen';
import { SignupScreen } from './src/components/SignupScreen';
import { HomeScreen } from './src/components/HomeScreen';
import { SelectDurationPopup } from './src/components/SelectDurationPopup';
import { MiningScreen } from './src/components/MiningScreen';
import { ClaimPopup } from './src/components/ClaimPopup';
import { authAPI, miningAPI, configAPI, User, MiningSession, Config } from './src/services/api';

type AppScreen = 'splash' | 'signup' | 'home' | 'mining';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [miningSession, setMiningSession] = useState<MiningSession | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [showDurationPopup, setShowDurationPopup] = useState(false);
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const configData = await configAPI.getConfig();
      setConfig(configData);
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const handleSplashFinish = async () => {
    try {
      const savedWallet = await AsyncStorage.getItem('walletAddress');
      
      if (savedWallet) {
        await loadUserData(savedWallet);
      } else {
        setCurrentScreen('signup');
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      setCurrentScreen('signup');
    }
  };

  const loadUserData = async (walletAddress: string) => {
    try {
      setLoading(true);
      
      const [balanceData, sessionData] = await Promise.all([
        authAPI.getBalance(walletAddress),
        miningAPI.getActiveSession(walletAddress),
      ]);

      setUser({
        walletAddress: balanceData.walletAddress,
        totalTokens: balanceData.totalTokens,
      });

      if (sessionData.session) {
        setMiningSession(sessionData.session);
        setCurrentScreen('mining');
      } else {
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setCurrentScreen('home');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (walletAddress: string) => {
    try {
      setLoading(true);
      
      const response = await authAPI.signup(walletAddress);
      
      await AsyncStorage.setItem('walletAddress', walletAddress);
      
      setUser({
        walletAddress: response.user.walletAddress,
        totalTokens: response.user.totalTokens,
      });

      const sessionData = await miningAPI.getActiveSession(walletAddress);
      
      if (sessionData.session) {
        setMiningSession(sessionData.session);
        setCurrentScreen('mining');
      } else {
        setCurrentScreen('home');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Failed to signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartMining = async (durationHours: number, multiplier: number) => {
    if (!user) return;

    try {
      setLoading(true);
      
      const response = await miningAPI.startMining(
        user.walletAddress,
        durationHours,
        multiplier
      );

      setMiningSession(response.session);
      setShowDurationPopup(false);
      setCurrentScreen('mining');
    } catch (error: any) {
      console.error('Start mining error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to start mining');
    } finally {
      setLoading(false);
    }
  };

  const handleMiningComplete = () => {
    setShowClaimPopup(true);
  };

  const handleClaimReward = async () => {
    if (!miningSession || !user) return;

    try {
      setLoading(true);
      
      const response = await miningAPI.claimReward(miningSession._id);

      setUser({
        ...user,
        totalTokens: response.newBalance,
      });

      setMiningSession(null);
      setShowClaimPopup(false);
      setCurrentScreen('home');

      setTimeout(() => {
        setShowDurationPopup(true);
      }, 500);
    } catch (error: any) {
      console.error('Claim error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to claim reward');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMining = async () => {
    if (!miningSession) return;

    Alert.alert(
      'Cancel Mining',
      'Are you sure you want to cancel? You will lose all progress.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              await miningAPI.cancelMining(miningSession._id);
              setMiningSession(null);
              setCurrentScreen('home');
            } catch (error) {
              console.error('Cancel error:', error);
            }
          },
        },
      ]
    );
  };

  const handleUpgradeMultiplier = async (newMultiplier: number) => {
    if (!miningSession) return;

    try {
      setLoading(true);
      
      const response = await miningAPI.upgradeMultiplier(
        miningSession._id,
        newMultiplier
      );

      setMiningSession(response.session);
      Alert.alert('Success', `Multiplier upgraded to ${newMultiplier}×!`);
    } catch (error: any) {
      console.error('Upgrade error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to upgrade multiplier');
    } finally {
      setLoading(false);
    }
  };

  if (currentScreen === 'splash') {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <SplashScreen onFinish={handleSplashFinish} />
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'signup') {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <SignupScreen onSignup={handleSignup} loading={loading} />
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'mining' && miningSession) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <MiningScreen
          session={miningSession}
          config={config}
          onComplete={handleMiningComplete}
          onCancel={handleCancelMining}
          onUpgradeMultiplier={handleUpgradeMultiplier}
        />
        {showClaimPopup && (
          <ClaimPopup
            minedTokens={miningSession.totalEarned}
            onClaim={handleClaimReward}
            loading={loading}
          />
        )}
      </SafeAreaProvider>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('walletAddress');
      setUser(null);
      setMiningSession(null);
      setCurrentScreen('signup');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <HomeScreen
        user={user}
        onStartMining={() => setShowDurationPopup(true)}
        onRefresh={() => user && loadUserData(user.walletAddress)}
        onLogout={handleLogout}
      />
      
      {showDurationPopup && config && (
        <SelectDurationPopup
          visible={showDurationPopup}
          config={config}
          onClose={() => setShowDurationPopup(false)}
          onStartMining={handleStartMining}
          loading={loading}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
