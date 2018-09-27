const { User } = require("../models/user");
const Joi = require("joi");
const schema = require("../../validataSchemas");
const crypto = require("crypto");
const configHash = require("../../configs/hash");
const tokenService = require("../servises/tokenService");

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
    const data = await User.findOne({ where: { email: userData.email } });

    if (data !== null) {
      throw [
        {
          field: `email`,
          message: `Sorry! But user under this email: ${email} exist!`
        }
      ];
    }

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
    const searchUserFromDb = await User.findOne({ where: { email: email } });

    if (searchUserFromDb === null) {
      throw [
        {
          field: `email`,
          message: `Sorry! But user under this email: ${email} in not exist!`
        }
      ];
    }
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

  static async getCurrentUser(userData) {
    const { dataValues: user } = await User.findOne({
      where: { id: userData.id }
    });

    if (user === null) {
      throw {
        status: 404
      };
    }
    delete user.password;
    delete user.createdAt;
    delete user.updatedAt;

    return user;
  }

  static async updateUser(user, data) {
    const options = {
      abortEarly: false
    };
    const userData = await Joi.validate(
      data,
      schema.validateSchemaFromUpdateCurrentUser,
      options
    );

    const currentUser = await User.findOne({ where: { id: user.id } });

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

    const { dataValues: updatedUser } = await User.findOne({
      where: {
        id: user.id
      }
    });

    delete updatedUser.password;
    delete user.createdAt;
    delete user.updatedAt;

    return updatedUser;
  }

  static async getUserById(userData) {
    const user = await User.findOne({
      where: { id: userData }
    });
    if (user === null) {
      throw {};
    }
    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    return user.dataValues;
  }

  static async searchUser(searchData) {
    const { name, email } = await Joi.validate(
      searchData,
      schema.validateSchemaFromSearchUser
    );

    if (email === undefined) {
      const searchUserData = await User.findAll({ where: { name: name } });
      const correctResultSearchUsers = new Promise(resolve => {
        const usersArr = [];
        searchUserData.forEach(obj => {
          usersArr.push(obj.dataValues);
        });
        resolve(usersArr);
      }).then(usersArr => {
        const correctUsersArr = [];
        usersArr.forEach(someUser => {
          const user = {};
          (user.id = someUser.id),
            (user.phone = someUser.phone),
            (user.name = someUser.name),
            (user.email = someUser.email);
          correctUsersArr.push(user);
        });
        return correctUsersArr;
      });

      return correctResultSearchUsers;
    }

    const searchUserData = await User.findOne({ where: { email: email } });

    return {
      id: searchUserData.id,
      phone: searchUserData.phone,
      name: searchUserData.name,
      email: searchUserData.email
    };
  }

  static _hashString(str) {
    const hash = crypto.createHash(configHash.algorithm);
    hash.update(str);
    return hash.digest("hex");
  }
};
