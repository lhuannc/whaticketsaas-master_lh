import axios from "axios";
import { replyToIgComment, hideIgComment } from "../InstagramCommentService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("InstagramCommentService", () => {
  const post = jest.fn();
  beforeEach(() => {
    post.mockReset();
    // igApi() chama axios.create(...).post
    (mockedAxios.create as jest.Mock) = jest.fn(() => ({ post }));
  });

  it("replyToIgComment posta em {commentId}/replies com message", async () => {
    post.mockResolvedValueOnce({ data: { id: "reply_1" } });
    const res = await replyToIgComment("c123", "Obrigado!", "token_abc");
    expect(post).toHaveBeenCalledWith("c123/replies", { message: "Obrigado!" });
    expect(res).toEqual({ id: "reply_1" });
  });

  it("hideIgComment posta hide=true no comentário", async () => {
    post.mockResolvedValueOnce({ data: {} });
    await hideIgComment("c999", true, "token_abc");
    expect(post).toHaveBeenCalledWith("c999", { hide: true });
  });
});
