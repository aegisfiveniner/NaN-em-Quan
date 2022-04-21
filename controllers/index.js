const {User, InvestmentType, Investment, Profile} = require('../models');
const {mataUang, interest, indoDate} = require('../helpers/formatter');
const bcrypt = require('bcryptjs')
class Controller {
    static registerForm(req, res) {
        res.render('registerForm')
    }

    static loginForm(req, res) {
        const error = req.query.error
        res.render('loginForm',{error})
    }

    static postLogin(req,res){
        const {username,password} = req.body
        console.log(req.body)
        //cek apakah username dan password sama
        //step 1 findone dari username
        //step 2 kalo ketemu user, bandingin password sama yang di db
        //step 3 kalo ga sama gaboleh masuk home / error
        //step 4 kalo pass sama has sama maka redirect ke home
        Profile.findOne({
            include: {
                model:User,
                where:{
                    username:username
                }
            }
            })
            .then((profile)=>{
                console.log(profile)
                if(profile) {
                    console.log('profile amsuk')
                    const isValidPassword = bcrypt.compareSync(password, profile.User.password)
                    console.log(isValidPassword,"aaaaaa")
                    if(isValidPassword){
                        console.log('masuk')
                        res.redirect(`/${profile.User.id}`)
                
                    } else {
                        const error = 'invalid username or password'
                        res.redirect(`/login?error=${error}`)
                    }
                } else {
                    const error = 'invalid username or password'
                    res.redirect(`/login?error=${error}`)
                }
            })
            .catch((err)=>{
                res.send(err)
            })
    }

    static register(req, res) {
        const {username, password, ktp, email, rekening, firstName, lastName, income} = req.body
        let obj1 = 
        {
            username, 
            password, 
            ktp, 
            email, 
            rekening
        }

        
        // console.log(obj)
        User.create(obj1, {returning: true})
            .then((result) => {
                let obj2 = 
                {
                    firstName, 
                    lastName, 
                    income, 
                    UserId: result.id
                }
                return Profile.create(obj2)
            })
            .then(() => {
                res.redirect('/login')
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static home(req, res) {
        let profile
        let id = req.params.id
        // console.log(id);
        Profile.findOne({
            where: {
                UserId: id
            }
        })
            .then((result) => {
                profile = result
                return Investment.findAll({
                    where: {
                        ProfileId: profile.id
                    }, 
                    include: InvestmentType
                })
            })
            .then((investments) => {
                res.render('home', {investments, profile, mataUang})
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static newInvestment(req, res) {
        const ProfileId = req.params.id
        InvestmentType.findAll()
            .then((types) => {
                res.render('investmentForm', {types, ProfileId})
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }

    static saveInvestment(req, res) {
        const ProfileId = req.params.id
        // console.log(ProfileId);
        const {name, InvestmentTypeId, targetAmount, amount} = req.body
        let obj = 
        {
            name, 
            ProfileId,
            InvestmentTypeId,
            targetAmount, 
            amount
        }
        // console.log(obj);
        let profile
        Profile.findOne({
            where: {
                id: ProfileId
            }
        })
            .then((result) => {
                profile = result
                // console.log(profile);
                return Investment.create(obj)
        })
            .then(() => {
                res.redirect(`/${profile.UserId}`)
            })
            .catch((err) => {
                // console.log(err)
                res.send(err)
            })
    }

    static investmentDetail(req, res) {
        const id = req.params.investmentId
        Investment.findByPk(id, {
            include: {
                model: InvestmentType
            }
        })
            .then((details) => {
                res.render('investmentDetail', {details, mataUang, interest, indoDate})
            })
            .catch((err) => {
                // console.log(err)
                res.send(err)
            })
    }

    static addAmountForm(req, res) {
        const id = req.params.investmentId
        res.render('addAmountForm', {id})
    }

    static addAmount(req, res) {
        let investment = {}
        let profile = {}
        const id = req.params.investmentId
        const {amount} = req.body
        Investment.findByPk(id, {
            include: {
                model: InvestmentType
            }
            })
            .then((result) => {
                investment = result
                return Profile.findOne({
                    where: {
                        id: investment.ProfileId
                    }
                })
            })
            .then((result) => {
                profile = result
                return investment.increment('amount', {by: amount})
            })
            .then(() => {
                return profile.decrement('saldo', {by: amount})
            })
            .then(() => {
                res.redirect(`/investment/${id}`)
            })
            .catch((err) => {
                // console.log(err)
                res.send(err)
            })
    }

    static topUpForm(req, res) {
        const id = req.params.id
        User.findOne({
            where: {
                id
            }
        })
            .then((user) => {
                res.render('topUpForm', {user})
            })
            .catch((err) => {
                res.send(err)
            })
    }

    static topUp(req, res) {
        let user = {}
        const {saldo} = req.body
        // console.log(saldo);
        const id = req.params.id
        User.findOne({
            where: {
                id
            }, 
            include: Profile
        })
            .then((result) => {
                user = result 
                return user.Profile.increment('saldo', {by: saldo})
            })
            .then(() => {
                res.redirect(`/${user.id}`)
            })
            .catch((err) => {
                console.log(err);
                res.send(err)
            })
    }
}

module.exports = Controller