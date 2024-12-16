import mongoose from 'mongoose';

const flagSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

const Flag = mongoose.model('Flag', flagSchema);

