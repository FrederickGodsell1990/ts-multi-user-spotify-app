import { createStore, combineReducers, applyMiddleware } from "redux";
import { configureStore } from '@reduxjs/toolkit';

import releaseRadarSlice from './slices/releaseRadarSlice';
import RadarCodeFromMongoSlice from './slices/radarCodeFromMongoSlice'

import usernameReducer from "./userNameReducer";
import userDetailsReducer from "./userDetailsReducer";
import releaseRadarReducer from "./releaseRaderReducer";
 



const store = configureStore({
    reducer: {
        username: usernameReducer,
        userDetails : userDetailsReducer,
        releaseRadar: releaseRadarReducer,
        releaseRadarThunk : releaseRadarSlice.reducer,
        mongoDBThunk : RadarCodeFromMongoSlice.reducer
        // Add more reducers as needed
      }, 
  });
  


  export default store;