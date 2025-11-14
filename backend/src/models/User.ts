import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  totalTokens: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
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
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
