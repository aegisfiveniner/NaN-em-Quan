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
    static notifMail(mail) {
      let testAccount = nodemailer.createTestAccount()

      let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });

      let options = {
        from: '"Nan-em-Quan" ', // sender address
        to: `${mail}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Thank for joining us", // plain text body
        html: "<b>Hello world?</b>", // html body
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