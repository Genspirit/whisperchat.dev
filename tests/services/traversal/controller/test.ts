import TokenController from "~/services/traversal/controller";

import { nanoid } from "nanoid";

describe("Traversal/TokenController", () => {
  const getFakeAccessToken = () => nanoid();

  let TestTokenController: TokenController;

  beforeEach(() => {
    TestTokenController = new TokenController(getFakeAccessToken);
  });

  test("retrieves access tokens", async () => {
    const firstAccessToken = await TestTokenController.getCurrentToken();

    expect(typeof firstAccessToken).toEqual("string");
  });

  test("refreshes access tokens", async () => {
    const firstAccessToken = await TestTokenController.getCurrentToken();
    expect(typeof firstAccessToken).toEqual("string");

    await TestTokenController.refreshToken();

    const secondAccessToken = await TestTokenController.getCurrentToken();
    expect(typeof secondAccessToken).toEqual("string");

    expect(firstAccessToken).not.toEqual(secondAccessToken);
  });
});
