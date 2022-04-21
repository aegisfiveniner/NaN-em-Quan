const express = require('express')
const app = express()
const port = 3000
const Controller = require('./controllers');

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/register', Controller.registerForm)
app.post('/register', Controller.register)
app.get('/login', Controller.loginForm)
app.post('/login',Controller.postLogin)

app.get('/:id', Controller.home)
app.get('/:id/topup', Controller.topUpForm)
app.post('/:id/topup', Controller.topUp)
app.get('/investment/:id/add', Controller.newInvestment)
app.post('/investment/:id/add', Controller.saveInvestment)
app.get('/investment/:investmentId', Controller.investmentDetail)
app.get('/investment/:investmentId/invest', Controller.addAmountForm)
app.post('/investment/:investmentId/invest', Controller.addAmount)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})