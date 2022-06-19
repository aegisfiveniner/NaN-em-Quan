const { User, InvestmentType, Investment, Profile } = require("../models");
const { mataUang, interest, indoDate } = require("../helpers/formatter");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
class Controller {
  static menu(req, res) {
    res.render("menu");
  }

  static registerForm(req, res) {
    res.render("registerForm");
  }

  static loginForm(req, res) {
    const error = req.query.error;
    res.render("loginForm", { error });
  }

  static postLogin(req, res) {
    const { username, password } = req.body;
    // console.log(req.body)
    Profile.findOne({
      include: {
        model: User,
        where: {
          username: username,
        },
      },
    })
      .then((profile) => {
        // console.log(profile);
        if (profile) {
          const isValidPassword = bcrypt.compareSync(
            password,
            profile.User.password
          );
          if (isValidPassword) {
            req.session.userId = profile.User.id;
            req.session.role = profile.User.role;
            // console.log(`/${profile.User.id}`);
            res.redirect(`/${profile.User.id}`);
          } else {
            const error = "invalid username or password";
            res.redirect(`/login?error=${error}`);
          }
        } else {
          const error = "invalid username or password";
          res.redirect(`/login?error=${error}`);
        }
      })
      .catch((err) => {
        // console.log('err')
        res.send(err);
      });
  }

  static register(req, res) {
    const {
      username,
      password,
      ktp,
      email,
      rekening,
      firstName,
      lastName,
      income,
    } = req.body;
    let obj1 = {
      username,
      password,
      ktp,
      email,
      rekening,
    };

    // console.log(obj)
    User.create(obj1, { returning: true })
      .then((result) => {
        let obj2 = {
          firstName,
          lastName,
          income,
          UserId: result.id,
        };
        return Profile.create(obj2);
      })
      .then(() => {
        User.notifMail(email, firstName);
        res.redirect("/login");
      })
      .catch((err) => {
        // console.log(err);
        res.send(err);
      });
  }
  static logOut(req, res) {
    req.session.destroy((err) => {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        res.redirect("/login");
      }
    });
  }
  static home(req, res) {
    const queryName = req.query.investment;
    let profile = {};
    let investments = {};
    let UserId = req.session.userId;
    // console.log(req);
    Profile.findOne({
      where: {
        UserId,
      },
    })
      .then((result) => {
        profile = result;
        let investmentOptions = {
          where: {
            ProfileId: profile.id,
          },
          include: InvestmentType,
        };
        if (queryName) {
          investmentOptions.where.name = {
            [Op.iLike]: `%${queryName}%`,
          };
        }
        return Investment.findAll(investmentOptions);
      })
      .then((result) => {
        investments = result;
        res.render("home", { investments, profile, mataUang });
      })
      .catch((err) => {
        // console.log(err);
        res.send(err);
      });
  }

  static newInvestment(req, res) {
    const errors = req.query.errors;
    const ProfileId = req.params.id;
    InvestmentType.findAll()
      .then((types) => {
        res.render("investmentForm", { types, ProfileId, errors });
      })
      .catch((err) => {
        // console.log(err);
        res.send(err);
      });
  }

  static saveInvestment(req, res) {
    const ProfileId = req.params.id;
    // console.log(ProfileId);
    const { name, InvestmentTypeId, targetAmount, amount } = req.body;
    let obj = {
      name,
      ProfileId,
      InvestmentTypeId,
      targetAmount,
      amount,
    };
    // console.log(obj);
    let profile;
    Profile.findOne({
      where: {
        id: ProfileId,
      },
    })
      .then((result) => {
        profile = result;
        // console.log(profile);
        return Investment.create(obj);
      })
      .then(() => {
        res.redirect(`/${profile.UserId}`);
      })
      .catch((err) => {
        if (err.name == "SequelizeValidationError") {
          err = err.errors.map((el) => el.message);
        }
        // console.log(err)
        res.redirect(`/investment/${profile.id}/add?errors=${err}`);
      });
  }

  static investmentDetail(req, res) {
    const id = req.params.investmentId;
    let details = {};
    let profile = {};
    Investment.findByPk(id, {
      include: {
        model: InvestmentType,
      },
    })
      .then((result) => {
        details = result;
        return Profile.findByPk(details.ProfileId);
      })
      .then((result) => {
        profile = result;
        res.render("investmentDetail", {
          details,
          profile,
          mataUang,
          interest,
          indoDate,
        });
      })
      .catch((err) => {
        // console.log(err)
        res.send(err);
      });
  }

  static addAmountForm(req, res) {
    const id = req.params.investmentId;
    res.render("addAmountForm", { id });
  }

  static addAmount(req, res) {
    let investment = {};
    let profile = {};
    const id = req.params.investmentId;
    const { amount } = req.body;
    Investment.findByPk(id, {
      include: {
        model: InvestmentType,
      },
    })
      .then((result) => {
        investment = result;
        return Profile.findOne({
          where: {
            id: investment.ProfileId,
          },
        });
      })
      .then((result) => {
        profile = result;
        return investment.increment("amount", { by: amount });
      })
      .then(() => {
        return profile.decrement("saldo", { by: amount });
      })
      .then(() => {
        res.redirect(`/investment/${id}`);
      })
      .catch((err) => {
        // console.log(err)
        res.send(err);
      });
  }

  static topUpForm(req, res) {
    const id = req.params.id;
    User.findOne({
      where: {
        id,
      },
    })
      .then((user) => {
        res.render("topUpForm", { user });
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static topUp(req, res) {
    let user = {};
    const { saldo } = req.body;
    // console.log(saldo);
    const id = req.params.id;
    User.findOne({
      where: {
        id,
      },
      include: Profile,
    })
      .then((result) => {
        user = result;
        return user.Profile.increment("saldo", { by: saldo });
      })
      .then(() => {
        res.redirect(`/${user.id}`);
      })
      .catch((err) => {
        // console.log(err);
        res.send(err);
      });
  }

  static withdraw(req, res) {
    let investment = {};
    const investmentId = req.params.investmentId;
    Investment.findByPk(investmentId, {
      include: {
        model: Profile,
      },
    })
      .then((result) => {
        investment = result;
        return Investment.destroy({
          where: {
            id: investmentId,
          },
        });
      })
      .then(() => {
        res.redirect(`/${investment.Profile.UserId}`);
      })
      .catch((err) => {
        // console.log(err)
        res.send(err);
      });
  }

  static getInvestmentTypes(req, res) {
    InvestmentType.findAll()
      .then((types) => {
        res.render("investmentTypes", { types });
      })
      .catch((err) => {
        // console.log(err);
        res.send(err);
      });
  }
}

module.exports = Controller;
