import mongoose, { Schema, Document } from 'mongoose';

export interface IReferral extends Document {
  referrerWallet: string; // User who referred
  referredWallet: string; // User who was referred
  createdAt: Date;
  totalEarnings: number; // Total 10% earnings from referred user
}

const ReferralSchema: Schema = new Schema({
  referrerWallet: {
    type: String,
    required: true,
    index: true,
  },
  referredWallet: {
    type: String,
    required: true,
    unique: true, // Each user can only be referred once
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
});

// Compound index for efficient queries
ReferralSchema.index({ referrerWallet: 1, referredWallet: 1 });

export default mongoose.model<IReferral>('Referral', ReferralSchema);
