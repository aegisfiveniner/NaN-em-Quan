const express = require('express')
const router = express.Router()
const Controller = require('../controllers')
const investmentRouter = require('./investment')
const registerRouter = require('./register')
const loginRouter  = require('./login')


router.get('/',Controller.home)

router.get('/login',loginRouter)
router.use('/investment',investmentRouter)
router.use('/register',registerRouter)



module.exports = router