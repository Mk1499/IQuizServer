import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    arName: String,
    enName: String,
    cover: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Category', categorySchema);
