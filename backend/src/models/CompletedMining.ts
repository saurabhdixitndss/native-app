import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedMining extends Document {
  sessionId: string;
  walletAddress: string;
  tokensEarned: number;
  completedAt: Date;
  notified: boolean;
  claimed: boolean;
}

const CompletedMiningSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  walletAddress: {
    type: String,
    required: true,
    index: true,
  },
  tokensEarned: {
    type: Number,
    required: true,
  },
  completedAt: {
    type: Date,
    default: Date.now,
  },
  notified: {
    type: Boolean,
    default: false,
  },
  claimed: {
    type: Boolean,
    default: false,
  },
});

// Compound index for efficient queries
CompletedMiningSchema.index({ walletAddress: 1, claimed: 1 });
CompletedMiningSchema.index({ notified: 1, claimed: 1 });

export default mongoose.model<ICompletedMining>('CompletedMining', CompletedMiningSchema);
