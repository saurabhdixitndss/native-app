import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SignupScreen } from './src/components/SignupScreen';
import { HomeScreen } from './src/components/HomeScreen';
import { SelectDurationPopup } from './src/components/SelectDurationPopup';
import { MiningScreen } from './src/components/MiningScreen';
import { ClaimPopup } from './src/components/ClaimPopup';

export interface UserData {
  walletAddress: string;
  balance: number;
}

export interface MiningSession {
  duration: number;
  multiplier: number;
  startTime: number;
  endTime: number;
  baseRate: number;
  status: 'idle' | 'mining' | 'completed';
  minedTokens: number;
}

function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [miningSession, setMiningSession] = useState<MiningSession | null>(null);
  const [showDurationPopup, setShowDurationPopup] = useState(false);
  const [showClaimPopup, setShowClaimPopup] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('cryptoMinerUser');
      const savedSession = await AsyncStorage.getItem('cryptoMinerSession');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      if (savedSession) {
        const session = JSON.parse(savedSession);
        const now = Date.now();
        
        if (session.status === 'mining') {
          if (now >= session.endTime) {
            session.status = 'completed';
            session.minedTokens = (session.duration * session.baseRate * session.multiplier);
          }
          setMiningSession(session);
        } else if (session.status === 'completed') {
          setMiningSession(session);
          setShowClaimPopup(true);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      AsyncStorage.setItem('cryptoMinerUser', JSON.stringify(user));
    }
  }, [user]);

  useEffect(() => {
    if (miningSession) {
      AsyncStorage.setItem('cryptoMinerSession', JSON.stringify(miningSession));
    } else {
      AsyncStorage.removeItem('cryptoMinerSession');
    }
  }, [miningSession]);

  const handleSignup = (walletAddress: string) => {
    const newUser: UserData = {
      walletAddress,
      balance: 0,
    };
    setUser(newUser);
  };

  const handleStartMining = (durationHours: number, multiplier: number) => {
    const durationSeconds = durationHours * 3600;
    const now = Date.now();
    
    const newSession: MiningSession = {
      duration: durationSeconds,
      multiplier,
      startTime: now,
      endTime: now + (durationSeconds * 1000),
      baseRate: 0.01,
      status: 'mining',
      minedTokens: 0,
    };
    
    setMiningSession(newSession);
    setShowDurationPopup(false);
  };

  const handleCancelMining = () => {
    setMiningSession(null);
  };

  const handleMiningComplete = (minedTokens: number) => {
    if (miningSession) {
      setMiningSession({
        ...miningSession,
        status: 'completed',
        minedTokens,
      });
      setShowClaimPopup(true);
    }
  };

  const handleClaimReward = () => {
    if (user && miningSession) {
      setUser({
        ...user,
        balance: user.balance + miningSession.minedTokens,
      });
      setMiningSession(null);
      setShowClaimPopup(false);
      setTimeout(() => setShowDurationPopup(true), 300);
    }
  };

  if (!user) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <SignupScreen onSignup={handleSignup} />
      </SafeAreaProvider>
    );
  }

  if (miningSession?.status === 'mining') {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <MiningScreen
          session={miningSession}
          onComplete={handleMiningComplete}
          onCancel={handleCancelMining}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <HomeScreen
        user={user}
        miningStatus={miningSession?.status || 'idle'}
        onStartMining={() => setShowDurationPopup(true)}
        onClaimRewards={() => setShowClaimPopup(true)}
        hasRewardsToClaim={miningSession?.status === 'completed'}
      />
      
      {showDurationPopup && (
        <SelectDurationPopup
          visible={showDurationPopup}
          onClose={() => setShowDurationPopup(false)}
          onStartMining={handleStartMining}
        />
      )}
      
      {showClaimPopup && miningSession?.status === 'completed' && (
        <ClaimPopup
          minedTokens={miningSession.minedTokens}
          onClaim={handleClaimReward}
        />
      )}
    </SafeAreaProvider>
  );
}

export default App;
