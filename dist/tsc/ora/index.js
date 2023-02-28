"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oraPromise = void 0;
const tslib_1 = require("tslib");
const node_process_1 = tslib_1.__importDefault(require("node:process"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const cli_cursor_1 = tslib_1.__importDefault(require("./cli-cursor"));
const cli_spinners_1 = tslib_1.__importDefault(require("cli-spinners"));
const log_symbols_1 = tslib_1.__importDefault(require("./log-symbols"));
const strip_ansi_1 = tslib_1.__importDefault(require("./strip-ansi"));
const wcwidth_1 = tslib_1.__importDefault(require("wcwidth"));
const is_interactive_1 = tslib_1.__importDefault(require("./is-interactive"));
const is_unicode_supported_1 = tslib_1.__importDefault(require("./is-unicode-supported"));
const utilities_1 = require("./utilities");
let stdinDiscarder;
class Ora {
    #linesToClear = 0;
    #isDiscardingStdin = false;
    #lineCount = 0;
    #frameIndex = 0;
    #options;
    #spinner;
    #stream;
    #id;
    #initialInterval;
    #isEnabled;
    #isSilent;
    #indent;
    #text;
    #prefixText;
    _stream;
    _isEnabled;
    lastIndent;
    color;
    constructor(options) {
        if (!stdinDiscarder) {
            stdinDiscarder = new utilities_1.StdinDiscarder();
        }
        if (typeof options === 'string') {
            options = {
                text: options,
            };
        }
        this.#options = {
            color: 'cyan',
            stream: node_process_1.default.stderr,
            discardStdin: true,
            hideCursor: true,
            ...options,
        };
        // Public
        this.color = this.#options.color;
        // It's important that these use the public setters.
        this.spinner = this.#options.spinner;
        this.#initialInterval = this.#options.interval;
        this.#stream = this.#options.stream;
        this.#isEnabled = typeof this.#options.isEnabled === 'boolean' ? this.#options.isEnabled : (0, is_interactive_1.default)({ stream: this.#stream });
        this.#isSilent = typeof this.#options.isSilent === 'boolean' ? this.#options.isSilent : false;
        // Set *after* `this.#stream`.
        // It's important that these use the public setters.
        this.text = this.#options.text;
        this.prefixText = this.#options.prefixText;
        this.indent = this.#options.indent;
        if (node_process_1.default.env.NODE_ENV === 'test') {
            this._stream = this.#stream;
            this._isEnabled = this.#isEnabled;
            Object.defineProperty(this, '_linesToClear', {
                get() {
                    return this.#linesToClear;
                },
                set(newValue) {
                    this.#linesToClear = newValue;
                },
            });
            Object.defineProperty(this, '_frameIndex', {
                get() {
                    return this.#frameIndex;
                },
            });
            Object.defineProperty(this, '_lineCount', {
                get() {
                    return this.#lineCount;
                },
            });
        }
    }
    get indent() {
        return this.#indent;
    }
    set indent(indent) {
        if (!indent)
            indent = 0;
        if (!(indent >= 0 && Number.isInteger(indent))) {
            throw new Error('The `indent` option must be an integer from 0 and up');
        }
        this.#indent = indent;
        this.updateLineCount();
    }
    get interval() {
        return this.#initialInterval || this.#spinner.interval || 100;
    }
    get spinner() {
        return this.#spinner;
    }
    set spinner(spinner) {
        this.#frameIndex = 0;
        this.#initialInterval = undefined;
        if (typeof spinner === 'object') {
            if (spinner.frames === undefined) {
                throw new Error('The given spinner must have a `frames` property');
            }
            this.#spinner = spinner;
        }
        else if (!(0, is_unicode_supported_1.default)()) {
            this.#spinner = cli_spinners_1.default.line;
        }
        else if (spinner === undefined) {
            // Set default spinner
            this.#spinner = cli_spinners_1.default.dots;
        }
        else if (spinner !== 'default' && cli_spinners_1.default[spinner]) {
            this.#spinner = cli_spinners_1.default[spinner];
        }
        else {
            throw new Error(`There is no built-in spinner named '${spinner}'. See https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json for a full list.`);
        }
    }
    get text() {
        return this.#text;
    }
    set text(value) {
        this.#text = value || '';
        this.updateLineCount();
    }
    get prefixText() {
        return this.#prefixText;
    }
    set prefixText(value) {
        this.#prefixText = value || '';
        this.updateLineCount();
    }
    get isSpinning() {
        return this.#id !== undefined;
    }
    // TODO: Use private methods when targeting Node.js 14.
    getFullPrefixText(prefixText = this.#prefixText, postfix = ' ') {
        if (typeof prefixText === 'string' && prefixText !== '') {
            return prefixText + postfix;
        }
        if (typeof prefixText === 'function') {
            return prefixText() + postfix;
        }
        return '';
    }
    updateLineCount() {
        const columns = this.#stream.columns || 80;
        const fullPrefixText = this.getFullPrefixText(this.#prefixText, '-');
        this.#lineCount = 0;
        for (const line of (0, strip_ansi_1.default)(' '.repeat(this.#indent) + fullPrefixText + '--' + this.#text).split('\n')) {
            this.#lineCount += Math.max(1, Math.ceil((0, wcwidth_1.default)(line) / columns));
        }
    }
    get isEnabled() {
        return this.#isEnabled && !this.#isSilent;
    }
    set isEnabled(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError('The `isEnabled` option must be a boolean');
        }
        this.#isEnabled = value;
    }
    get isSilent() {
        return this.#isSilent;
    }
    set isSilent(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError('The `isSilent` option must be a boolean');
        }
        this.#isSilent = value;
    }
    frame() {
        const { frames } = this.#spinner;
        let frame = frames[this.#frameIndex];
        if (this.color) {
            frame = chalk_1.default[this.color](frame);
        }
        this.#frameIndex = ++this.#frameIndex % frames.length;
        const fullPrefixText = (typeof this.#prefixText === 'string' && this.#prefixText !== '') ? this.#prefixText + ' ' : '';
        const fullText = typeof this.text === 'string' ? ' ' + this.text : '';
        return fullPrefixText + frame + fullText;
    }
    clear() {
        if (!this.#isEnabled || !this.#stream.isTTY) {
            return this;
        }
        this.#stream.cursorTo(0);
        for (let index = 0; index < this.#linesToClear; index++) {
            if (index > 0) {
                this.#stream.moveCursor(0, -1);
            }
            this.#stream.clearLine(1);
        }
        if (this.#indent || this.lastIndent !== this.#indent) {
            this.#stream.cursorTo(this.#indent);
        }
        this.lastIndent = this.#indent;
        this.#linesToClear = 0;
        return this;
    }
    render() {
        if (this.#isSilent) {
            return this;
        }
        this.clear();
        this.#stream.write(this.frame());
        this.#linesToClear = this.#lineCount;
        return this;
    }
    start(text) {
        if (text) {
            this.text = text;
        }
        if (this.#isSilent) {
            return this;
        }
        if (!this.#isEnabled) {
            if (this.text) {
                this.#stream.write(`- ${this.text}\n`);
            }
            return this;
        }
        if (this.isSpinning) {
            return this;
        }
        if (this.#options.hideCursor) {
            cli_cursor_1.default.hide(this.#stream);
        }
        if (this.#options.discardStdin && node_process_1.default.stdin.isTTY) {
            this.#isDiscardingStdin = true;
            stdinDiscarder.start();
        }
        this.render();
        this.#id = setInterval(this.render.bind(this), this.interval);
        return this;
    }
    stop() {
        if (!this.#isEnabled) {
            return this;
        }
        clearInterval(this.#id);
        this.#id = undefined;
        this.#frameIndex = 0;
        this.clear();
        if (this.#options.hideCursor) {
            cli_cursor_1.default.show(this.#stream);
        }
        if (this.#options.discardStdin && node_process_1.default.stdin.isTTY && this.#isDiscardingStdin) {
            stdinDiscarder.stop();
            this.#isDiscardingStdin = false;
        }
        return this;
    }
    succeed(text) {
        return this.stopAndPersist({ symbol: log_symbols_1.default.success, text });
    }
    fail(text) {
        return this.stopAndPersist({ symbol: log_symbols_1.default.error, text });
    }
    warn(text) {
        return this.stopAndPersist({ symbol: log_symbols_1.default.warning, text });
    }
    info(text) {
        return this.stopAndPersist({ symbol: log_symbols_1.default.info, text });
    }
    stopAndPersist(options = {}) {
        if (this.#isSilent) {
            return this;
        }
        const prefixText = options.prefixText || this.#prefixText;
        const text = options.text || this.text;
        const fullText = (typeof text === 'string') ? ' ' + text : '';
        this.stop();
        this.#stream.write(`${this.getFullPrefixText(prefixText, ' ')}${options.symbol || ' '}${fullText}\n`);
        return this;
    }
}
function ora(options) {
    return new Ora(options);
}
exports.default = ora;
async function oraPromise(action, options) {
    const actionIsFunction = typeof action === 'function';
    const actionIsPromise = typeof action.then === 'function';
    if (!actionIsFunction && !actionIsPromise) {
        throw new TypeError('Parameter `action` must be a Function or a Promise');
    }
    const { successText, failText } = typeof options === 'object'
        ? options
        : { successText: undefined, failText: undefined };
    const spinner = ora(options).start();
    try {
        const promise = actionIsFunction ? action(spinner) : action;
        const result = await promise;
        spinner.succeed(successText === undefined
            ? undefined
            : (typeof successText === 'string' ? successText : successText(result)));
        return result;
    }
    catch (error) {
        spinner.fail(failText === undefined
            ? undefined
            : (typeof failText === 'string' ? failText : failText(error)));
        throw error;
    }
}
exports.oraPromise = oraPromise;
//# sourceMappingURL=index.js.map