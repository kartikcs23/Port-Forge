const mongoose = require('mongoose');

/**
 * Project Schema — Stores synced GitHub repository data.
 * Each project belongs to a user and includes scoring metadata.
 */
const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    repoId: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    stars: {
      type: Number,
      default: 0,
    },
    forks: {
      type: Number,
      default: 0,
    },
    languages: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    repoUrl: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
