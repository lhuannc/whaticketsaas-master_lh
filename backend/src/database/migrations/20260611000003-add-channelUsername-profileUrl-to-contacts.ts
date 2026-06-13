import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Contacts", "channelUsername", {
      type: DataTypes.STRING,
      allowNull: true
    });
    await queryInterface.addColumn("Contacts", "channelProfileUrl", {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Contacts", "channelUsername");
    await queryInterface.removeColumn("Contacts", "channelProfileUrl");
  }
};
