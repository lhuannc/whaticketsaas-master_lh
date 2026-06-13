import { QueryInterface } from "sequelize";

// Seeder DEV: amostras multi-canal (IG/LI comments) para company 1.
// Idempotente — só roda se não houver comentários ainda. Ignorar em produção.

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    if (process.env.NODE_ENV === "production") return;

    const [existing]: any = await queryInterface.sequelize.query(
      'SELECT COUNT(*)::int AS c FROM "Comments" WHERE "companyId" = 1;'
    );
    if (existing?.[0]?.c > 0) return;

    const now = new Date();

    await queryInterface.bulkInsert("Comments", [
      {
        companyId: 1,
        channelType: "instagram",
        externalCommentId: "ig_sample_1",
        postId: "ig_post_1",
        authorName: "Mariana Souza",
        authorUsername: "mari.souza",
        body: "Esse produto tem garantia? Quanto tempo de envio?",
        likeCount: 2,
        replyCount: 0,
        isSpam: false,
        isReplied: false,
        externalCreatedAt: now,
        createdAt: now,
        updatedAt: now
      },
      {
        companyId: 1,
        channelType: "instagram",
        externalCommentId: "ig_sample_2",
        postId: "ig_post_1",
        authorName: "Spam Bot",
        authorUsername: "ganhe.dinheiro.now",
        body: "GANHE R$5000 POR DIA clique no link da bio!!!",
        likeCount: 0,
        replyCount: 0,
        isSpam: true,
        isReplied: false,
        externalCreatedAt: now,
        createdAt: now,
        updatedAt: now
      },
      {
        companyId: 1,
        channelType: "linkedin",
        externalCommentId: "li_sample_1",
        postId: "urn:li:ugcPost:sample1",
        authorName: "Carlos Andrade",
        authorUsername: null,
        body: "Excelente conteúdo! Vocês atendem empresas B2B?",
        likeCount: 5,
        replyCount: 0,
        isSpam: false,
        isReplied: false,
        externalCreatedAt: now,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete("Comments", {
      externalCommentId: ["ig_sample_1", "ig_sample_2", "li_sample_1"]
    } as any);
  }
};
