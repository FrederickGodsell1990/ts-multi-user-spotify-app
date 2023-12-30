"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.server = exports.spotifyAuthAxiosPostRequst = exports.logInRoute = exports.GlobalClientID = exports.port = exports.app = void 0;
require("dotenv/config.js");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const testSchema_1 = __importDefault(require("./mongoDBModels/testSchema"));
const spotifySignUpSchema_1 = __importDefault(require("./mongoDBModels/spotifySignUpSchema"));
const querystring_1 = __importDefault(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const FRONTEND_URI = process.env.FRONTEND_URI;
const REDIRECT_URI = process.env.REDIRECT_URI;
exports.app = (0, express_1.default)();
exports.port = process.env.NODE_ENV === "test" ? getRandomPort() : process.env.PORT || 3333;
// export const port = process.env.NODE_ENV === "test" ? getRandomPort() : 3333;
const path = __importStar(require("path"));
function getRandomPort() {
    return Math.floor(Math.random() * (5000 - 3000) + 3000);
}
// bodyParser with extended : false needed to receive form data
exports.app.use(body_parser_1.default.urlencoded({ extended: false }));
exports.app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from any origin; consider limiting this to your actual frontend URL
    res.setHeader("Access-Control-Allow-Credentials", "true"); // If your frontend includes credentials in the request, set this to 'true'
    next();
});
exports.app.use((0, cors_1.default)());
// Sample route
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, Express server with TypeScript!");
// });
exports.app.post("/frontend_data_to_server", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("req.body is;", req.body);
    const testDataSchemaOnBackEnd = new testSchema_1.default({
        testData: (_a = req.body) === null || _a === void 0 ? void 0 : _a.testData,
    });
    try {
        const saveToBackEnd = yield testDataSchemaOnBackEnd.save();
        res.send(saveToBackEnd);
    }
    catch (error) {
        console.log(error);
    }
}));
exports.app.post("/sign_up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Client_ID, Redirect_URI, Release_Radar_code, Username, signup, Client_Secret, } = yield req.body;
    // indicates that the post request is a first time sign up
    if (Username &&
        Client_ID &&
        Redirect_URI &&
        Release_Radar_code &&
        signup &&
        Client_Secret) {
        (function checkForDuplicateAccount() {
            var _a, _b, _c, _d, _e;
            return __awaiter(this, void 0, void 0, function* () {
                const checkForExistingAccounts = yield spotifySignUpSchema_1.default.findOne({
                    Client_ID: Client_ID,
                });
                if (checkForExistingAccounts) {
                    res.redirect(`${FRONTEND_URI}/account_already_exists`);
                    // // below works locally
                    // res.redirect("http://localhost:3000/account_already_exists");
                }
                else if (!checkForExistingAccounts) {
                    try {
                        const saveSpotifySignUpDetailToDatabase = new spotifySignUpSchema_1.default({
                            Client_ID: (_a = req.body) === null || _a === void 0 ? void 0 : _a.Client_ID,
                            Redirect_URI: (_b = req.body) === null || _b === void 0 ? void 0 : _b.Redirect_URI,
                            Release_Radar_code: (_c = req.body) === null || _c === void 0 ? void 0 : _c.Release_Radar_code,
                            Username: (_d = req.body) === null || _d === void 0 ? void 0 : _d.Username,
                            Client_Secret: (_e = req.body) === null || _e === void 0 ? void 0 : _e.Client_Secret,
                        });
                        const postDetailsToDatabase = yield saveSpotifySignUpDetailToDatabase.save();
                        postDetailsToDatabase;
                        res.redirect(`${FRONTEND_URI}/account_creation_successful`);
                        // // below works locally
                        // res.redirect("http://localhost:3000/account_creation_successful");
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            });
        })();
    }
    else {
        // Handle the case where one of the required variables is missing
        res.status(400).send("One or more required fields are missing");
    }
}));
exports.logInRoute = exports.app.post("/log_in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { Client_ID, Username } = yield (req === null || req === void 0 ? void 0 : req.body);
    // assigning GlobalClientID an actual value here. It will only be changed if a different person signs in
    exports.GlobalClientID = Client_ID;
    const userAcccountDetails = yield spotifySignUpSchema_1.default.findOne({
        Client_ID: Client_ID,
    });
    if (userAcccountDetails && userAcccountDetails.Username !== Username) {
        res.send("Usernames do not match");
    }
    else if (userAcccountDetails &&
        userAcccountDetails.Username === Username) {
        //// to next 4 slashes it copied from /post_spotify_login_details
        const generateRandomString = (length) => {
            let text = "";
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        };
        const state = generateRandomString(16);
        const scope = "user-read-private user-read-email user-follow-modify user-follow-read user-top-read playlist-modify-public playlist-modify-private";
        const stateKey = "spotify_auth_state";
        res.cookie(stateKey, state);
        // REMEBER TO CHANGE THE REDIRECT URI WHEN YOU PUSH TO PRODUCTION
        const queryParams = {
            client_id: Client_ID,
            response_type: "code",
            redirect_uri: REDIRECT_URI,
            state,
            scope,
        };
        const queryParamsString = querystring_1.default.stringify(queryParams);
        const authorizationUrl = `https://accounts.spotify.com/authorize?${queryParamsString}`;
        res.redirect(authorizationUrl);
    }
    else if (!userAcccountDetails) {
        res.redirect(`${FRONTEND_URI}/no_existing_account`);
        // // below works locally
        // res.redirect("http://localhost:3000/no_existing_account");
    }
}));
// function to authorise Spotify seperate for testing
const spotifyAuthAxiosPostRequst = (Client_ID, Client_Secret, Redirect_URI, code) => __awaiter(void 0, void 0, void 0, function* () {
    const authVariable = `Basic ${Buffer.from(`${Client_ID}:${Client_Secret}`).toString("base64")}`;
    try {
        const responseWhole = yield (0, axios_1.default)({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            data: querystring_1.default.stringify({
                grant_type: "authorization_code",
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: authVariable,
            },
        });
        // returning the entire response to be destructured upon return
        return responseWhole;
    }
    catch (error) {
        console.log(error);
    }
});
exports.spotifyAuthAxiosPostRequst = spotifyAuthAxiosPostRequst;
exports.app.get("/spotify_login_callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let userAccountDetails = yield spotifySignUpSchema_1.default.findOne({
        Client_ID: exports.GlobalClientID,
    });
    if (userAccountDetails) {
        // Destructure the properties using the SpotifySignUpDocument type
        const { Redirect_URI, Client_ID, Release_Radar_code, Username, Client_Secret, } = userAccountDetails;
        const code = req.query.code || "";
        // calling the function to return access token here
        const responseFromAxiosSpotifyAtuhorisation = yield (0, exports.spotifyAuthAxiosPostRequst)(Client_ID, Client_Secret, Redirect_URI, code);
        if (responseFromAxiosSpotifyAtuhorisation) {
            const { access_token, token_type, refresh_token, expires_in } = yield (responseFromAxiosSpotifyAtuhorisation === null || responseFromAxiosSpotifyAtuhorisation === void 0 ? void 0 : responseFromAxiosSpotifyAtuhorisation.data);
            const queryParams = querystring_1.default.stringify({
                access_token,
                refresh_token,
                expires_in,
                Client_ID,
            });
            // add on heroku deploy
            res.redirect(`${FRONTEND_URI}?${queryParams}`);
            // // below works locally
            // res.redirect(`http://localhost:3000/?${queryParams}`);
        }
        else {
            res.redirect(`/?${querystring_1.default.stringify({ error: "invalid_token" })}`);
        }
    }
}));
exports.app.get("/refresh_token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // spotify blocks app in 'developer mode' from connecting to different user dashboard from the same app
    // it gives the error - "User not registered in the Developer Dashboard" - why it does this, and the solution,
    // is explained in the link below. They do not allow hobby projects the extension
    // https://community.spotify.com/t5/Spotify-for-Developers/User-not-registered-in-the-Developer-Dashboard-on-get-profile/td-p/5260021
    const { refresh_token, client_id } = req.query;
    const userAcccountDetails = yield spotifySignUpSchema_1.default.findOne({
        Client_ID: client_id,
    });
    if (userAcccountDetails && userAcccountDetails.Client_Secret) {
        (0, axios_1.default)({
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            data: querystring_1.default.stringify({
                grant_type: "refresh_token",
                refresh_token: refresh_token,
            }),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${client_id}:${userAcccountDetails.Client_Secret}`).toString("base64")}`,
            },
        })
            .then((response) => {
            res.send(response.data);
        })
            .catch((error) => {
            res.send(error);
        });
    }
}));
exports.app.use(express_1.default.static(path.resolve(__dirname, '../../../frontend/build')));
exports.app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});
exports.server = mongoose_1.default
    .connect("mongodb+srv://frederickgodsell:Fs6pIF2Evt64PUs1@multiuserspotifyapp.fxm38gv.mongodb.net/?retryWrites=true&w=majority", {})
    .then((result) => {
    exports.app.listen(exports.port);
    console.log("Mongo listening");
    console.log(`Server is running on http://localhost:${exports.port}`);
})
    .catch((err) => console.log("err", err));
mongoose_1.default;
