import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { accessToken } from "../../accessTokenManagement.js";


const token = accessToken;


const releaseRadarAxiosCallAsFunction = async (releaseRadarCode) => {
    try {
      const axiosCall = await axios.get(
        `https://api.spotify.com/v1/playlists/${releaseRadarCode}`, // hardcoded release rader playlist - can make dynamic
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("axiosCall from Slice", axiosCall);
      return axiosCall;
    } catch (error) {
      console.log(error);
    }
  };



export const fetchReleaseRadarData = createAsyncThunk(
  'releaseRadar/fetchReleaseRadarData',
  async (releaseRadarCode) => {
    const response = await releaseRadarAxiosCallAsFunction(releaseRadarCode);
    console.log('response from fetchReleaseRadarData', response)
    return response.data;
  },
);


const initialState = {
    releaseRadar: [],
  status: 'idle',
  error: null,
};

const releaseRadarSlice = createSlice({
  name: 'releaseRadar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReleaseRadarData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReleaseRadarData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userDetails = action.payload;
      })
      .addCase(fetchReleaseRadarData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default releaseRadarSlice;