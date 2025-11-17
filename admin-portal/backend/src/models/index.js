import mongoose from 'mongoose';

// User Schema (from main app) - Enhanced with payment tracking
const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  totalTokens: {
    type: Number,
    default: 0,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending',
  },
  lastPaymentDate: {
    type: Date,
    default: null,
  },
  totalPaid: {
    type: Number,
    default: 0,
  },
  paymentHistory: [{
    amount: Number,
    status: String,
    date: Date,
    transactionId: String,
  }],
}, { timestamps: true });

// Mining Session Schema (from main app)
const miningSessionSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
    index: true,
  },
  createdDate: {
    type: String,
    required: true,
  },
  multiplier: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['mining', 'claimed', 'cancelled'],
    default: 'mining',
  },
  miningStartTime: {
    type: String,
    required: true,
  },
  currentMultiplierStartTime: {
    type: String,
    required: true,
  },
  totalEarned: {
    type: Number,
    default: 0,
  },
  currentMiningPoints: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: String,
    required: true,
  },
  selectedHour: {
    type: Number,
    required: true,
  },
});

// Config Schema (from main app)
const configSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'mining_config',
  },
  durations: [{
    h: { type: Number, required: true },
    label: { type: String, required: true },
    seconds: { type: Number, required: true },
  }],
  multiplierOptions: [{
    value: { type: Number, required: true },
    label: { type: String, required: true },
    requiresAd: { type: Boolean, required: true },
  }],
  baseRate: {
    type: Number,
    required: true,
    default: 0.01,
  },
}, { timestamps: true });

// Export models - these will connect to the existing crypto-miner database
export const User = mongoose.model('User', userSchema);
export const MiningSession = mongoose.model('MiningSession', miningSessionSchema);
export const Config = mongoose.model('Config', configSchema);
