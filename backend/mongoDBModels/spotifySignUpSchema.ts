import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;

const SpotifySignUpSchema = new Schema({
  Client_ID: {
    type: String,
    required: true,
  },
  Redirect_URI: {
    type: String,
    required: true,
  },
  Release_Radar_code: {
    type: String,
    required: true,
  },
  Username: {
    type: String,
    required: true,
  },
  Client_Secret: {
    type: String,
    required: true,
  },
  playlistData: [
    {
      monthAndYearCreated: {
        type: String,
        required: false,
      },
      playlistSpotifyID: {
        type: String,
        required: false,
      },
      playlistName: {
        type: String,
        required: false,
      },
    },
  ],
  releaseRadarData: [
    {
      artist: {
        type: String,
        required: false,
      },
      trackName: {
        type: String,
        required: false,
      },
      trackSpotifyID: {
        type: String,
        required: false,
      },
      dateAdded: {
        type: String,
        required: false,
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
    },
  ],
});

export default mongoose.model("SpotifySignUpSchema", SpotifySignUpSchema);
