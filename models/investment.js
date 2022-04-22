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
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull:true,
        notEmpty:{
          msg:'investment name cannot be emtpy!'
        }
      }
    },
    InvestmentTypeId:{
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        notNull:true,
        notEmpty:{
          msg:'please choose your investment type'
        }
      }
    },
    targetAmount: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate:{
        min:{
          args:[[0]],
          msg:'target amount must be positive!'
        },
        notEmpty:{
          msg:'investment target amount can not be empty!'
        }
      }
    },
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