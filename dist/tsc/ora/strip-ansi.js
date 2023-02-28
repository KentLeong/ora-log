"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ansi_regex_1 = tslib_1.__importDefault(require("ansi-regex"));
function stripAnsi(string) {
    if (typeof string !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
    }
    return string.replace((0, ansi_regex_1.default)(), '');
}
exports.default = stripAnsi;
//# sourceMappingURL=strip-ansi.js.map