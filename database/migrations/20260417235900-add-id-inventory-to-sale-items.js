'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sale_items', 'id_inventory', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'inventorys',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addIndex('sale_items', ['id_inventory'], {
      name: 'idx_sale_items_id_inventory',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('sale_items', 'idx_sale_items_id_inventory');
    await queryInterface.removeColumn('sale_items', 'id_inventory');
  },
};
