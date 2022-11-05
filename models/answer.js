import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const answerSchema = new Schema(
  {
    label: String,
    type: String
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Answer', answerSchema);
