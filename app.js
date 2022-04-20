const express = require('express')
const app = express()
const port = 3000
const Controller = require('./controllers');

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))

app.get('/', Controller.home)
app.get('/login', Controller.loginForm)
app.get('/register', Controller.registerForm)
app.post('/register', Controller.register)
app.get('/investment/add', Controller.newInvestment)
app.post('/investment/add', Controller.saveInvestment)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})