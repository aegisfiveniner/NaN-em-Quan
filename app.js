const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const {isLoggedIn,isAdmin} = require('./middlewares')
const Controller = require('./controllers');

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.use(session({
  secret:'!akugakpuasa',
  resave: false,
  saveUninitialized:true,
  cookie: {
    secure:false,
    sameSite:true
  }
}))


app.get('/register', Controller.registerForm)
app.post('/register', Controller.register)
app.get('/login', Controller.loginForm)
app.post('/login',Controller.postLogin)
app.get('/', Controller.menu)
app.get('/investmentTypes',isAdmin,Controller.getInvestmentTypes)
app.get('/logout',isLoggedIn,Controller.logOut)
app.get('/:id',isLoggedIn, Controller.home)
app.get('/:id/topup',isLoggedIn, Controller.topUpForm)
app.post('/:id/topup',isLoggedIn, Controller.topUp)
app.get('/investment/:id/add',isLoggedIn, Controller.newInvestment)
app.post('/investment/:id/add',isLoggedIn, Controller.saveInvestment)
app.get('/investment/:investmentId',isLoggedIn, Controller.investmentDetail)
app.get('/investment/:investmentId/invest',isLoggedIn, Controller.addAmountForm)
app.post('/investment/:investmentId/invest',isLoggedIn, Controller.addAmount)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})