const express = require('express')
const router = express.Router()
const Controller = require('../controllers')

router.get('/',Controller.loginForm)

module.exports = router