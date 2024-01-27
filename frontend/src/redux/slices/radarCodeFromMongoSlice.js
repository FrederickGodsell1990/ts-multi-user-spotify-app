import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  accessToken,
  getClientID,
  getURI,
} from "../../accessTokenManagement.js";
import {RadarCodeFromMongoSliceThunk} from '../thunks'

export const axiosCallFunctionRadarCodeFromMongoSlice = async () => {
  try {
    const axiosCall = await axios.post(
      `${getURI}/mongo_user_details`,
      { getClientID },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
   

    return axiosCall.data;
  } catch (error) {
    console.log(error);
  }
};


const initialState = {
  mongoCode: [],
  status: "idle",
  error: null,
};

const RadarCodeFromMongoSlice = createSlice({
  name: "mongoCode",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(RadarCodeFromMongoSliceThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(RadarCodeFromMongoSliceThunk.fulfilled, (state, action) => {
       
        state.status = "succeeded";
        state.mongoCode = action.payload;
      })
      .addCase(RadarCodeFromMongoSliceThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default RadarCodeFromMongoSlice;
