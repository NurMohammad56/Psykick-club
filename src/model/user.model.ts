import { Schema, model, Document, Model } from 'mongoose';
import bcrypt from "bcrypt";

export enum UserTitle {
  MR = 'Mr',
  MRS = 'Mrs',
  MISS = 'Miss',
  OTHER = 'Other'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export interface IUser extends Document {
  email: string;
  userName: string;
  title: UserTitle;
  fullName: string;
  country: string;
  dob: Date;
  password?: string;
  tmcScore: number;
  arvScore: number;
  combinedScore: number;
  leaderboardPosition: number;
  completedTargets: number;
  successRate: number;
  tierRanK: number;
  phoneNumber?: string;
  gender: Gender;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Mongoose Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format']
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    title: {
      type: String,
      enum: Object.values(UserTitle),
      required: true
    },
    fullName: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    dob: {
      type: Date,
      required: true
    },
    password: {
      type: String,
    },
    tierRanK: {
      type: Number,
    },
    tmcScore: {
      type: Number,
      default: 0
    },
    arvScore: {
      type: Number,
      default: 0
    },
    combinedScore: {
      type: Number,
      default: function(this: IUser) {
        return this.tmcScore + this.arvScore;
      }
    },
    leaderboardPosition: {
      type: Number,
      default: 0
    },
    completedTargets: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    phoneNumber: {
      type: String,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, 'Invalid phone number']
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true
    },
  },
  {
    timestamps: true
  }
);

// Password comparison method (bcrypt)
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) {
    throw new Error("Password not set for this user");
  }
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};


export const User: Model<IUser> = model<IUser>('User', userSchema);
