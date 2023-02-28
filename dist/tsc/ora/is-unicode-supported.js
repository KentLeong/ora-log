"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_process_1 = tslib_1.__importDefault(require("node:process"));
function isUnicodeSupported() {
    if (node_process_1.default.platform !== 'win32') {
        return node_process_1.default.env.TERM !== 'linux'; // Linux console (kernel)
    }
    return Boolean(node_process_1.default.env.CI)
        || Boolean(node_process_1.default.env.WT_SESSION) // Windows Terminal
        || Boolean(node_process_1.default.env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
        || node_process_1.default.env.ConEmuTask === '{cmd::Cmder}' // ConEmu and cmder
        || node_process_1.default.env.TERM_PROGRAM === 'Terminus-Sublime'
        || node_process_1.default.env.TERM_PROGRAM === 'vscode'
        || node_process_1.default.env.TERM === 'xterm-256color'
        || node_process_1.default.env.TERM === 'alacritty'
        || node_process_1.default.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}
exports.default = isUnicodeSupported;
//# sourceMappingURL=is-unicode-supported.js.map