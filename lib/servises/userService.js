const { User } = require("../models");
const schema = require("../../validateSchemas");
const configHash = require("../../configs/hash");
const tokenService = require("../servises/tokenService");

const crypto = require("crypto");
const Joi = require("joi");

module.exports = class UserService {
  static async registrationUser(userData) {
    const newUserData = {
      name: userData.name.replace(/^\w/, e => e.toUpperCase()),
      email: userData.email,
      password: userData.password,
      phone: userData.phone
    };
    const { name, email, phone, password } = await Joi.validate(
      newUserData,
      schema.validateSchemaFromRegistrationData,
      { abortEarly: false }
    );
    // Checks if there is a user in the database.
    // If the email is already registered -> error
    const data = await User.findOne({ where: { email: userData.email } });

    if (data !== null) {
      throw [
        {
          field: `email`,
          message: `Sorry! But user under this email: ${email} exist!`
        }
      ];
    }
    // This function encrypts the password
    const passHash = UserService._hashString(password);

    await User.create({
      name: name,
      email: email,
      password: passHash,
      phone: phone
    });
    const createdUser = await User.findOne({ where: { email: email } });
    const token = await tokenService.accessToken(createdUser.dataValues);

    return token;
  }

  static async authorization(userData) {
    const { email, password } = await Joi.validate(
      userData,
      schema.validateSchemaFromAuthorization,
      { abortEarly: false }
    );
    // Checks if there is a user in the database.
    // If the email is not already registered -> error
    const searchUserFromDb = await User.findOne({ where: { email: email } });

    if (searchUserFromDb === null) {
      throw [
        {
          field: `email`,
          message: `Sorry! But user under this email: ${email} in not exist!`
        }
      ];
    }
    // This function encrypts the password
    const hashPass = UserService._hashString(password);

    if (hashPass !== searchUserFromDb.dataValues.password) {
      throw [
        {
          field: "password",
          message: "Wrong password"
        }
      ];
    }
    const token = await tokenService.accessToken(searchUserFromDb.dataValues);
    return token;
  }

  static async searchUser(userData) {
    const { dataValues: user } = await User.findOne({
      where: { id: userData.id },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }
    });

    if (user === null) {
      throw {
        status: 404
      };
    }

    return user;
  }

  static async updateUser(user, data) {
    const userData = await Joi.validate(
      data,
      schema.validateSchemaFromUpdateCurrentUser,
      { abortEarly: false }
    );
    const currentUser = await User.findOne({ where: { id: user.id } });
    // Email Block
    if (userData.email !== currentUser.email) {
      const userSearchByEmail = await User.findOne({
        where: { email: userData.email },
        attributes: ["email"]
      });
      if (
        userSearchByEmail !== null &&
        userSearchByEmail.email !== currentUser.email
      ) {
        throw [
          {
            field: "email",
            message: `User under this email: ${userData.email} exist!`
          }
        ];
      }
    }
    // Password Block
    if (!userData.current_password && userData.new_password) {
      throw [
        {
          field: "new_password",
          message:
            'Field "current_password" is required when you want to change the password'
        }
      ];
    }

    const realPassword = currentUser.password;
    if (userData.current_password) {
      const hashedCurrentPassword = UserService._hashString(
        userData.current_password
      );

      if (realPassword !== hashedCurrentPassword) {
        throw [
          {
            field: "current_password",
            message: "Incorrect current password"
          }
        ];
      }

      // Everything is Ok
      if (userData.new_password) {
        userData.password = UserService._hashString(userData.new_password);
      }
    }

    await currentUser.update(userData);

    return await User.findOne({
      where: {
        id: user.id
      },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }
    });
  }

  static async searchUserById(userData) {
    const user = await User.findOne({
      where: { id: userData },
      attributes: { exclude: ["password", "createdAt", "updatedAt"] }
    });

    if (user === null) {
      throw {};
    }

    return user.dataValues;
  }

  static async searchUserByUrl(searchData) {
    const { name, email } = await Joi.validate(
      searchData,
      schema.validateSchemaFromSearchUser
    );

    if (email === undefined) {
      const searchUser = await User.findAll({
        where: { name: name },
        attributes: { exclude: ["password", "createdAt", "updatedAt"] }
      });
      if (searchUser === null) {
        throw {
          status: 404
        };
      }
    }
    if (name === undefined) {
      const searchUser = await User.findOne({
        where: { email: email },
        attributes: { exclude: ["password", "created_at", "updated_at"] }
      });
      if (searchUser === null) {
        throw {
          status: 404
        };
      }
      return searchUser;
    }

    const searchUser = await User.findOne({
      where: { name: name, email: email },
      attributes: { exclude: ["password", "created_at", "updated_at"] }
    });
    if (searchUser === null) {
      throw {
        status: 404
      };
    }
    return searchUser;
  }
  // This function encrypts the password
  static _hashString(str) {
    const hash = crypto.createHash(configHash.algorithm);
    hash.update(str);
    return hash.digest("hex");
  }
};
