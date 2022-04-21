'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Investment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.InvestmentType)
      this.belongsTo(models.Profile)
    }

    toInvest(InvestmentType) {
      let range = this.targetAmount - this.amount
      let toSave = range / InvestmentType.investPeriod
      let toSavePerMonth = toSave / 12 
      let interestBonus = toSavePerMonth * ((100 - InvestmentType.returnRate) / 100)
      return Math.round(interestBonus)
    }

    matureDate(InvestmentType) {
      let date = new Date(this.createdAt)
      let years = date.getFullYear() + InvestmentType.investPeriod
      date.setFullYear(years)
      console.log(date);
      return date
    }

  }
  Investment.init({
    name: DataTypes.STRING,
    targetAmount: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    ProfileId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (instance, options) => {
        instance.amount = 0
      }
    },
    sequelize,
    modelName: 'Investment',
  });
  return Investment;
};