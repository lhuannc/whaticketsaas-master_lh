import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("LinkedinAccounts", {
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
      liOrganizationId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      liOrganizationName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      liOrganizationLogo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tokenExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      lastPollAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM("connected", "disconnected", "token_expired"),
        defaultValue: "connected",
        allowNull: false
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
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("LinkedinAccounts");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_LinkedinAccounts_status";');
  }
};
