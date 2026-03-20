const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      minlength: 2,
      maxlength: 120,
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      minlength: 2,
      maxlength: 120,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      minlength: 2,
      maxlength: 60,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      minlength: 2,
      maxlength: 2,
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
