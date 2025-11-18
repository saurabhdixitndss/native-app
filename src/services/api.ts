import axios from 'axios';
import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
  default: 'http://localhost:3000/api',
});

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface User {
  walletAddress: string;
  totalTokens: number;
}

export interface MiningSession {
  _id: string;
  wallet: string;
  createdDate: string;
  multiplier: number;
  status: 'mining' | 'claimed' | 'cancelled';
  miningStartTime: string;
  currentMultiplierStartTime: string;
  totalEarned: number;
  currentMiningPoints: number;
  lastUpdated: string;
  selectedHour: number;
}

export interface MiningStatus {
  elapsedSeconds: number;
  currentReward: number;
  isComplete: boolean;
  remainingSeconds: number;
  canClaim: boolean;
}

export interface Config {
  durations: Array<{ h: number; label: string; seconds: number }>;
  multiplierOptions: Array<{ value: number; label: string; requiresAd: boolean }>;
  baseRate: number;
}

export const authAPI = {
  signup: async (walletAddress: string) => {
    const response = await api.post('/auth/signup', { walletAddress });
    return response.data;
  },

  getBalance: async (walletAddress: string) => {
    const response = await api.get(`/auth/balance/${walletAddress}`);
    return response.data;
  },
};

export const miningAPI = {
  startMining: async (walletAddress: string, selectedHour: number, multiplier: number = 1) => {
    const response = await api.post('/mining/start', {
      walletAddress,
      selectedHour,
      multiplier,
    });
    return response.data;
  },

  getActiveSession: async (walletAddress: string) => {
    const response = await api.get(`/mining/active/${walletAddress}`);
    return response.data;
  },

  getMiningStatus: async (sessionId: string) => {
    const response = await api.get(`/mining/status/${sessionId}`);
    return response.data;
  },

  updateProgress: async (sessionId: string, currentMiningPoints: number, totalEarned: number) => {
    const response = await api.put(`/mining/progress/${sessionId}`, {
      currentMiningPoints,
      totalEarned,
    });
    return response.data;
  },

  upgradeMultiplier: async (sessionId: string, newMultiplier: number) => {
    const response = await api.put(`/mining/upgrade/${sessionId}`, {
      newMultiplier,
    });
    return response.data;
  },

  claimReward: async (sessionId: string) => {
    const response = await api.post(`/mining/claim/${sessionId}`);
    return response.data;
  },

  cancelMining: async (sessionId: string) => {
    const response = await api.post(`/mining/cancel/${sessionId}`);
    return response.data;
  },

  getHistory: async (walletAddress: string) => {
    const response = await api.get(`/mining/history/${walletAddress}`);
    return response.data;
  },
};

export const configAPI = {
  getConfig: async () => {
    const response = await api.get('/config');
    return response.data;
  },
};

export default api;
