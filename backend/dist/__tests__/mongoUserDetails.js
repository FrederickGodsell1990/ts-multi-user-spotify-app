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
const spotifySignUpSchema_1 = __importDefault(require("../mongoDBModels/spotifySignUpSchema"));
describe("/mongo_user_details endpoint tests", () => {
    const fredericoDataFromMongoDB = {
        id: "6525ba0febc0673d33303f74",
        Client_ID: "93df828bbcc848da91f1fcf931fd40a4",
        Redirect_URI: "http://localhost:3333/spotify_login_callback",
        Release_Radar_code: "37i9dQZEVXbpTERBYDw7WM",
        Username: "Frederico",
        Client_Secret: "772b452f59204c60818f4a089ae06fcc",
        __v: 0,
    };
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it("/mongo_user_details called with valid getClientID value successfully calls mongoDB", () => __awaiter(void 0, void 0, void 0, function* () {
        const findOneSpy = jest
            // <any, string> is needed here otherwise the TS file will error - solution found on stackoverflow
            .spyOn(spotifySignUpSchema_1.default, "findOne")
            .mockReturnValue(Promise.resolve(fredericoDataFromMongoDB));
        // weirdly, even though 'response' is greyed out, you still need it the test to make the call
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/mongo_user_details")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("getClientID=93df828bbcc848da91f1fcf931fd40a4");
        expect(findOneSpy).toHaveBeenCalledWith({
            Client_ID: "93df828bbcc848da91f1fcf931fd40a4",
        });
    }));
    it("/mongo_user_details returns the correct res.send when given valid client ID - positive test", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedValue = "37i9dQZEVXbpTERBYDw7WM";
        // Call your route with supertest
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/mongo_user_details")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("getClientID=93df828bbcc848da91f1fcf931fd40a4");
        // Assert the response body
        expect(response.text).toEqual(expectedValue);
    }));
    it("/mongo_user_details returns the correct res.send when given valid client ID, though different ID to previous test - positive test", () => __awaiter(void 0, void 0, void 0, function* () {
        const expectedValue = "37i9dQZEVXbftpojYxNDUm";
        // Call your route with supertest
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/mongo_user_details")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("getClientID=a3d31807124d40248f802fbbdaca4476");
        // Assert the response body
        expect(response.text).toEqual(expectedValue);
    }));
    it("/mongo_user_details returns 'No account exists' when given invalid client ID - negative test", () => __awaiter(void 0, void 0, void 0, function* () {
        // Call your route with supertest
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/mongo_user_details")
            .set("Content-Type", "application/x-www-form-urlencoded")
            // invalid ID here
            .send("getClientID=a3d31807124d40248f802fbbdaca4477");
        // Assert the response body
        console.log('response.tex', response.text);
        expect(response.text).toEqual('No account exists');
    }));
});
