const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Invalid email',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true, // ✅ adds createdAt + updatedAt automatically
  }
);

// ================================
// Login helper
// ================================
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Invalid email or password');
        }

        return user;
      });
    });
};

module.exports = mongoose.model('User', userSchema);
