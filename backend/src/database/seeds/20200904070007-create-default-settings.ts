import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const [existingSettings]: any = await queryInterface.sequelize.query(
      "SELECT key FROM \"Settings\" WHERE \"companyId\" = 1;"
    );
    const existingKeys = new Set(existingSettings.map((s: any) => s.key));

    const defaultSettings = [
      {
        key: "chatBotType",
        value: "text",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "userRating",
        value: "disabled",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "scheduleType",
        value: "queue",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "CheckMsgIsGroup",
        value: "enabled",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "call",
        value: "disabled",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "ipixc",
        value: "",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "tokenixc",
        value: "",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "ipmkauth",
        value: "",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "clientidmkauth",
        value: "",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "clientsecretmkauth",
        value: "",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "asaas",
        value: "",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "aiTone",
        value: "cordial",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "aiPersona",
        value: "Você é um assistente de atendimento ao cliente educado e prestativo.",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        key: "aiKnowledgeBase",
        value: "[]",
        companyId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const settingsToInsert = defaultSettings.filter(
      setting => !existingKeys.has(setting.key)
    );

    if (settingsToInsert.length > 0) {
      await queryInterface.bulkInsert("Settings", settingsToInsert);
    }
  },

  down: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Settings", {});
  }
};

