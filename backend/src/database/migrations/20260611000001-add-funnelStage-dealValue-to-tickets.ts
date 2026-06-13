import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Tickets", "funnelStage", {
      type: DataTypes.ENUM("novo", "qualificado", "proposta", "negociacao", "ganho"),
      defaultValue: "novo",
      allowNull: true
    });
    await queryInterface.addColumn("Tickets", "dealValue", {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Tickets", "funnelStage");
    await queryInterface.removeColumn("Tickets", "dealValue");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tickets_funnelStage";');
  }
};
