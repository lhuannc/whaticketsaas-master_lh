import { QueryInterface } from "sequelize";
import { hash } from "bcryptjs";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const [users]: any = await queryInterface.sequelize.query(
      "SELECT id FROM \"Users\" WHERE email = 'admin@admin.com' LIMIT 1;"
    );

    if (users.length === 0) {
      const passwordHash = await hash("123456", 8);
      await queryInterface.bulkInsert(
        "Users",
        [
          {
            name: "Admin",
            email: "admin@admin.com",
            profile: "admin",
            passwordHash,
            companyId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            super: true
          }
        ]
      );
    }
  },

  down: async (queryInterface: QueryInterface) => {
    return Promise.all([
      queryInterface.bulkDelete("Users", {})
    ]);
  }
};
