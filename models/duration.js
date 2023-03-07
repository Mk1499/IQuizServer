import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const durationSchema = new Schema(
  {
    arName: String,
    enName: String,
    value: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Duration', durationSchema);
