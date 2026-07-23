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
    language: {
      type: String,
      default: '',
    },
    languages: {
      type: [String],
      default: [],
    },
    score: {
      type: Number,
      default: 0,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    // Explicit user-chosen position among pinned projects (0 = first).
    // This is what actually decides top-project order in the public
    // portfolio — not score or AI rank. Null when not pinned.
    pinnedOrder: {
      type: Number,
      default: null,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    repoUrl: {
      type: String,
      default: '',
    },
    topics: {
      type: [String],
      default: [],
    },
    githubCreatedAt: {
      type: Date,
      default: null,
    },
    githubUpdatedAt: {
      type: Date,
      default: null,
    },
    readmeLength: {
      type: Number,
      default: 0,
    },
    totalCommits: {
      type: Number,
      default: 0,
    },
    isFork: {
      type: Boolean,
      default: false,
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
    // True when this repo belongs to someone else and the user contributed
    // as a collaborator, rather than being the repo's owner.
    isCollaboration: {
      type: Boolean,
      default: false,
    },
    contributionCommits: {
      type: Number,
      default: 0,
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
