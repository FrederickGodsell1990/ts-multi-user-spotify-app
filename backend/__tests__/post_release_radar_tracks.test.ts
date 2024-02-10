import request from "supertest";
import { app, server, port, postReleaseRadarTracksToMongo } from "../server";
import SpotifySignUpSchema from "../mongoDBModels/spotifySignUpSchema";

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
      albumImage:
        "https://i.scdn.co/image/ab67616d0000b2738196a30a8c3594adab006771",
    },
  ],
  ID: "93df828bbcc848da91f1fcf931fd40a4",
};

describe("postReleaseRadarTracksToMongo tests - testing input against output", () => {

  it("postReleaseRadarTracksToMongo returns a track that is not present in mongoDB", async () => {
    const mockFunctionCall = await postReleaseRadarTracksToMongo(
      mockBodyNotInMongo.objectFromFrontEnd,
      mockBodyNotInMongo.ID
    );

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
  });

  it("/post_release_radar_tracks.test input = test track which IS present on record, output = empty array", async () => {
    const mockFunctionCall = await postReleaseRadarTracksToMongo(
      mockBodyInMongo.objectFromFrontEnd,
      mockBodyInMongo.ID
    );

    expect(mockFunctionCall).toEqual([]);
  });
});
