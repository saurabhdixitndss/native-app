import { Schema, model, Document } from 'mongoose';

export interface IMiningSession extends Document {
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

const MiningSessionSchema = new Schema<IMiningSession>({
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

export const MiningSession = model<IMiningSession>('MiningSession', MiningSessionSchema);
