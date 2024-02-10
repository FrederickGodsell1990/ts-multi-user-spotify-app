import { createStore, combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import RadarCodeFromMongoSlice from "./slices/radarCodeFromMongoSlice";

import usernameReducer from "./userNameReducer";
import userDetailsReducer from "./userDetailsReducer";
import releaseRadarReducer from "./releaseRaderReducer";

const store = configureStore({
  reducer: {
    username: usernameReducer,
    userDetails: userDetailsReducer,
    releaseRadar: releaseRadarReducer,
    mongoDBThunk: RadarCodeFromMongoSlice.reducer,
  },
});

export default store;
