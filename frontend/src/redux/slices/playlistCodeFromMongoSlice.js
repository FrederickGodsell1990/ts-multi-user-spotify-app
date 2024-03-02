import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  getClientID,
  getURI,
} from "../../accessTokenManagement.js";
import {PlaylistsFfromMongoSliceThunk} from '../thunks'

export const axiosCallPlaylistFromMongoSlice = async () => {

    const body = {
        ID: getClientID,
      };
    

  try {
    const { data } = await axios.post(
        `${getURI}/get_playlists_from_database`,
        body,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      const arrayOfPlaylists = data.fullArrayOfPlaylistsFromMongo.playlistData;
      console.log('arrayOfPlaylists in axiosCallPlaylistFromMongoSlice', arrayOfPlaylists)
    return arrayOfPlaylists;
  } catch (error) {
    console.log(error);
  }
};


const initialState = {
  initialStatePlaylistBody: [],
  status: "idle",
  error: null,
};

const PlaylistCodeFromMongoSlice = createSlice({
  name: "initialStatePlaylistBody",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PlaylistsFfromMongoSliceThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(PlaylistsFfromMongoSliceThunk.fulfilled, (state, action) => {
       
        state.status = "succeeded";
        state.initialStatePlaylistBody = action.payload;
      })
      .addCase(PlaylistsFfromMongoSliceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default PlaylistCodeFromMongoSlice;
