const mongoose = require('mongoose');

const expoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Expo name is required'],
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expo', expoSchema);
