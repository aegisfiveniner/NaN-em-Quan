'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const env = require('dotenv');
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
    static notifMail(mail, firstName) {

      env.config()

      let transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS
        },
        tls:{
            rejectUnauthorized:false
        }
      });

      let options = {
        from: '"Nan-em-Quan" <nanemquan@outlook.com>', // sender address
        to: `${mail}`, // list of receivers
        subject: "Hello ✔", // Subject line
        html: `<b>Thanks for joining us ${firstName}</b>`, // html body
      };

      transporter.sendMail(options, (err, info) => {
        if(err) {
          console.log(err)
          return
        } 
        console.log(info.response);
      })
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