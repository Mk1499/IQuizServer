import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const challengeSchema = new Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Assuming you have a Question model
        required: true,
      },
    ],
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: Date,
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'finished'],
      default: 'pending',
    },
    pointsCost: {
      type: Number,
      default: 10,
    },
    pointsReward: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Challenge', challengeSchema);
