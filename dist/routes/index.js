"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
exports.register = (app) => {
    app.get('/', (req, res) => {
        res.render('index');
    });
};
//# sourceMappingURL=index.js.map