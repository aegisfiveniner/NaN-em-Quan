'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.Profile)
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    ktp: DataTypes.INTEGER,
    email: DataTypes.STRING,
    rekening: DataTypes.INTEGER, 
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (instance, options) => {
        instance.role = 'user'
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(instance.password,salt)
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};