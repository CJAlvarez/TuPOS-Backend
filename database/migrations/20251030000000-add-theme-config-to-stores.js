'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('stores', 'theme_config', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Theme configuration for white label stores'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('stores', 'theme_config');
  }
};