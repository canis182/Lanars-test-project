const { User, Item, Img } = require("../models");
const schema = require("../../validataSchemas");

const Joi = require("joi");
const { join } = require("path");
const { unlinkSync, mkdirSync, rmdirSync } = require("fs");

module.exports = class ItemService {
  static async createItem(user, newItem) {
    const correctItem = await Joi.validate(
      newItem,
      schema.validateSchemaFromCreateItem,
      {
        abortEarly: false
      }
    );

    const searchItem = await Item.findOne({
      where: { title: correctItem.title, description: correctItem.description }
    });
    if (searchItem !== null) {
      throw {
        status: 403
      };
    }

    const { dataValues: userData } = await User.findOne({
      where: { id: user.id },
      attributes: ["id"]
    });

    const { dataValues: newCreateItem } = await Item.create({
      title: correctItem.title,
      created_at: Math.floor(Date.now() / 1000),
      description: correctItem.description,
      user_id: userData.id
    });

    return await Item.findOne({
      where: { id: newCreateItem.id },
      attributes: { exclude: ["updated_at"] },
      include: [
        {
          model: User,
          as: "user",
          where: { id: userData.id },
          attributes: { exclude: ["password", "created_at", "updated_at"] }
        }
      ]
    });
  }

  static async deleteItem(user, idItem) {
    const searchItem = await Item.findOne({
      where: { id: idItem }
    });
    if (searchItem === null) {
      throw {
        status: 404
      };
    }
    if (user.id !== searchItem.user_id) {
      throw {
        status: 403
      };
    }
    searchItem.destroy();
    return;
  }

  static async searchItem(idItem) {
    const { dataValues: searchItem } = await Item.findOne({
      where: { id: idItem },
      attributes: ["user_id"]
    });

    if (searchItem === null) {
      throw {
        status: 404
      };
    }

    return await Item.findOne({
      where: { id: idItem },
      attributes: { exclude: ["updated_at"] },
      include: [
        {
          model: User,
          as: "user",
          where: { id: searchItem.user_id },
          attributes: { exclude: ["password", "created_at", "updated_at"] }
        }
      ]
    });
  }

  static async uploadImg(idItem, img, user) {
    const searchItem = await Item.findOne({
      where: { id: idItem }
    });
    if (searchItem === null) {
      throw {
        status: 404
      };
    }
    if (user.id !== searchItem.dataValues.user_id) {
      throw {
        status: 403
      };
    }
    // Block that checks: if the directory exists, it deletes the file in it.
    // If the directory does not exist, it creates a new directory
    try {
      mkdirSync(join("lib", "itemImage", `${idItem}`));
    } catch (err) {
      const searchImg = await Img.findOne({ where: { item_id: idItem } });
      unlinkSync(searchImg.dataValues.path);
      searchImg.destroy();
    }
    //The function mv saves the image in the directory on the server
    await img.mv(join("lib", "itemImage", `${idItem}`, `${img.name}`));
    await Img.create({
      path: join("lib", "itemImage", `${idItem}`, `${img.name}`),
      item_id: searchItem.dataValues.id
    });

    await searchItem.update({
      image: `localhost:3000/images/${idItem}/${`${img.name}`}`
    });

    return await Item.findOne({
      where: { id: idItem },
      attributes: { exclude: ["updated_at"] },
      include: [
        {
          model: User,
          as: "user",
          where: { id: searchItem.user_id },
          attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        }
      ]
    });
  }

  static async searchItems(data) {
    const correctItem = Joi.validate(
      data,
      schema.validateSchemaFromSearchItemsQuery
    );
    // Block that checks the default values
    if (
      !(
        correctItem.value.order_by === "created_at" &&
        correctItem.value.order_by === "price"
      )
    ) {
      correctItem.value.order_by = "created_at";
    }
    if (
      !(
        correctItem.value.order_type === "desc" &&
        correctItem.value.order_type === "asc"
      )
    ) {
      correctItem.value.order_type = "desc";
    }

    const search = await Item.findAll({
      where: {
        title: correctItem.value.title,
        user_id: correctItem.value.user_id
      },
      attributes: { exclude: ["createdAt", "updated_at"] },
      order: [[correctItem.value.order_by, correctItem.value.order_type]],
      include: [
        {
          model: User,
          as: "user",
          where: { id: correctItem.value.user_id },
          attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        }
      ]
    });

    if (search === null || search.length < 1) {
      throw {
        status: 404
      };
    }

    return search;
  }

  static async updateItem(idItem, newItemData, user) {
    // Check item in database
    const searchItem = await Item.findOne({
      where: { id: idItem }
    });

    if (searchItem === null) {
      throw {
        status: 404
      };
    }

    const correctUpdateItem = await Joi.validate(
      newItemData,
      schema.validateSchemaFromUdpdateItem,
      {
        abortEarly: false
      }
    );
    // Check the match of the user ID from the token and user ID that is written in item
    if (user.id !== searchItem.user_id) {
      throw {
        status: 403
      };
    }

    await searchItem.update(correctUpdateItem);

    return await Item.findOne({
      where: { id: idItem },
      attributes: { exclude: ["updated_at"] },
      include: [
        {
          model: User,
          as: "user",
          where: { id: searchItem.user_id },
          attributes: { exclude: ["password", "createdAt", "updatedAt"] }
        }
      ]
    });
  }
  static async deleteItemImg(idItem, user) {
    const searchItem = await Item.findOne({
      where: { id: idItem }
    });
    if (searchItem === null) {
      throw {
        status: 404
      };
    }
    // Check the match of the user ID from the token and user ID that is written in item
    if (user.id !== searchItem.dataValues.user_id) {
      throw {
        status: 403
      };
    }

    const searchImg = await Img.findOne({ where: { item_id: idItem } });
    //Block: delete file -> delete directory -> delete entry in the database
    unlinkSync(searchImg.dataValues.path);
    rmdirSync(join("lib", "itemImage", `${searchItem.id}`));
    searchImg.destroy();
    await searchItem.update({
      image: null
    });
    return;
  }
};
