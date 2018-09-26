const { User } = require('../models/user');
const db = require('../../configs/db');
const Joi = require('joi');
const schema = require('../../validataSchemas');
const crypto = require('crypto');
const configHash = require('../../configs/hash');
const tokenService = require('../servises/tokenService');

module.exports = class Users {
  static async registrationUser(userData) {
    try {
      const newUserData = {
        name: userData.name.replace(/^\w/, e => e.toUpperCase()),
        email: userData.email,
        password: userData.password,
        phone: userData.phone
      };
      const { name, email, phone } = await Joi.validate(
        newUserData,
        schema.validateSchemaFromRegistrationData,
        { abortEarly: false }
      );
      const data = await User.findOne({ where: { email: userData.email } });

      if (data !== null) {
        return {
          status: 422,
          name: `Incorrect email`,
          message: `Sorry! But user under this email: ${email} exist!`
        };
      }

      const hash = crypto.createHash(configHash.algorithm);
      hash.setEncoding("hex");
      // the text that you want to hash
      hash.write(userData.password);
      hash.end();
      // resulting hash
      const passHash = hash.read();
      await User.create({
        name: name,
        email: email,
        password: passHash,
        phone: phone
      });
      const createdUser = await User.findOne({ where: { email: email } });
      const token = await tokenService.accessToken(createdUser);

      return token
    } catch (err) {
      if (err.isJoi === true) {
        return {
          status: 422,
          name: err.name,
          message: err.details
        };
      }
      return {
        status: 500,
        message: err.message
      };
    };
  };

  static async authorization(userData) {
    console.log(userData);
  }
};
