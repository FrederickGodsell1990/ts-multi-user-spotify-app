"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// extract the schema from that mongoose object
const Schema = mongoose_1.default.Schema;
// create a new post schema
const releaseRadarSchema = new Schema({
    artist: {
        type: String,
        required: true,
    },
    trackName: {
        type: String,
        required: true,
    },
    trackSpotifyID: {
        type: String,
        required: true,
    },
    dateAdded: {
        type: String,
        required: true,
    },
    markedAsRemoved: {
        type: String,
        required: false,
    },
    album: {
        type: String,
        required: false,
    },
    albumReleaseDate: {
        type: String,
        required: false,
    },
    albumImage: {
        type: String,
        required: false,
    },
});
// export the model
exports.default = mongoose_1.default.model("ReleaseRadarModel", releaseRadarSchema);
