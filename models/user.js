const { Schema, model } = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const { handleSchemaValidationErrors } = require('../helpers');

const emailRegexp = /^[\w.]+@[\w]+.[\w]+$/;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: emailRegexp,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Set password for user'],
    },
    avatarURL: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: '',
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post('save', handleSchemaValidationErrors);

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const registerSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  repeat_password: Joi.ref('password'),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const verifyEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const schemas = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
};

const User = model('user', userSchema);

module.exports = {
  User,
  schemas,
};
