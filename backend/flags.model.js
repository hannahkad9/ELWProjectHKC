import mongoose from 'mongoose';

const flagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

export const flagModel = model('Flag', flagSchema);