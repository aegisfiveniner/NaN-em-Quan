'use strict';

module.exports = {
  up (queryInterface, Sequelize) {

    return queryInterface.addColumn('Investments', 'ProfileId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Profiles',
        key: 'id'
      }
    });

  },

  down (queryInterface, Sequelize) {

    return queryInterface.removeColumn('Investments', 'ProfileId', {});

  }
};
