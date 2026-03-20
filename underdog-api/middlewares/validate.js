const { celebrate, Joi, Segments } = require('celebrate');

// ================================
// Validation for POST /signup
// ================================
const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

// ================================
// Validation for POST /signin
// ================================
const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateItemBody = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(120).required(),
    date: Joi.string().required(),
    venue: Joi.string().min(2).max(120).required(),
    city: Joi.string().min(2).max(60).required(),
    state: Joi.string().length(2).required(),
    url: Joi.string().uri().required(),
  }),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(),
  }),
});


module.exports = {
  validateSignup,
  validateSignin,
  validateItemBody,
  validateItemId,
};
