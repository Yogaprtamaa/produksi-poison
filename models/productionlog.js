'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductionLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // models/productionlog.js

    static associate(models) {
      // Tambahkan baris ini:
      // Satu Log Produksi MILIK Satu Produk
      ProductionLog.belongsTo(models.Product, { foreignKey: 'productId' });
    }
  }
  ProductionLog.init({
    date: DataTypes.DATE,
    total_produced: DataTypes.INTEGER,
    defect_count: DataTypes.INTEGER,
    productId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ProductionLog',
  });
  return ProductionLog;
};