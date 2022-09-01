const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleSchemaValidationErrors } = require('../helpers');

const emailRegexp = /^[\w.]+@[\w]+.[\w]+$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      unique: true,
    },
    email: {
      type: String,
      required: true,
      match: emailRegexp,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    // owner: {
    //   type: SchemaTypes.ObjectId,
    //   ref: 'user',
    // },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleSchemaValidationErrors);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  phone: Joi.string().required(),
  favorite: Joi.bool(),
});

const updateStatusContactSchema = Joi.object({
  favorite: Joi.bool().required(),
});

const schemas = {
  addSchema,
  updateStatusContactSchema,
};

const Contact = model('contact', contactSchema);

module.exports = Contact;

module.exports = {
  Contact,
  schemas,
};
