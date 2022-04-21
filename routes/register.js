const express = require('express')
const router = express.Router()
const Controller = require('../controllers')


router.route('/')
  .get(Controller.registerForm)
  .post(Controller.register)

module.exports = router