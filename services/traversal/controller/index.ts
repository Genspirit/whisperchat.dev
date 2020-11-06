const TWELVE_HOURS = 1000 * 60 * 60 * 12;

export default class TokenController {
  #retrieveNewToken;
  #currentToken;
  #refreshInterval;

  constructor(retrieveNewToken, refreshInterval?) {
    this.#retrieveNewToken = retrieveNewToken;
    this.#currentToken = this.#retrieveNewToken();
    this.#refreshInterval = refreshInterval || TWELVE_HOURS;

    setTimeout(this.refreshToken, this.#refreshInterval);
  }

  refreshToken = async () => {
    const newToken = await this.#retrieveNewToken();
    this.#currentToken = newToken;
    setTimeout(this.refreshToken, this.#refreshInterval);
  };

  async getCurrentToken() {
    return this.#currentToken;
  }
}
