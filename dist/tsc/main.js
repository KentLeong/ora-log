"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ora_1 = tslib_1.__importDefault(require("./ora"));
const spinner = (0, ora_1.default)('Loading unicorns').start();
setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Loading rainbows';
}, 1000);
//# sourceMappingURL=main.js.map