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
const mockedUserData = {
    id: "6533c98d0e12fb0e3ec616ff",
    Client_ID: "test",
    Redirect_URI: "test",
    Release_Radar_code: "test",
    Username: "test",
    Client_Secret: "test",
    __v: 0,
};
// this all works now - leave as is
describe("Express Server", () => {
    beforeAll(() => {
        jest.spyOn(spotifySignUpSchema_1.default.prototype, "save").mockImplementation(() => {
            return Promise.resolve(mockedUserData);
        });
    });
    it("sign_up redirects to account_creation_successful if no existing records have the same client ID and all fields are present", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/sign_up")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("Username=test&Client_ID=test&Client_Secret=test&Redirect_URI=test&Release_Radar_code=test&signup=signup");
        expect(response.header.location).toMatch("http://localhost:3000/account_creation_successful");
    }));
    it("sign_up redirects to account_already_exists if Client_ID matches one in database ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/sign_up")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("Client_ID=93df828bbcc848da91f1fcf931fd40a4&Redirect_URI=http://localhost:3333/spotify_login_callback&Release_Radar_code=37i9dQZEVXbpTERBYDw7WM&Username=Frederico&Client_Secret=772b452f59204c60818f4a089ae06fcc&signup=signup");
        expect(response.header.location).toMatch("http://localhost:3000/account_already_exists");
    }));
    it("sign_up returns One or more required fields are missing if any fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.app)
            .post("/sign_up")
            .set("Content-Type", "application/x-www-form-urlencoded")
            .send("Redirect_URI=http://localhost:3333/spotify_login_callback&Release_Radar_code=37i9dQZEVXbpTERBYDw7WM&Username=Frederico&Client_Secret=772b452f59204c60818f4a089ae06fcc&signup=signup");
        expect(response.text).toBe("One or more required fields are missing");
    }));
    afterAll(() => {
        jest.clearAllMocks();
    });
});
