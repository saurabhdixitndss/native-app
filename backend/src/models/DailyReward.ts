import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyReward extends Document {
  walletAddress: string;
  amount: number;
  claimedAt: Date;
  date: string; // Format: YYYY-MM-DD
}

const DailyRewardSchema: Schema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: String,
    required: true,
    index: true,
  },
});

// Compound index for efficient queries
DailyRewardSchema.index({ walletAddress: 1, date: 1 });

export default mongoose.model<IDailyReward>('DailyReward', DailyRewardSchema);
