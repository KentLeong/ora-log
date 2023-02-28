'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const spinners = Object.assign({}, require('./spinners.json')); // eslint-disable-line import/extensions
const spinnersList = Object.keys(spinners);
Object.defineProperty(spinners, 'random', {
    get() {
        const randomIndex = Math.floor(Math.random() * spinnersList.length);
        const spinnerName = spinnersList[randomIndex];
        return spinners[spinnerName];
    }
});
exports.default = spinners;
//# sourceMappingURL=cli-spinners.js.map