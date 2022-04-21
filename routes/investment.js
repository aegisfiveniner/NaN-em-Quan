const express = require('express')
const router = express.Router()
const Controller = require('../controllers')

router.route('/add')
 .get(Controller.newInvestment)
 .post(Controller.saveInvestment)

router.get('/:id', Controller.investmentDetail)


module.exports = router