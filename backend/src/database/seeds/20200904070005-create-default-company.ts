import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const [plans]: any = await queryInterface.sequelize.query(
      "SELECT id FROM \"Plans\" WHERE name = 'Plano 1' LIMIT 1;"
    );

    if (plans.length === 0) {
      await queryInterface.bulkInsert(
        "Plans",
        [
          {
            name: "Plano 1",
            users: 10,
            connections: 10,
            queues: 10,
            value: 30,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      );
    }

    const [companies]: any = await queryInterface.sequelize.query(
      "SELECT id FROM \"Companies\" WHERE name = 'Empresa 1' LIMIT 1;"
    );

    if (companies.length === 0) {
      await queryInterface.bulkInsert(
        "Companies",
        [
          {
            name: "Empresa 1",
            planId: 1,
            dueDate: "2093-03-14 04:00:00+01",
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      );
    }
  },

  down: async (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.bulkDelete("Companies", {}),
      queryInterface.bulkDelete("Plans", {})
    ]);
  }
};

