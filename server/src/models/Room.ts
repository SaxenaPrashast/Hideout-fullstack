import mongoose, { Schema, Model } from 'mongoose';
import { IRoom } from '../types';

const roomSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

roomSchema.index({ members: 1 });

const Room: Model<IRoom> = mongoose.model<IRoom>('Room', roomSchema);

export default Room;
