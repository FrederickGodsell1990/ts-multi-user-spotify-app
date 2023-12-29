"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = require("../server");
const mongodb_1 = require("mongodb");
describe("Express Server", () => {
    let connection;
    let db;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        connection = yield mongodb_1.MongoClient.connect("mongodb+srv://frederickgodsell:Fs6pIF2Evt64PUs1@multiuserspotifyapp.fxm38gv.mongodb.net/?retryWrites=true&w=majority");
        db = yield connection.db();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connection.close();
    }));
    it('responds with "Hello, Express server with TypeScript!" when making a GET request to /', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app).get("/");
        expect(response.status).toBe(200);
        expect(response.text).toBe("Hello, Express server with TypeScript!");
    }));
});
