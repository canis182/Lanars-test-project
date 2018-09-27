const { User } = require("../models/user");
const Joi = require("joi");
const schema = require("../../validataSchemas");

module.exports = class Items {
  static async createItem(data) {
    try {
      await Joi.validate(
        data.newItemData,
        schema.validateSchemaFromCreateItem,
        {
          abortEarly: false
        }
      );
        



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
    }
  }
};
