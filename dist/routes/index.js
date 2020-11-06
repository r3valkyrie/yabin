"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const sha1_1 = __importDefault(require("sha1"));
dotenv_1.default.config();
exports.register = (app) => {
    app.use(body_parser_1.default.urlencoded({ extended: false }));
    app.use(body_parser_1.default.json());
    app.get('/', (req, res) => {
        res.render('index');
    });
    app.post('/new', (req, res) => {
        res.send(sha1_1.default(req.body.content));
    });
    console.log(process.env.APP_URL[-1]);
};
//# sourceMappingURL=index.js.map