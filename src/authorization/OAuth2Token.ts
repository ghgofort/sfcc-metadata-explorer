/**
 * @file OAuth2Token.ts
 * @fileoverview - A class to hold an OAuth 2.0 access token.
 */

export class OAuth2Token {
  // Define class members and their default values.
  public expiresIn: number = 0;
  public tokenType: string = '';
  public accessToken: string = '';

  constructor(args) {
    // Assign any instance values passed in at instantiation.
    if (args.expires_in) {
      this.expiresIn = args.expires_in;
    }
    if (args.token_type) {
      this.tokenType = args.token_type;
    }
    if (args.access_token) {
      this.accessToken = args.access_token;
    }
  }
}
