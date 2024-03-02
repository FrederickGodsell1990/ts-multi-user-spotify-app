import {axiosCallFunctionRadarCodeFromMongoSlice} from './slices/radarCodeFromMongoSlice';
import {axiosCallPlaylistFromMongoSlice} from './slices/playlistCodeFromMongoSlice';
import { createAsyncThunk } from "@reduxjs/toolkit";


export const RadarCodeFromMongoSliceThunk = createAsyncThunk(
    "mongoCode/RadarCodeFromMongoSliceThunk",
    async () => {
      const response = await axiosCallFunctionRadarCodeFromMongoSlice();
  
      return response;
    }
  );

  export const PlaylistsFfromMongoSliceThunk = createAsyncThunk(
    "initialStatePlaylistBody/PlaylistMongoSliceThunk",
    async () => {
      const response = await axiosCallPlaylistFromMongoSlice();
  
      return response;
    }
  );