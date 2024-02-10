import FavouriteArtistSearch from "./FavouriteArtistSearch.js";
import { NavBar } from "./navBar";
import React, { useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import ReleaseRaderAPICallFunction from "./components/ReleaseRadarComponent.js";
import { RadarCodeFromMongoSliceThunk } from "./redux/thunks";
import {useState} from 'react';

export const Homepage = () => {


  const dispatch = useDispatch();

  const {status, mongoCode} = useSelector((store) => store.mongoDBThunk);


  useEffect(() => {
    (async () => {
      dispatch(RadarCodeFromMongoSliceThunk());
    })();
  },[]);

  return (
    <>
      <NavBar />
      <FavouriteArtistSearch />
   
      <h5> Release Radar Code {mongoCode} </h5>
      {status === "succeeded" ? <ReleaseRaderAPICallFunction mongoCode={mongoCode} /> : null }
      <h5>All works sending only unique tracks to the backend and capturing them in Mongo</h5>
      
    </>
  );
};
