import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("InstagramAccounts", {
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
      igUserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      igUsername: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pageId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      tokenExpiresAt: {
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
    await queryInterface.dropTable("InstagramAccounts");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_InstagramAccounts_status";');
  }
};
