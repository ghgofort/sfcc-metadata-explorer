/**
 * @file OAuth2Token.ts
 * @fileoverview - A class to hold an OAuth 2.0 access token.
 */

export default class OAuth2Token {
  // Define class members and their default values.
  expiresIn: number = 0;
  tokenType: string = '';
  accessToken: string = '';

  constructor(args) {
    // Assign any instance values passed in at instantiation.
    if (args.expires_in) { this.expiresIn = args.expires_in }
    if (args.token_type) { this.tokenType = args.token_type }
    if (args.access_token) { this.accessToken = args.access_token }
  }
}