const mongoose = require('mongoose');

/**
 * RankingCache — Stores the last AI repository-ranking result per user.
 * One document per user; overwritten on each fresh analysis.
 *
 * Cache key = userId + latestRepoUpdatedAt. If a re-analysis request finds
 * the same latestRepoUpdatedAt as what's stored, no repo has changed since
 * the last run and the stored result is returned without calling the AI.
 */
const rankingCacheSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    githubUsername: {
      type: String,
      required: true,
    },
    latestRepoUpdatedAt: {
      type: Date,
      required: true,
    },
    repoCount: {
      type: Number,
      default: 0,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('RankingCache', rankingCacheSchema);
