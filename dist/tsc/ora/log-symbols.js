"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const is_unicode_supported_1 = tslib_1.__importDefault(require("./is-unicode-supported"));
const main = {
    info: chalk_1.default.blue('ℹ'),
    success: chalk_1.default.green('✔'),
    warning: chalk_1.default.yellow('⚠'),
    error: chalk_1.default.red('✖'),
};
const fallback = {
    info: chalk_1.default.blue('i'),
    success: chalk_1.default.green('√'),
    warning: chalk_1.default.yellow('‼'),
    error: chalk_1.default.red('×'),
};
const logSymbols = (0, is_unicode_supported_1.default)() ? main : fallback;
exports.default = logSymbols;
//# sourceMappingURL=log-symbols.js.map