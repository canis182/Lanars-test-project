const { User } = require("../models/user");
const Joi = require("joi");
const schema = require("../../validataSchemas");
const crypto = require("crypto");
const configHash = require("../../configs/hash");
const tokenService = require("../servises/tokenService");

module.exports = class Users {
  static async registrationUser(userData) {
    try {
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
        return [
          {
            status: 422
          },
          {
            field: `email`,
            message: `Sorry! But user under this email: ${email} exist!`
          }
        ];
      }

      const hash = crypto.createHash(configHash.algorithm);
      hash.setEncoding("hex");
      // the text that you want to hash
      hash.write(password);
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
      const token = await tokenService.accessToken(createdUser.dataValues);

      return token;
    } catch (err) {
      if (err.isJoi === true) {
        const arrError = [];

        err.details.forEach(someErr => {
          const objError = {};
          objError.field = someErr.path[0];
          objError.message = someErr.message;
          arrError.push(objError);
        });

        return [
          {
            status: 422
          },
          arrError
        ];
      }

      return [
        {},
        {
          message: err.message
        }
      ];
    }
  }

  static async authorization(userData) {
    try {
      const { email, password } = await Joi.validate(
        userData,
        schema.validateSchemaFromAuthorization,
        { abortEarly: false }
      );
      const searchUserFromDb = await User.findOne({ where: { email: email } });

      if (searchUserFromDb === null) {
        return [
          {
            status: 422
          },
          {
            field: `email`,
            message: `Sorry! But user under this email: ${email} in not exist!`
          }
        ];
      }
      const hash = crypto.createHash(configHash.algorithm);
      hash.setEncoding("hex");
      hash.write(password);
      hash.end();

      const hashPass = hash.read();
      if (hashPass !== searchUserFromDb.dataValues.password) {
        return [
          {
            status: 422
          },
          {
            field: "password",
            message: "Wrong password"
          }
        ];
      }
      const token = await tokenService.accessToken(searchUserFromDb.dataValues);
      return token;
    } catch (err) {
      if (err.isJoi === true) {
        const arrError = [];

        err.details.forEach(someErr => {
          const objError = {};
          objError.field = someErr.path[0];
          objError.message = someErr.message;
          arrError.push(objError);
        });

        return [
          {
            status: 422
          },
          arrError
        ];
      }

      return [
        {
          status: 500
        },
        {
          message: err.message
        }
      ];
    }
  }

  static async getCurrentUser(userData) {
    try {
      const searchUserData = await User.findOne({
        where: { email: userData.email }
      });

      if (searchUserData === null) {
        return {
          status: 404
        }
      }
      return {
        id: searchUserData.id,
        phone: searchUserData.phone,
        name: searchUserData.name,
        email: searchUserData.email
      };
    } catch (err) {
      return {
        status: 401
      };
    }
  }

  static async updateCurrentUser(userData) {
    try {
      const data = await Joi.validate(
        userData.newUserData,
        schema.validateSchemaFromUpdateCurrentUser
      );
      if (
        data.current_password === undefined &&
        data.new_password === undefined
      ) {
        return [
          {
            status: 404
          },
          {
            field: new_password,
            message: "required"
          }
        ];
      }
      User.findOne({
        where: { email: userData.dataUserFromToken.email }
      }).then(user => {
        for (var key in data) {
          if (data[key] !== undefined) {
            if (key === "current_password") {
              let hash = crypto.createHash(configHash.algorithm);
              hash.setEncoding("hex");
              hash.write(data[key]);
              hash.end();
              const hashPass = hash.read();
              if (hashPass !== userData.dataUserFromToken.password) {
                throw [
                  ({
                    status: 422
                  },
                  {
                    field: key,
                    message: `password in the field:${key} wrong`
                  })
                ];
              }
              continue;
            } else if (key === "new_password") {
              let hash = crypto.createHash(configHash.algorithm);
              hash.setEncoding("hex");
              hash.write(data[key]);
              hash.end();
              key = "password";
              data[key] = hash.read();
              if (data[key] === userData.dataUserFromToken.password) {
                throw [
                  ({
                    status: 422
                  },
                  {
                    field: "new_password",
                    message: `Passwords can not be the same`
                  })
                ];
              }
            }
            new Promise(resolve => {
              resolve(
                user.update({ [key]: data[key] }, { fields: [`${key}`] })
              );
            })
              .then(user => {
                return user.dataValues;
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      });
    } catch (err) {
      if (err.isJoi === true) {
        return [
          {
            status: 422
          }
        ];
      }
      return [
        {
          status: 404
        }
      ];
    }
  }

  static async getUserById(userData) {
    try {
      const searchUserData = await User.findOne({
        where: { id: userData }
      });
      
      if (searchUserData === null) {
        return {
          status: 404
        }
      }

      return {
        id: searchUserData.id,
        phone: searchUserData.phone,
        name: searchUserData.name,
        email: searchUserData.email
      };
    } catch (err) {
      return {
        status: 404
      };
    }
  }

  static async searchUser(searchData) {
    try {
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
        })
          .then(usersArr => {
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
          })
          .catch(err => {
            return {
              status: 500
            };
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
    } catch (err) {
      if (err.isJoi === true) {
        return {
          status: 422
        };
      }
      return {
        status: 404
      };
    }
  }

  
  
};
