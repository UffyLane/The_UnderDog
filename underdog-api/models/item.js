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

// Prevents the same user from saving the same event twice. The controller
// already returns a 409 for duplicates, but it relied on this index existing
// without actually defining it.
itemSchema.index({ owner: 1, url: 1 }, { unique: true });

module.exports = mongoose.model('Item', itemSchema);
