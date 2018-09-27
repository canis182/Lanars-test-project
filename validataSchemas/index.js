const Joi = require("joi");

exports.validateSchemaFromRegistrationData = {
    name: Joi.string().regex(/\D/).min(2).max(30)
    .required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    phone: Joi.string().regex(/^\+\d{11}$/),
};

exports.validateSchemaFromAuthorization = {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
};

exports.validateSchemaFromSearchUser = {
    name: Joi.string().regex(/\D/).min(2).max(30),
    email: Joi.string().email(),
};

exports.validateSchemaFromUpdateCurrentUser = {
    phone: Joi.string().regex(/^\+\d{11}$/),
    name: Joi.string().regex(/\D/).min(2).max(30), 
    email: Joi.string().email().required(), 
    current_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/), 
    new_password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/) 
}


