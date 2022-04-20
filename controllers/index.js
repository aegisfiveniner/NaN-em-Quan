const {User, InvestmentType, Investment} = require('../models');

class Controller {
    static registerForm(req, res) {
        res.render('registerForm')
    }

    static loginForm(req, res) {
        res.render('loginForm')
    }

    static register(req, res) {
        const {username, password, ktp, email, rekening} = req.body
        let obj = 
        {
            username, 
            password, 
            ktp, 
            email, 
            rekening
        }
        // console.log(obj)
        User.create(obj)
            .then(() => {
                res.redirect('/login')
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static home(req, res) {
        Investment.findAll({
            include: InvestmentType
        })
            .then((investments) => {
                res.render('home', {investments})
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static newInvestment(req, res) {
        InvestmentType.findAll()
            .then((types) => {
                res.render('investmentForm', {types})
            })
            .catch((err) => {
 
                res.send(err)
            })
    }

    static saveInvestment(req, res) {
        const {name, ProfileId, targetAmount, amount} = req.body
        let obj = 
        {
            name, 
            ProfileId,
            targetAmount, 
            amount
        }
        // console.log(obj);
        Investment.create(obj)
            .then(() => {
                res.redirect('/')
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
    }
}

module.exports = Controller