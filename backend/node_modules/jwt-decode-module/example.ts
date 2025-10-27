import { JwtDecode } from "./index";

class Example {

    constructor(private jwtDecode: JwtDecode){   }

    decodeJsonWebToken(token: string, options? :any) {
        this.jwtDecode.decode(token, options);
    }
}