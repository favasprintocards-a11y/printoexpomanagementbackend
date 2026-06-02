const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Reseller', 'Customer'],
      required: [true, 'Visitor type is required'],
    },
    companyName: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^\d{7,15}$/, 'Mobile must be numeric (7-15 digits)'],
    },
    location: {
      type: String,
      trim: true,
    },
    dateTime: {
      type: Date,
      required: [true, 'Date and time is required'],
      default: Date.now,
    },
    expoName: {
      type: String,
      trim: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', visitorSchema);
