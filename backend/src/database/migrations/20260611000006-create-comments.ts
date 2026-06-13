import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("Comments", {
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
      ticketId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Tickets", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      contactId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: "Contacts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      channelType: {
        type: DataTypes.ENUM("instagram", "linkedin"),
        allowNull: false
      },
      externalCommentId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      postId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      authorName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      authorUsername: {
        type: DataTypes.STRING,
        allowNull: true
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      mediaUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      replyCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      isSpam: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isReplied: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      repliedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      externalCreatedAt: {
        type: DataTypes.DATE,
        allowNull: true
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

    await queryInterface.addIndex("Comments", ["externalCommentId", "companyId"], {
      name: "comments_externalId_companyId",
      unique: true
    });
    await queryInterface.addIndex("Comments", ["channelType", "companyId", "isReplied"], {
      name: "comments_channel_company_replied"
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("Comments");
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Comments_channelType";');
  }
};
