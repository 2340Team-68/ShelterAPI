// 'use strict';
//
// module.exports = {
//   up: (queryInterface, Sequelize) => {
//     /*
//       update shelter with columns:
//     */
//     let tableName = 'Shelters';
//
//     // capacity: DataTypes.INTEGER,
//     queryInterface.addColumn(
//       tableName,
//       'capacity',
//       {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         defaultValue: 0
//       }
//     );
//     // restrictions: DataTypes.STRING  // TODO: change to enum later
//     queryInterface.addColumn(
//       tableName,
//       'restrictions',
//       {
//         type: Sequelize.STRING,
//         defaultValue: ""
//       }
//     );
//
//     //latitude: DataTypes.DECIMAL
//     queryInterface.addColumn(
//       tableName,
//       'latitude',
//       {
//         type: Sequelize.DECIMAL,
//         allowNull: false,
//         defaultValue: 0.0
//       }
//     );
//
//     // longitude: DataTypes.DECIMAL
//     queryInterface.addColumn(
//       tableName,
//       'longitude',
//       {
//         type: Sequelize.DECIMAL,
//         allowNull: false,
//         defaultValue: 0.0
//       }
//     );
//     // address: DataTypes.STRING
//     queryInterface.addColumn(
//       tableName,
//       'address',
//       {
//         type: Sequelize.STRING,
//         allowNull: false,
//         defaultValue: "123 Fake St. New York, New York, 11111"
//       }
//     );
//     // address: DataTypes.STRING
//     queryInterface.addColumn(
//       tableName,
//       'phone',
//       {
//         type: Sequelize.STRING,
//         allowNull: false,
//         defaultValue: ""
//       }
//     );
//     // description: DataTypes.TEXT
//     queryInterface.addColumn(
//       tableName,
//       'description',
//       {
//         type: Sequelize.TEXT,
//         allowNull: false,
//         defaultValue: ""
//       }
//     );
//     return queryInterface;
//   },
//
//   down: (queryInterface, Sequelize) => {
//     /*
//       Add reverting commands here.
//       Return a promise to correctly handle asynchronicity.
//
//       Example:
//       return queryInterface.dropTable('users');
//     */
//     let tableName = 'Shelter';
//     queryInterface.removeColumn(tableName, 'capacity');
//     queryInterface.removeColumn(tableName, 'restrictions');
//     queryInterface.removeColumn(tableName, 'latitude');
//     queryInterface.removeColumn(tableName, 'longitude');
//     queryInterface.removeColumn(tableName, 'address');
//     queryInterface.removeColumn(tableName, 'phone');
//     queryInterface.removeColumn(tableName, 'description');
//     return queryInterface;
//   }
// };
