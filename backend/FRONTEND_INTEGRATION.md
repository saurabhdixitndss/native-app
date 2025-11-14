# Frontend Integration Guide

## API Base URL Configuration

In your React Native app, create an API configuration file:

```typescript
// src/config/api.ts
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-api.com/api';  // Production

// For Android emulator, use: http://10.0.2.2:3000/api
// For iOS simulator, use: http://localhost:3000/api
```

## API Service Example

```typescript
// src/services/api.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: (walletAddress: string) =>
    api.post('/auth/signup', { walletAddress }),
  
  getBalance: (walletAddress: string) =>
    api.get(`/auth/balance/${walletAddress}`),
};

export const miningAPI = {
  startMining: (walletAddress: string, selectedHour: number, multiplier: number = 1) =>
    api.post('/mining/start', { walletAddress, selectedHour, multiplier }),
  
  getActiveSession: (walletAddress: string) =>
    api.get(`/mining/active/${walletAddress}`),
  
  getMiningStatus: (sessionId: string) =>
    api.get(`/mining/status/${sessionId}`),
  
  updateProgress: (sessionId: string, currentMiningPoints: number, totalEarned: number) =>
    api.put(`/mining/progress/${sessionId}`, { currentMiningPoints, totalEarned }),
  
  upgradeMultiplier: (sessionId: string, newMultiplier: number) =>
    api.put(`/mining/upgrade/${sessionId}`, { newMultiplier }),
  
  claimReward: (sessionId: string) =>
    api.post(`/mining/claim/${sessionId}`),
  
  cancelMining: (sessionId: string) =>
    api.post(`/mining/cancel/${sessionId}`),
  
  getHistory: (walletAddress: string) =>
    api.get(`/mining/history/${walletAddress}`),
};

export const configAPI = {
  getConfig: () => api.get('/config'),
};

export default api;
```

## Usage in Components

### SignupScreen Example

```typescript
import { authAPI } from '../services/api';

const handleSignup = async (walletAddress: string) => {
  try {
    const response = await authAPI.signup(walletAddress);
    const { user, isNewUser } = response.data;
    
    // Store user data in AsyncStorage or state management
    await AsyncStorage.setItem('walletAddress', user.walletAddress);
    
    // Navigate to home screen
    navigation.navigate('Home');
  } catch (error) {
    console.error('Signup error:', error);
    Alert.alert('Error', 'Failed to signup');
  }
};
```

### HomeScreen Example

```typescript
import { authAPI, miningAPI } from '../services/api';

const HomeScreen = () => {
  const [balance, setBalance] = useState(0);
  const [activeSession, setActiveSession] = useState(null);
  const walletAddress = 'user_wallet_address';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balanceRes, sessionRes] = await Promise.all([
        authAPI.getBalance(walletAddress),
        miningAPI.getActiveSession(walletAddress),
      ]);
      
      setBalance(balanceRes.data.totalTokens);
      setActiveSession(sessionRes.data.session);
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const handleStartMining = async (selectedHour: number) => {
    try {
      const response = await miningAPI.startMining(
        walletAddress,
        selectedHour,
        1
      );
      
      setActiveSession(response.data.session);
      navigation.navigate('Mining', { session: response.data.session });
    } catch (error) {
      console.error('Start mining error:', error);
    }
  };

  return (
    <View>
      <Text>Balance: {balance} tokens</Text>
      {activeSession ? (
        <Button title="Continue Mining" onPress={() => {
          navigation.navigate('Mining', { session: activeSession });
        }} />
      ) : (
        <Button title="Start Mining" onPress={() => {
          // Show duration selection popup
        }} />
      )}
    </View>
  );
};
```

### MiningScreen Example

```typescript
import { miningAPI, configAPI } from '../services/api';

const MiningScreen = ({ route }) => {
  const { session } = route.params;
  const [currentReward, setCurrentReward] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    loadConfig();
    const interval = setInterval(updateMiningProgress, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadConfig = async () => {
    const response = await configAPI.getConfig();
    setConfig(response.data);
  };

  const updateMiningProgress = async () => {
    try {
      const response = await miningAPI.getMiningStatus(session._id);
      const { status } = response.data;
      
      setCurrentReward(status.currentReward);
      setRemainingTime(status.remainingSeconds);
      
      // Update backend every 10 seconds
      if (Date.now() % 10000 < 1000) {
        await miningAPI.updateProgress(
          session._id,
          status.currentReward,
          status.currentReward
        );
      }
      
      // Check if mining is complete
      if (status.isComplete) {
        // Show claim button
      }
    } catch (error) {
      console.error('Update progress error:', error);
    }
  };

  const handleUpgradeMultiplier = async (newMultiplier: number) => {
    try {
      await miningAPI.upgradeMultiplier(session._id, newMultiplier);
      // Reload session data
    } catch (error) {
      console.error('Upgrade error:', error);
    }
  };

  const handleClaim = async () => {
    try {
      const response = await miningAPI.claimReward(session._id);
      Alert.alert('Success', `Claimed ${response.data.claimedAmount} tokens!`);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Claim error:', error);
    }
  };

  return (
    <View>
      <Text>Mining: {currentReward.toFixed(4)} tokens</Text>
      <Text>Time Remaining: {formatTime(remainingTime)}</Text>
      <Button title="Claim" onPress={handleClaim} disabled={remainingTime > 0} />
    </View>
  );
};
```

## Real-time Mining Calculation (Client-side)

For smoother UI updates, calculate mining progress on the client:

```typescript
const calculateCurrentReward = (
  startTime: string,
  baseRate: number,
  multiplier: number
): number => {
  const start = new Date(startTime);
  const now = new Date();
  const elapsedSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
  const effectiveRate = baseRate * multiplier;
  return effectiveRate * elapsedSeconds;
};

// Use in component
useEffect(() => {
  const interval = setInterval(() => {
    const reward = calculateCurrentReward(
      session.miningStartTime,
      config.baseRate,
      session.multiplier
    );
    setCurrentReward(reward);
  }, 100); // Update every 100ms for smooth animation
  
  return () => clearInterval(interval);
}, [session, config]);
```

## Error Handling

```typescript
import { AxiosError } from 'axios';

const handleAPIError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error
    Alert.alert('Error', error.response.data.message);
  } else if (error.request) {
    // No response received
    Alert.alert('Error', 'Network error. Please check your connection.');
  } else {
    // Other errors
    Alert.alert('Error', 'Something went wrong.');
  }
};
```

## Install Required Packages

```bash
npm install axios
# or
yarn add axios
```

## Testing with Android Emulator

Update API base URL for Android:
```typescript
export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
});
```
