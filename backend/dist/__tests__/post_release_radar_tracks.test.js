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
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const mockBodyNotInMongo = {
    objectFromFrontEnd: [
        {
            artist: "test",
            trackName: "test",
            trackSpotifyID: "test",
            dateAdded: "test",
            album: "test",
            albumReleaseDate: "test",
            albumImage: "test",
        },
    ],
    ID: "93df828bbcc848da91f1fcf931fd40a4",
};
const mockBodyInMongo = {
    objectFromFrontEnd: [
        {
            artist: "Paranoid London,Mutado Pintado",
            trackName: "The Motion with Mutado Pintado",
            trackSpotifyID: "4znWX9QM81qElSPGCz6YXp",
            dateAdded: "2024-02-09T00:00:00Z",
            album: "Arseholes, Liars, and Electronic Pioneers",
            albumReleaseDate: "2024-02-09",
            albumImage: "https://i.scdn.co/image/ab67616d0000b2738196a30a8c3594adab006771",
        },
    ],
    ID: "93df828bbcc848da91f1fcf931fd40a4",
};
describe("postReleaseRadarTracksToMongo tests - testing input against output", () => {
    it("postReleaseRadarTracksToMongo returns a track that is not present in mongoDB", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockFunctionCall = yield (0, server_1.postReleaseRadarTracksToMongo)(mockBodyNotInMongo.objectFromFrontEnd, mockBodyNotInMongo.ID);
        expect(mockFunctionCall).toEqual([
            {
                artist: "test",
                trackName: "test",
                trackSpotifyID: "test",
                dateAdded: "test",
                album: "test",
                albumReleaseDate: "test",
                albumImage: "test",
            },
        ]);
    }));
    it("/post_release_radar_tracks.test input = test track which IS present on record, output = empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockFunctionCall = yield (0, server_1.postReleaseRadarTracksToMongo)(mockBodyInMongo.objectFromFrontEnd, mockBodyInMongo.ID);
        expect(mockFunctionCall).toEqual([]);
    }));
});
