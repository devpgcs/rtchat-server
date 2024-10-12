export interface TokenPayload {
  /**
   * The token audience.
   */
  aud: string;
  /**
   * The token issuer.
   */
  iss: string;
  /**
   * The subject of the token.
   */
  sub: string;
}
