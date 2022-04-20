'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InvestmentType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InvestmentType.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    minimumInvest: DataTypes.INTEGER,
    investPeriod: DataTypes.INTEGER,
    returnRate: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InvestmentType',
  });
  return InvestmentType;
};