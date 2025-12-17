'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      Product.hasMany(models.ProductionLog, { foreignKey: 'productId' });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    target_defect_rate: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};