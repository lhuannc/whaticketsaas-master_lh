import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Messages", "externalId", {
      type: DataTypes.STRING,
      allowNull: true
    });
    // parentCommentId: link lógico para Comments (FK omitida — Comments criada em migration posterior)
    await queryInterface.addColumn("Messages", "parentCommentId", {
      type: DataTypes.INTEGER,
      allowNull: true
    });
    await queryInterface.addIndex("Messages", ["externalId", "companyId"], {
      name: "messages_externalId_companyId"
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex("Messages", "messages_externalId_companyId");
    await queryInterface.removeColumn("Messages", "parentCommentId");
    await queryInterface.removeColumn("Messages", "externalId");
  }
};
