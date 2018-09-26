const Joi = require("joi");

exports.validateSchemaFromRegistrationData = {
    name: Joi.string().regex(/\D/).min(2).max(30)
    .required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    phone: Joi.string().regex(/^\+\d{11}$/),
};
