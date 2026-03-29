const mongoose = require('mongoose');

/**
 * Portfolio Schema — Stores portfolio configuration for each user.
 * Each portfolio has a unique slug used for the public URL.
 */
const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      required: [true, 'Portfolio slug is required'],
      trim: true,
      lowercase: true,
    },
    theme: {
      type: String,
      default: 'default',
    },
    published: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    customDomain: {
      type: String,
      default: null,
    },
    lastSynced: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
