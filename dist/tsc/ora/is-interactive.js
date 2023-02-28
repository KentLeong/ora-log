"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isInteractive({ stream = process.stdout } = {}) {
    return Boolean(stream && stream.isTTY &&
        process.env.TERM !== 'dumb' &&
        !('CI' in process.env));
}
exports.default = isInteractive;
//# sourceMappingURL=is-interactive.js.map