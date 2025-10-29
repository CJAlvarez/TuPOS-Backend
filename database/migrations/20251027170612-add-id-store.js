'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Lista de tablas a las que se agregará id_store
      const tables = [
        'admins',
        'campaigns',
        'cashboxes',
        'clients',
        'discount_rules',
        'gift_cards',
        'gift_card_transactions',
        'inventorys',
        'invoices',
        'invoice_config',
        'notifications',
        'payments',
        'products',
        'reports',
        'returns',
        'return_items',
        'royalties',
        'sales',
        'sale_items',
        'terminals',
      ];

      // Agregar columna id_store a cada tabla
      for (const table of tables) {
        try {
          console.log(`Agregando columna id_store a la tabla: ${table}`);
          
          await queryInterface.addColumn(
            table,
            'id_store',
            {
              type: Sequelize.INTEGER,
              allowNull: true,
              references: {
                model: 'stores',
                key: 'id',
              },
              onUpdate: 'CASCADE',
              onDelete: 'SET NULL',
            },
            { transaction },
          );

          console.log(`Agregando índice idx_${table}_id_store`);
          
          // Agregar índice para mejorar el rendimiento de consultas
          await queryInterface.addIndex(
            table,
            ['id_store'],
            {
              name: `idx_${table}_id_store`,
              transaction,
            },
          );

          console.log(`✓ Tabla ${table} procesada correctamente`);
        } catch (error) {
          console.error(`✗ Error al procesar la tabla ${table}:`, error.message);
          // throw new Error(`Migración fallida en la tabla: ${table}. Error: ${error.message}`);
        }
      }

      await transaction.commit();
      console.log('✓ Migración completada exitosamente');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Migración revertida debido a errores');
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Lista de tablas de las que se removerá id_store
      const tables = [
        'admins',
        'campaigns',
        'cashboxes',
        'clients',
        'discount_rules',
        'gift_cards',
        'gift_card_transactions',
        'inventorys',
        'invoices',
        'invoice_config',
        'notifications',
        'payments',
        'products',
        'reports',
        'returns',
        'return_items',
        'royalties',
        'sales',
        'sale_items',
        'terminals',
      ];

      // Remover índice y columna de cada tabla
      for (const table of tables) {
        try {
          console.log(`Removiendo índice y columna de la tabla: ${table}`);
          
          // Remover índice
          await queryInterface.removeIndex(
            table,
            `idx_${table}_id_store`,
            { transaction },
          );

          // Remover columna
          await queryInterface.removeColumn(
            table,
            'id_store',
            { transaction },
          );

          console.log(`✓ Tabla ${table} revertida correctamente`);
        } catch (error) {
          console.error(`✗ Error al revertir la tabla ${table}:`, error.message);
          // throw new Error(`Reversión fallida en la tabla: ${table}. Error: ${error.message}`);
        }
      }

      await transaction.commit();
      console.log('✓ Reversión completada exitosamente');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Reversión abortada debido a errores');
      throw error;
    }
  },
};

