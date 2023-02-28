"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_process_1 = tslib_1.__importDefault(require("node:process"));
const onetime_1 = tslib_1.__importDefault(require("onetime"));
const signal_exit_1 = tslib_1.__importDefault(require("signal-exit"));
const restoreCursor = (0, onetime_1.default)(() => {
    (0, signal_exit_1.default)(() => {
        node_process_1.default.stderr.write('\u001B[?25h');
    }, { alwaysLast: true });
});
exports.default = restoreCursor;
//# sourceMappingURL=restore-cursor.js.map