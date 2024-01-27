import {axiosCallFunctionRadarCodeFromMongoSlice} from './slices/radarCodeFromMongoSlice';
import { createAsyncThunk } from "@reduxjs/toolkit";


export const RadarCodeFromMongoSliceThunk = createAsyncThunk(
    "mongoCode/RadarCodeFromMongoSliceThunk",
    async () => {
      const response = await axiosCallFunctionRadarCodeFromMongoSlice();
  
      return response;
    }
  );