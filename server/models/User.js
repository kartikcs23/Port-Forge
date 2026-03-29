const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema — Stores registered user accounts.
 * Passwords are hashed via bcrypt before saving.
 * Supports local auth (email + password) and OAuth (GitHub / LinkedIn).
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      // Not required — OAuth users won't have a password
      minlength: 6,
      select: false, // Never returned in queries by default
    },
    githubId: {
      type: String,
      default: null,
    },
    linkedinId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String, // URL
      default: null,
    },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

/**
 * Pre-save hook — Hash the password before persisting to DB.
 * Only runs if the password field has been modified (or is new).
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * matchPassword — Instance method to compare a candidate password
 * against the stored bcrypt hash.
 * @param {string} candidatePassword — plain-text password to verify
 * @returns {boolean} true if passwords match
 */
userSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
