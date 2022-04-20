'use strict';

module.exports = {
  up (queryInterface, Sequelize) {

    return queryInterface.addColumn('Investments', 'InvestmentTypeId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'InvestmentTypes',
        key: 'id'
      }
    });

  },

  down (queryInterface, Sequelize) {

    return queryInterface.removeColumn('Investments', 'InvestmentTypeId', {});

  }
};
