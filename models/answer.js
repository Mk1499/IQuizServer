import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    label: String,
    type: {
      type: String,
      default: 'choose',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Answer', answerSchema);
