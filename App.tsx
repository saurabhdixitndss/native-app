import React, { useState, useEffect } from 'react';
import { StatusBar, Alert, AppState, AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from './src/components/SplashScreen';
import { SignupScreen } from './src/components/SignupScreen';
import { HomeScreen } from './src/components/HomeScreen';
import { SelectDurationPopup } from './src/components/SelectDurationPopup';
import { MiningScreen } from './src/components/MiningScreen';
import { ClaimScreen } from './src/components/ClaimScreen';
import { authAPI, miningAPI, configAPI, notificationAPI, User, MiningSession, Config } from './src/services/api';
import { 
  configurePushNotifications, 
  startPeriodicCheck, 
  stopPeriodicCheck,
  checkForCompletedMining 
} from './src/services/notificationService';

type AppScreen = 'splash' | 'signup' | 'home' | 'mining' | 'claim';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [miningSession, setMiningSession] = useState<MiningSession | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [showDurationPopup, setShowDurationPopup] = useState(false);
  // Removed showClaimPopup state - using screen navigation instead
  const [loading, setLoading] = useState(false);

  const handleAppStateChange = React.useCallback((nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      // App came to foreground - check for completed mining
      console.log('📱 App came to foreground - checking for completed mining...');
      checkForCompletedMining();
      
      // Also check backend notifications
      if (user) {
        checkPendingNotifications(user.walletAddress);
      }
    }
  }, [user]);

  useEffect(() => {
    loadConfig();
    
    // Configure push notifications
    configurePushNotifications().catch(error => {
      console.error('Error configuring notifications:', error);
    });
    
    // Start periodic checks for completed mining
    startPeriodicCheck();
    
    // Handle app state changes (foreground/background)
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
      stopPeriodicCheck();
    };
  }, [handleAppStateChange]);

  const checkPendingNotifications = async (walletAddress: string) => {
    try {
      const response = await notificationAPI.getPendingNotifications(walletAddress);
      
      if (response.notifications && response.notifications.length > 0) {
        const notification = response.notifications[0];
        
        // Show alert
        Alert.alert(
          '🎉 Mining Complete!',
          notification.message,
          [
            {
              text: 'Claim Now',
              onPress: async () => {
                // Clear notification
                await notificationAPI.clearNotification(notification.sessionId);
                
                // Load session and navigate to claim screen
                const sessionData = await miningAPI.getActiveSession(walletAddress);
                if (sessionData.session) {
                  const statusResponse = await miningAPI.getMiningStatus(sessionData.session._id);
                  setMiningSession({
                    ...sessionData.session,
                    totalEarned: statusResponse.status.currentReward,
                  });
                  setCurrentScreen('claim');
                }
              },
            },
            {
              text: 'Later',
              style: 'cancel',
              onPress: () => {
                // Don't clear notification - will show again next time
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error checking pending notifications:', error);
    }
  };

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
      console.log('Splash finished, checking for saved wallet...');
      const savedWallet = await AsyncStorage.getItem('walletAddress');
      
      if (savedWallet) {
        console.log('Found saved wallet:', savedWallet);
        await loadUserData(savedWallet);
      } else {
        console.log('No saved wallet, showing signup screen');
        setCurrentScreen('signup');
      }
    } catch (error) {
      console.error('Error in handleSplashFinish:', error);
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

      // Store session if exists, but always go to Home Screen
      if (sessionData.session) {
        setMiningSession(sessionData.session);
        console.log('📍 Active session found, stored for later');
        
        // Check if mining is complete
        const statusResponse = await miningAPI.getMiningStatus(sessionData.session._id);
        if (statusResponse.status.isComplete) {
          // Mining complete - check for notifications
          await checkPendingNotifications(walletAddress);
        }
      }

      // Always navigate to Home Screen after login
      setCurrentScreen('home');
    } catch (error) {
      console.error('Error loading user data:', error);
      // If user doesn't exist in backend, go to signup
      await AsyncStorage.removeItem('walletAddress');
      setCurrentScreen('signup');
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

  const handleStartMiningClick = async () => {
    if (!user) return;

    try {
      // Check if there's an active session
      const sessionData = await miningAPI.getActiveSession(user.walletAddress);
      
      if (sessionData.session) {
        // Active session exists - go to mining screen
        console.log('📍 Active session found, navigating to mining screen...');
        setMiningSession(sessionData.session);
        
        // Check if complete
        const statusResponse = await miningAPI.getMiningStatus(sessionData.session._id);
        if (statusResponse.status.isComplete) {
          setMiningSession({
            ...sessionData.session,
            totalEarned: statusResponse.status.currentReward,
          });
          // Navigate to Claim Screen
          setCurrentScreen('claim');
        } else {
          setCurrentScreen('mining');
        }
      } else {
        // No active session - show duration selection
        console.log('🆕 No active session, showing duration selection...');
        setShowDurationPopup(true);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // If error, assume no session and show duration popup
      setShowDurationPopup(true);
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

  const handleMiningComplete = async () => {
    if (!miningSession) return;

    try {
      // Get final calculated tokens from backend
      const statusResponse = await miningAPI.getMiningStatus(miningSession._id);
      
      // Update session with final earned amount
      setMiningSession({
        ...miningSession,
        totalEarned: statusResponse.status.currentReward,
      });
      
      // Navigate to Claim Screen
      setCurrentScreen('claim');
    } catch (error) {
      console.error('Error getting final status:', error);
      setCurrentScreen('claim');
    }
  };

  const handleClaimReward = async () => {
    console.log('🎁 Claim button clicked!');
    console.log('Mining session:', miningSession);
    console.log('User:', user);
    
    if (!miningSession || !user) {
      console.log('❌ Missing session or user');
      Alert.alert('Error', 'Missing session or user data');
      return;
    }

    try {
      setLoading(true);
      console.log('📡 Calling claim API for session:', miningSession._id);
      
      const response = await miningAPI.claimReward(miningSession._id);
      console.log('✅ Claim response:', response);

      // Update user balance
      setUser({
        ...user,
        totalTokens: response.newBalance,
      });

      // Clear session
      setMiningSession(null);

      // Navigate to Home Screen
      setCurrentScreen('home');

      // Show success message
      Alert.alert(
        '🎉 Tokens Added!',
        `${response.claimedAmount.toFixed(2)} tokens added to your balance!\n\nNew balance: ${response.newBalance.toFixed(2)} tokens`,
        [
          {
            text: 'OK',
            onPress: () => {
              // User can click "Start Mining" on Home Screen
              console.log('✅ User can now start new mining from Home Screen');
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Claim error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to claim reward');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    // Just navigate to home, don't cancel mining
    console.log('🏠 Going home, mining continues in background...');
    setCurrentScreen('home');
  };

  const handleUpgradeMultiplier = async (newMultiplier: number) => {
    if (!miningSession) return;

    try {
      setLoading(true);
      
      const response = await miningAPI.upgradeMultiplier(
        miningSession._id,
        newMultiplier
      );

      // Update session with new multiplier
      setMiningSession(response.session);
      
      Alert.alert(
        '🚀 Upgrade Success!',
        `Multiplier upgraded to ${newMultiplier}×!\n\nYour mining rate has increased. Tokens are now being mined faster!`,
        [{ text: 'Awesome!', style: 'default' }]
      );
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
          onGoHome={handleGoHome}
          onUpgradeMultiplier={handleUpgradeMultiplier}
        />
      </SafeAreaProvider>
    );
  }

  if (currentScreen === 'claim' && miningSession) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <ClaimScreen
          minedTokens={miningSession.totalEarned || 0}
          onClaim={handleClaimReward}
          loading={loading}
        />
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
        hasActiveSession={!!miningSession}
        onStartMining={handleStartMiningClick}
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
