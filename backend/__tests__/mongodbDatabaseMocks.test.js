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
const expectedData = {
    _id: "MockIDEllen",
    Client_ID: "a3d31807124d40248f802fbbdaca4476",
    Redirect_URI: "http://localhost:3333/spotify_login_callback",
    Release_Radar_code: "37i9dQZEVXbftpojYxNDUm",
    // Username: "Ellen",
    Username: "Smellen",
    Client_Secret: "8ca53ce8351b434ab79b2a9a26e6212f",
    __v: 0,
};
describe("Express Server", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    describe("logInRoute Tests", () => {
        it("correct details redirect to spotify authorisation URL", () => __awaiter(void 0, void 0, void 0, function* () {
            jest
                .spyOn(spotifySignUpSchema_1.default, "findOne")
                .mockReturnValue(Promise.resolve(expectedData));
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/log_in")
                .set("Content-Type", "application/x-www-form-urlencoded")
                // .send("Client_ID=a3d31807124d40248f802fbbdaca4476&Username=Ellen")
                .send("Client_ID=a3d31807124d40248f802fbbdaca4476&Username=Smellen");
            expect(response.header.location).toMatch(/https:\/\/accounts\.spotify\.com\/authorize\?.*state=.+&scope=.+/);
        }));
        it("existing Client ID but incorrect username returns `Usernames do not match` ", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/log_in")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .send("Client_ID=a3d31807124d40248f802fbbdaca4476&Username=Smellen");
            expect(response.text).toBe("Usernames do not match");
        }));
        it("Client_ID does not match any in the database redirects to no_existing_account", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/log_in")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .send("Client_ID=b4d31807124d40248f802fbbdaca4476&Username=Ellen");
            expect(response.header.location).toMatch("http://localhost:3000/no_existing_account");
        }));
        it("Using CLient ID and username that exist in the production database but not in the mocked data", () => __awaiter(void 0, void 0, void 0, function* () {
            const findOneSpy = jest
                // <any, string> is needed here otherwise the TS file will error - solution found on stackoverflow
                .spyOn(spotifySignUpSchema_1.default, "findOne")
                .mockReturnValue(Promise.resolve(expectedData));
            console.log("findOneSpy is", findOneSpy);
            // weirdly, even though 'response' is greyed out, you still need it the test to make the call
            const response = yield (0, supertest_1.default)(server_1.app)
                .post("/log_in")
                .set("Content-Type", "application/x-www-form-urlencoded")
                .send("Client_ID=93df828bbcc848da91f1fcf931fd40a4&Username=Frederico");
            expect(findOneSpy).toHaveBeenCalledWith({
                Client_ID: "93df828bbcc848da91f1fcf931fd40a4",
            });
        }));
    });
});
