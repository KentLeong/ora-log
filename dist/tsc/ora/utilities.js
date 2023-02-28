"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StdinDiscarder = void 0;
const tslib_1 = require("tslib");
const node_process_1 = tslib_1.__importDefault(require("node:process"));
const node_readline_1 = tslib_1.__importDefault(require("node:readline"));
const bl_1 = require("bl");
const ASCII_ETX_CODE = 0x03; // Ctrl+C emits this code
class StdinDiscarder {
    #requests = 0;
    #mutedStream = new bl_1.BufferListStream();
    #ourEmit;
    #rl;
    constructor() {
        this.#mutedStream.pipe(node_process_1.default.stdout);
        const self = this; // eslint-disable-line unicorn/no-this-assignment
        this.#ourEmit = function (event, data, ...args) {
            const { stdin } = node_process_1.default;
            if (self.#requests > 0 || stdin.emit === self.#ourEmit) {
                if (event === 'keypress') { // Fixes readline behavior
                    return;
                }
                if (event === 'data' && data.includes(ASCII_ETX_CODE)) {
                    node_process_1.default.emit('SIGINT');
                }
                Reflect.apply(self.#ourEmit, this, [event, data, ...args]);
            }
            else {
                Reflect.apply(node_process_1.default.stdin.emit, this, [event, data, ...args]);
            }
        };
    }
    start() {
        this.#requests++;
        if (this.#requests === 1) {
            this._realStart();
        }
    }
    stop() {
        if (this.#requests <= 0) {
            throw new Error('`stop` called more times than `start`');
        }
        this.#requests--;
        if (this.#requests === 0) {
            this._realStop();
        }
    }
    // TODO: Use private methods when targeting Node.js 14.
    _realStart() {
        // No known way to make it work reliably on Windows
        if (node_process_1.default.platform === 'win32') {
            return;
        }
        this.#rl = node_readline_1.default.createInterface({
            input: node_process_1.default.stdin,
            output: this.#mutedStream,
        });
        this.#rl.on('SIGINT', () => {
            if (node_process_1.default.listenerCount('SIGINT') === 0) {
                node_process_1.default.emit('SIGINT');
            }
            else {
                this.#rl.close();
                node_process_1.default.kill(node_process_1.default.pid, 'SIGINT');
            }
        });
    }
    _realStop() {
        if (node_process_1.default.platform === 'win32') {
            return;
        }
        this.#rl.close();
        this.#rl = undefined;
    }
}
exports.StdinDiscarder = StdinDiscarder;
//# sourceMappingURL=utilities.js.map