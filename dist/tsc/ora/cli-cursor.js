"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_process_1 = tslib_1.__importDefault(require("node:process"));
const restore_cursor_1 = tslib_1.__importDefault(require("./restore-cursor"));
let isHidden = false;
const cliCursor = {};
cliCursor.show = (writableStream = node_process_1.default.stderr) => {
    if (!writableStream.isTTY) {
        return;
    }
    isHidden = false;
    writableStream.write('\u001B[?25h');
};
cliCursor.hide = (writableStream = node_process_1.default.stderr) => {
    if (!writableStream.isTTY) {
        return;
    }
    (0, restore_cursor_1.default)();
    isHidden = true;
    writableStream.write('\u001B[?25l');
};
cliCursor.toggle = (force, writableStream) => {
    if (force !== undefined) {
        isHidden = force;
    }
    if (isHidden) {
        cliCursor.show(writableStream);
    }
    else {
        cliCursor.hide(writableStream);
    }
};
exports.default = cliCursor;
//# sourceMappingURL=cli-cursor.js.map