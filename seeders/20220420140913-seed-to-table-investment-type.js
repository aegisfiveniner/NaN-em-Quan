'use strict';
const fs = require('fs');

module.exports = {
  up (queryInterface, Sequelize) {
    let investmentTypes = JSON.parse(fs.readFileSync('./data/investmentypes.json', 'utf-8')).map((el) => {
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    return queryInterface.bulkInsert('InvestmentTypes', investmentTypes, {});

  },

  down (queryInterface, Sequelize) {

    return queryInterface.bulkDelete('InvestmentTypes', null, {});

  }
};
