import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: String,
});

export default mongoose.model('Category',categorySchema);
