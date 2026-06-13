import axios from "axios";
import { replyToLiComment, likeLiComment } from "../LinkedinCommentService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("LinkedinCommentService", () => {
  const post = jest.fn();
  beforeEach(() => {
    post.mockReset();
    (mockedAxios.create as jest.Mock) = jest.fn(() => ({ post }));
  });

  it("replyToLiComment posta comentário na socialAction com actor + message", async () => {
    post.mockResolvedValueOnce({ data: {} });
    await replyToLiComment(
      "urn:li:comment:(urn:li:activity:123,456)",
      "urn:li:organization:99",
      "Olá!",
      "tok"
    );
    expect(post).toHaveBeenCalledTimes(1);
    const [url, body] = post.mock.calls[0];
    expect(url).toContain("socialActions/");
    expect(url).toContain("/comments");
    expect(body.actor).toBe("urn:li:organization:99");
    expect(body.message).toEqual({ text: "Olá!" });
  });

  it("likeLiComment cria reaction LIKE", async () => {
    post.mockResolvedValueOnce({ data: {} });
    await likeLiComment("urn:li:comment:abc", "urn:li:organization:99", "tok");
    const [url, body] = post.mock.calls[0];
    expect(url).toBe("reactions");
    expect(body.reactionType).toBe("LIKE");
    expect(body.object).toBe("urn:li:comment:abc");
  });
});
