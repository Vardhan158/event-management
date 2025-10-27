import base64_url_decode from "./lib/base64_url_decode";
'use strict';

export class JwtDecode {

    decode(token, options) {
      if (typeof token !== 'string') {
          throw new Error('Invalid token specified');
      }

      options = options || {};
      let pos = options.header === true ? 0 : 1;
      return JSON.parse(base64_url_decode(token.split('.')[pos]));
  }

}
