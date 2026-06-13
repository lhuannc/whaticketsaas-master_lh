import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Flows", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Companies", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true
      },
      triggerType: {
        type: DataTypes.ENUM(
          "first_contact",
          "keyword",
          "out_of_hours",
          "after_close"
        ),
        allowNull: false,
        defaultValue: "first_contact"
      },
      triggerValue: {
        type: DataTypes.STRING,
        allowNull: true
      },
      channelType: {
        type: DataTypes.ENUM("whatsapp", "instagram", "linkedin", "all"),
        allowNull: false,
        defaultValue: "all"
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      nodes: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
      },
      edges: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: []
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });

    await queryInterface.addIndex("Flows", ["companyId", "isActive"], {
      name: "flows_company_active"
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Flows");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Flows_triggerType";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Flows_channelType";');
  }
};
