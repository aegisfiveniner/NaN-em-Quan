const express = require('express')
const app = express()
const port = 3000
const Controller = require('./controllers');

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/:id', Controller.home)
app.get('/login', Controller.loginForm)
app.get('/register', Controller.registerForm)
app.post('/register', Controller.register)
app.get('/investment/:id/add', Controller.newInvestment)
app.post('/investment/:id/add', Controller.saveInvestment)
app.get('/investment/:id', Controller.investmentDetail)
app.get('/investment/:id/invest', Controller.addAmountForm)
app.post('/investment/:id/invest', Controller.addAmount)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})