"use strict";
var Example = (function () {
    function Example(jwtDecode) {
        this.jwtDecode = jwtDecode;
    }
    Example.prototype.decodeJsonWebToken = function (token, options) {
        this.jwtDecode.decode(token, options);
    };
    return Example;
}());
